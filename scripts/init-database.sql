-- Initialize Neon database schema for wedding website
-- This script creates all necessary tables and indexes

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('individual', 'group')),
  group_name TEXT,
  guest_name TEXT,
  max_group_size INTEGER,
  group_members JSONB,
  notes TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not-attending')),
  events JSONB DEFAULT '[]',
  dietary_requirements TEXT,
  questions TEXT,
  side TEXT CHECK (side IN ('bride', 'groom')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  category1 TEXT NOT NULL,
  category2 TEXT NOT NULL,
  item_name TEXT NOT NULL,
  vendor TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'paid')),
  notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wedding_settings table
CREATE TABLE IF NOT EXISTS wedding_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  ceremony_date DATE NOT NULL,
  reception_date DATE NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  allow_video_download BOOLEAN DEFAULT true,
  allow_video_fullscreen BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_pages table
CREATE TABLE IF NOT EXISTS content_pages (
  id TEXT PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  page_order INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spreadsheets table
CREATE TABLE IF NOT EXISTS spreadsheets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cells JSONB DEFAULT '{}',
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table for authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
  session_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  user_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_type ON guests(type);
CREATE INDEX IF NOT EXISTS idx_guests_group_name ON guests(group_name);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX IF NOT EXISTS idx_budget_items_category1 ON budget_items(category1);
CREATE INDEX IF NOT EXISTS idx_budget_items_status ON budget_items(status);
CREATE INDEX IF NOT EXISTS idx_content_pages_page_key ON content_pages(page_key);
CREATE INDEX IF NOT EXISTS idx_content_pages_enabled ON content_pages(enabled);

-- Insert default wedding settings
INSERT INTO wedding_settings (
  id, bride_name, groom_name, wedding_date, ceremony_date, reception_date, venue, location
) VALUES (
  'default', 'Varnie', 'Biraveen', '2026-03-27', '2026-03-27', '2026-03-28', 'Paphos, Cyprus', 'Cyprus'
) ON CONFLICT (id) DO NOTHING;

-- Insert default content pages
INSERT INTO content_pages (id, page_key, title, description, content, page_order) VALUES
('home', 'home', 'Varnie & Biraveen', 'Together with our families, we invite you to celebrate our Tamil Hindu wedding', 'We are thrilled to invite you to join us as we begin our journey together as husband and wife...', 1),
('events', 'events', 'Wedding Events', 'Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus', 'Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities...', 2),
('venue', 'venue', 'Venue & Location', 'Discover the beautiful venues in Paphos, Cyprus where we''ll celebrate our special day', 'Both our ceremony and reception will take place in stunning beachfront locations...', 3),
('travel', 'travel', 'Travel to Cyprus', 'Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus', 'Cyprus is easily accessible from major European cities with direct flights to Paphos...', 4),
('gallery', 'gallery', 'Our Gallery', 'Capturing the beautiful moments of our journey together', 'Browse through our engagement photos and pre-wedding celebrations...', 5)
ON CONFLICT (page_key) DO NOTHING;
