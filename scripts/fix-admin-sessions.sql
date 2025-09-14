-- Fix admin_sessions table schema to match API expectations
-- Drop the old table and recreate with correct schema

DROP TABLE IF EXISTS admin_sessions;

CREATE TABLE admin_sessions (
  session_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  user_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_username ON admin_sessions(username);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
