-- Migration script for comprehensive guest management system
-- This script updates the existing guests table to support the new requirements

-- First, let's create a backup of existing data
CREATE TABLE IF NOT EXISTS guests_backup AS SELECT * FROM guests;

-- Drop the existing guests table to recreate with new schema
DROP TABLE IF EXISTS guests CASCADE;

-- Create the new comprehensive guests table
CREATE TABLE guests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Guest identification
  guest_name TEXT, -- Can be null for TBC guests
  
  -- Group management
  group_id TEXT, -- References groups.id for guests that belong to a group
  is_group_header BOOLEAN DEFAULT false, -- True for the main group record
  group_name TEXT, -- Only populated for group header records
  is_tbc BOOLEAN DEFAULT false, -- True for "To Be Confirmed" guests in groups
  
  -- Guest details
  side TEXT CHECK (side IN ('bride', 'groom')),
  is_child BOOLEAN DEFAULT false,
  child_age_category TEXT CHECK (child_age_category IN ('3_or_below', '4_to_12', 'above_12')),
  
  -- RSVP information
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not_attending')),
  events JSONB DEFAULT '[]', -- Array of events: ["wedding", "reception"]
  dietary_requirements TEXT,
  questions_for_couple TEXT,
  notes TEXT,
  
  -- RSVP submission tracking
  rsvp_submitted BOOLEAN DEFAULT false,
  rsvp_submitted_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create groups table for managing group information
CREATE TABLE groups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  group_name TEXT UNIQUE NOT NULL,
  total_guests INTEGER DEFAULT 0, -- Total number of guests (defined + TBC)
  defined_guests INTEGER DEFAULT 0, -- Number of guests with names
  tbc_guests INTEGER DEFAULT 0, -- Number of TBC guests
  rsvp_submitted BOOLEAN DEFAULT false,
  rsvp_submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_guests_guest_name ON guests(guest_name);
CREATE INDEX idx_guests_group_id ON guests(group_id);
CREATE INDEX idx_guests_is_group_header ON guests(is_group_header);
CREATE INDEX idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX idx_guests_side ON guests(side);
CREATE INDEX idx_guests_is_child ON guests(is_child);
CREATE INDEX idx_groups_group_name ON groups(group_name);

-- Create constraints to ensure data integrity
-- Ensure group header records have group_name
ALTER TABLE guests ADD CONSTRAINT check_group_header_has_name 
  CHECK (NOT is_group_header OR group_name IS NOT NULL);

-- Ensure non-group-header records don't have group_name
ALTER TABLE guests ADD CONSTRAINT check_non_header_no_group_name 
  CHECK (is_group_header OR group_name IS NULL);

-- Ensure TBC guests don't have guest_name
ALTER TABLE guests ADD CONSTRAINT check_tbc_no_name 
  CHECK (NOT is_tbc OR guest_name IS NULL);

-- Ensure child age category is only set for children
ALTER TABLE guests ADD CONSTRAINT check_child_age_category 
  CHECK (NOT is_child OR child_age_category IS NOT NULL);

-- Ensure non-children don't have age category
ALTER TABLE guests ADD CONSTRAINT check_non_child_no_age 
  CHECK (is_child OR child_age_category IS NULL);

-- Create function to update group counts
CREATE OR REPLACE FUNCTION update_group_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update counts for the affected group
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.group_id IS NOT NULL AND NOT NEW.is_group_header THEN
      UPDATE groups SET
        total_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = NEW.group_id AND NOT is_group_header
        ),
        defined_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = NEW.group_id AND NOT is_group_header AND guest_name IS NOT NULL
        ),
        tbc_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = NEW.group_id AND NOT is_group_header AND guest_name IS NULL
        ),
        updated_at = NOW()
      WHERE id = NEW.group_id;
    END IF;
  END IF;
  
  -- Handle deletions
  IF TG_OP = 'DELETE' THEN
    IF OLD.group_id IS NOT NULL AND NOT OLD.is_group_header THEN
      UPDATE groups SET
        total_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = OLD.group_id AND NOT is_group_header
        ),
        defined_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = OLD.group_id AND NOT is_group_header AND guest_name IS NOT NULL
        ),
        tbc_guests = (
          SELECT COUNT(*) FROM guests 
          WHERE group_id = OLD.group_id AND NOT is_group_header AND guest_name IS NULL
        ),
        updated_at = NOW()
      WHERE id = OLD.group_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update group counts
