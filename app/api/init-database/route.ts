import { sql } from "@/lib/neon"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting database initialization...")

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
    console.log("[v0] Created guests table")

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
    console.log("[v0] Created budget_items table")

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
    console.log("[v0] Created wedding_settings table")

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
    console.log("[v0] Created content_pages table")

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
    console.log("[v0] Created spreadsheets table")

    // Create admin_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        session_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        user_data JSONB NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("[v0] Created admin_sessions table")

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_type ON guests(type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_group_name ON guests(group_name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_budget_items_category1 ON budget_items(category1)`
    await sql`CREATE INDEX IF NOT EXISTS idx_budget_items_status ON budget_items(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_content_pages_page_key ON content_pages(page_key)`
    await sql`CREATE INDEX IF NOT EXISTS idx_content_pages_enabled ON content_pages(enabled)`
    console.log("[v0] Created indexes")

    // Insert default wedding settings
    await sql`
      INSERT INTO wedding_settings (
        id, bride_name, groom_name, wedding_date, ceremony_date, reception_date, venue, location
      ) VALUES (
        'default', 'Varnie', 'Biraveen', '2026-03-27', '2026-03-27', '2026-03-28', 'Paphos, Cyprus', 'Cyprus'
      ) ON CONFLICT (id) DO NOTHING
    `
    console.log("[v0] Inserted default wedding settings")

    // Insert default content pages
    const contentPages = [
      {
        id: "home",
        page_key: "home",
        title: "Varnie & Biraveen",
        description: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
        content:
          "We are thrilled to invite you to join us as we begin our journey together as husband and wife. Our celebration will take place over two beautiful days in the stunning setting of Paphos, Cyprus, combining traditional Tamil Hindu ceremonies with modern festivities.",
        page_order: 1,
      },
      {
        id: "events",
        page_key: "events",
        title: "Wedding Events",
        description: "Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus",
        content:
          "Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities. The ceremony will take place on March 27th, followed by the reception on March 28th.",
        page_order: 2,
      },
      {
        id: "venue",
        page_key: "venue",
        title: "Venue & Location",
        description: "Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day",
        content:
          "Both our ceremony and reception will take place in stunning beachfront locations in Paphos, Cyprus, offering breathtaking views of the Mediterranean Sea.",
        page_order: 3,
      },
      {
        id: "travel",
        page_key: "travel",
        title: "Travel to Cyprus",
        description: "Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus",
        content:
          "Cyprus is easily accessible from major European cities with direct flights to Paphos International Airport. We recommend booking accommodations in advance as March is a popular time to visit.",
        page_order: 4,
      },
      {
        id: "gallery",
        page_key: "gallery",
        title: "Our Gallery",
        description: "Capturing the beautiful moments of our journey together",
        content: "Browse through our engagement photos and pre-wedding celebrations as we prepare for our special day.",
        page_order: 5,
      },
    ]

    for (const page of contentPages) {
      await sql`
        INSERT INTO content_pages (id, page_key, title, description, content, page_order)
        VALUES (${page.id}, ${page.page_key}, ${page.title}, ${page.description}, ${page.content}, ${page.page_order})
        ON CONFLICT (page_key) DO NOTHING
      `
    }
    console.log("[v0] Inserted default content pages")

    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log(
      "[v0] Created tables:",
      tables.map((t) => t.table_name),
    )

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
