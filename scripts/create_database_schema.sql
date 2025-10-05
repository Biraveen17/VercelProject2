-- Create admin_sessions table for authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    user_data TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create guests table for guest management
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(255),
    group_name VARCHAR(255),
    side VARCHAR(50),
    type VARCHAR(20) NOT NULL DEFAULT 'individual',
    rsvp_status VARCHAR(20) DEFAULT 'pending',
    events TEXT,
    dietary_requirements TEXT,
    max_group_size INTEGER,
    defined_guests INTEGER DEFAULT 0,
    tbc_guests INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
