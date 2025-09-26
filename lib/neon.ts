import { neon } from "@neondatabase/serverless"

// Initialize the SQL client using the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL!)

// Database initialization function
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("[v0] Initializing database...")

    // Create admin_sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        user_data JSONB,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create guests table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        guest_id VARCHAR(255) UNIQUE NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'group')),
        group_name VARCHAR(255),
        guest_name VARCHAR(255),
        max_group_size INTEGER,
        group_members JSONB,
        notes TEXT,
        rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not-attending')),
        events JSONB DEFAULT '[]',
        dietary_requirements TEXT,
        questions TEXT,
        side VARCHAR(10) CHECK (side IN ('bride', 'groom')),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create budget_items table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS budget_items (
        id SERIAL PRIMARY KEY,
        item_id VARCHAR(255) UNIQUE NOT NULL,
        category1 VARCHAR(255) NOT NULL,
        category2 VARCHAR(255) NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        vendor VARCHAR(255) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'paid')),
        notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create wedding_settings table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS wedding_settings (
        id SERIAL PRIMARY KEY,
        bride_name VARCHAR(255) NOT NULL,
        groom_name VARCHAR(255) NOT NULL,
        wedding_date DATE NOT NULL,
        ceremony_date DATE NOT NULL,
        reception_date DATE NOT NULL,
        venue VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        allow_video_download BOOLEAN DEFAULT true,
        allow_video_fullscreen BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create content_pages table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS content_pages (
        id SERIAL PRIMARY KEY,
        page_key VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        enabled BOOLEAN DEFAULT true,
        page_order INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("[v0] Database initialization completed successfully")
  } catch (error) {
    console.error("[v0] Error initializing database:", error)
    throw error
  }
}

// Insert default settings if none exist
export async function insertDefaultSettings(): Promise<void> {
  try {
    // Check if settings already exist
    const existingSettings = await sql`SELECT COUNT(*) as count FROM wedding_settings`

    if (existingSettings[0].count === 0) {
      console.log("[v0] Inserting default wedding settings...")

      await sql`
        INSERT INTO wedding_settings (
          bride_name, groom_name, wedding_date, ceremony_date, reception_date,
          venue, location, allow_video_download, allow_video_fullscreen
        ) VALUES (
          'Varnie', 'Biraveen', '2026-03-27', '2026-03-27', '2026-03-28',
          'Paphos, Cyprus', 'Cyprus', true, true
        )
      `

      console.log("[v0] Default settings inserted successfully")
    }
  } catch (error) {
    console.error("[v0] Error inserting default settings:", error)
    throw error
  }
}

// Helper function to test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`
    console.log("[v0] Database connection test successful")
    return true
  } catch (error) {
    console.error("[v0] Database connection test failed:", error)
    return false
  }
}