CREATE TRIGGER trigger_update_group_counts
  AFTER INSERT OR UPDATE OR DELETE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_group_counts();

-- Create function to check name uniqueness
CREATE OR REPLACE FUNCTION check_name_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if guest name conflicts with existing guest names (case insensitive)
  IF NEW.guest_name IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM guests 
      WHERE LOWER(guest_name) = LOWER(NEW.guest_name) 
      AND id != COALESCE(NEW.id, '')
    ) THEN
      RAISE EXCEPTION 'Guest name "%" already exists. Please use a different name.', NEW.guest_name;
    END IF;
    
    -- Check if guest name conflicts with group names (case insensitive)
    IF EXISTS (
      SELECT 1 FROM groups 
      WHERE LOWER(group_name) = LOWER(NEW.guest_name)
    ) THEN
      RAISE EXCEPTION 'Name "%" is already used as a group name. Please use a different name.', NEW.guest_name;
    END IF;
  END IF;
  
  -- Check if group name conflicts with existing group names (case insensitive)
  IF NEW.group_name IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM groups 
      WHERE LOWER(group_name) = LOWER(NEW.group_name) 
      AND id != COALESCE(NEW.group_id, '')
    ) THEN
      RAISE EXCEPTION 'Group name "%" already exists. Please use a different name.', NEW.group_name;
    END IF;
    
    -- Check if group name conflicts with guest names (case insensitive)
    IF EXISTS (
      SELECT 1 FROM guests 
      WHERE LOWER(guest_name) = LOWER(NEW.group_name)
    ) THEN
      RAISE EXCEPTION 'Name "%" is already used as a guest name. Please use a different name.', NEW.group_name;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for name uniqueness checking on guests table
CREATE TRIGGER trigger_check_guest_name_uniqueness
  BEFORE INSERT OR UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION check_name_uniqueness();

-- Create similar trigger for groups table
CREATE OR REPLACE FUNCTION check_group_name_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if group name conflicts with existing group names (case insensitive)
  IF EXISTS (
    SELECT 1 FROM groups 
    WHERE LOWER(group_name) = LOWER(NEW.group_name) 
    AND id != COALESCE(NEW.id, '')
  ) THEN
    RAISE EXCEPTION 'Group name "%" already exists. Please use a different name.', NEW.group_name;
  END IF;
  
  -- Check if group name conflicts with guest names (case insensitive)
  IF EXISTS (
    SELECT 1 FROM guests 
    WHERE LOWER(guest_name) = LOWER(NEW.group_name)
  ) THEN
    RAISE EXCEPTION 'Name "%" is already used as a guest name. Please use a different name.', NEW.group_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_group_name_uniqueness
  BEFORE INSERT OR UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION check_group_name_uniqueness();

-- Insert sample data for testing
INSERT INTO groups (id, group_name, total_guests, defined_guests, tbc_guests) VALUES
('group1', 'Smith Family', 3, 2, 1),
('group2', 'College Friends', 4, 4, 0);

-- Insert sample individual guests
INSERT INTO guests (id, guest_name, side, rsvp_status, events) VALUES
('guest1', 'John Doe', 'groom', 'pending', '["wedding", "reception"]'),
('guest2', 'Jane Smith', 'bride', 'attending', '["wedding", "reception"]');

-- Insert sample group guests
INSERT INTO guests (id, guest_name, group_id, side, rsvp_status, events, is_child, child_age_category) VALUES
('guest3', 'Bob Smith', 'group1', 'bride', 'attending', '["wedding", "reception"]', false, null),
('guest4', 'Alice Smith', 'group1', 'bride', 'attending', '["wedding", "reception"]', true, '4_to_12'),
('guest5', null, 'group1', null, 'pending', '[]', false, null); -- TBC guest

-- Insert group header records
INSERT INTO guests (id, group_id, group_name, is_group_header, rsvp_status) VALUES
('header1', 'group1', 'Smith Family', true, 'pending'),
('header2', 'group2', 'College Friends', true, 'pending');

-- Update the group counts (trigger will handle this automatically for future changes)
UPDATE groups SET
  total_guests = (SELECT COUNT(*) FROM guests WHERE group_id = groups.id AND NOT is_group_header),
  defined_guests = (SELECT COUNT(*) FROM guests WHERE group_id = groups.id AND NOT is_group_header AND guest_name IS NOT NULL),
  tbc_guests = (SELECT COUNT(*) FROM guests WHERE group_id = groups.id AND NOT is_group_header AND guest_name IS NULL);
