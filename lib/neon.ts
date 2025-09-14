import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database initialization function
export async function initializeDatabase() {
  try {
    // Create guests table
    await sql`
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
      )
    `

    // Create budget_items table
    await sql`
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
      )
    `

    // Create wedding_settings table
    await sql`
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
      )
    `

    // Create content_pages table
    await sql`
      CREATE TABLE IF NOT EXISTS content_pages (
        id TEXT PRIMARY KEY,
        page_key TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        page_order INTEGER DEFAULT 1,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create spreadsheets table
    await sql`
      CREATE TABLE IF NOT EXISTS spreadsheets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cells JSONB DEFAULT '{}',
        last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create admin_sessions table for authentication
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        changes JSONB DEFAULT '[]'
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_type ON guests(type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_group_name ON guests(group_name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_budget_items_category1 ON budget_items(category1)`
    await sql`CREATE INDEX IF NOT EXISTS idx_budget_items_status ON budget_items(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_content_pages_page_key ON content_pages(page_key)`
    await sql`CREATE INDEX IF NOT EXISTS idx_content_pages_enabled ON content_pages(enabled)`

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}

// Helper function to insert default settings if they don't exist
export async function insertDefaultSettings() {
  try {
    const existingSettings = await sql`SELECT id FROM wedding_settings WHERE id = 'default'`

    if (existingSettings.length === 0) {
      await sql`
        INSERT INTO wedding_settings (
          id, bride_name, groom_name, wedding_date, ceremony_date, reception_date, venue, location
        ) VALUES (
          'default', 'Varnie', 'Biraveen', '2026-03-27', '2026-03-27', '2026-03-28', 'Paphos, Cyprus', 'Cyprus'
        )
      `
    }

    // Insert default content pages if they don't exist
    const defaultPages = [
      {
        page_key: "home",
        title: "Varnie & Biraveen",
        description: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
        content: "We are thrilled to invite you to join us as we begin our journey together as husband and wife...",
        page_order: 1,
      },
      {
        page_key: "events",
        title: "Wedding Events",
        description: "Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus",
        content: "Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities...",
        page_order: 2,
      },
      {
        page_key: "venue",
        title: "Venue & Location",
        description: "Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day",
        content: "Both our ceremony and reception will take place in stunning beachfront locations...",
        page_order: 3,
      },
      {
        page_key: "travel",
        title: "Travel to Cyprus",
        description: "Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus",
        content: "Cyprus is easily accessible from major European cities with direct flights to Paphos...",
        page_order: 4,
      },
      {
        page_key: "gallery",
        title: "Our Gallery",
        description: "Capturing the beautiful moments of our journey together",
        content: "Browse through our engagement photos and pre-wedding celebrations...",
        page_order: 5,
      },
    ]

    for (const page of defaultPages) {
      const existing = await sql`SELECT id FROM content_pages WHERE page_key = ${page.page_key}`
      if (existing.length === 0) {
        await sql`
          INSERT INTO content_pages (id, page_key, title, description, content, page_order)
          VALUES (${page.page_key}, ${page.page_key}, ${page.title}, ${page.description}, ${page.content}, ${page.page_order})
        `
      }
    }

    console.log("Default data inserted successfully")
    return true
  } catch (error) {
    console.error("Failed to insert default data:", error)
    return false
  }
}
