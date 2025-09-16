-- Create guests table for guest management
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255),
    group_name VARCHAR(255),
    side VARCHAR(50) CHECK (side IN ('bride', 'groom', 'both')),
    type VARCHAR(20) CHECK (type IN ('individual', 'group')) NOT NULL,
    rsvp_status VARCHAR(20) CHECK (rsvp_status IN ('pending', 'attending', 'not-attending')) DEFAULT 'pending',
    events TEXT[] DEFAULT '{}',
    dietary_requirements TEXT,
    max_group_size INTEGER,
    defined_guests INTEGER DEFAULT 0,
    tbc_guests INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_type ON guests(type);
CREATE INDEX IF NOT EXISTS idx_guests_group_name ON guests(group_name);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
