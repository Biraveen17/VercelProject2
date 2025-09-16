import { sql } from "@/lib/neon"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting guest management migration...")

    await sql`DROP TABLE IF EXISTS guests CASCADE`

    // Create new guests table with comprehensive schema
    await sql`
      CREATE TABLE guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        group_id INTEGER REFERENCES guest_groups(id) ON DELETE SET NULL,
        is_individual BOOLEAN NOT NULL DEFAULT true,
        is_tbc BOOLEAN NOT NULL DEFAULT false,
        child_age_category VARCHAR(20) CHECK (child_age_category IN ('0-2', '3-12', '13-17') OR child_age_category IS NULL),
        side VARCHAR(10) NOT NULL CHECK (side IN ('bride', 'groom')),
        rsvp_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not_attending')),
        attending_ceremony BOOLEAN DEFAULT NULL,
        attending_reception BOOLEAN DEFAULT NULL,
        dietary_requirements TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(name)
      )
    `

    // Create guest_groups table
    await sql`
      CREATE TABLE guest_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        side VARCHAR(10) NOT NULL CHECK (side IN ('bride', 'groom')),
        total_count INTEGER NOT NULL DEFAULT 0,
        defined_count INTEGER NOT NULL DEFAULT 0,
        tbc_count INTEGER NOT NULL DEFAULT 0,
        rsvp_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not_attending')),
        attending_ceremony BOOLEAN DEFAULT NULL,
        attending_reception BOOLEAN DEFAULT NULL,
        dietary_requirements TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create function to update group counts automatically
    await sql`
      CREATE OR REPLACE FUNCTION update_group_counts()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
          UPDATE guest_groups 
          SET 
            defined_count = (
              SELECT COUNT(*) FROM guests 
              WHERE group_id = COALESCE(NEW.group_id, OLD.group_id) AND is_tbc = false
            ),
            tbc_count = (
              SELECT COUNT(*) FROM guests 
              WHERE group_id = COALESCE(NEW.group_id, OLD.group_id) AND is_tbc = true
            ),
            updated_at = NOW()
          WHERE id = COALESCE(NEW.group_id, OLD.group_id);
        END IF;
        
        IF TG_OP = 'DELETE' THEN
          UPDATE guest_groups 
          SET 
            defined_count = (
              SELECT COUNT(*) FROM guests 
              WHERE group_id = OLD.group_id AND is_tbc = false
            ),
            tbc_count = (
              SELECT COUNT(*) FROM guests 
              WHERE group_id = OLD.group_id AND is_tbc = true
            ),
            updated_at = NOW()
          WHERE id = OLD.group_id;
        END IF;
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql
    `

    // Create triggers for automatic count updates
    await sql`
      DROP TRIGGER IF EXISTS trigger_update_group_counts ON guests
    `

    await sql`
      CREATE TRIGGER trigger_update_group_counts
      AFTER INSERT OR UPDATE OR DELETE ON guests
      FOR EACH ROW EXECUTE FUNCTION update_group_counts()
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_group_id ON guests(group_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_side ON guests(side)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_is_individual ON guests(is_individual)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_is_tbc ON guests(is_tbc)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guest_groups_name ON guest_groups(name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guest_groups_side ON guest_groups(side)`

    console.log("[v0] Guest management migration completed successfully")

    return NextResponse.json({
      success: true,
      message: "Guest management database migration completed successfully",
    })
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    return NextResponse.json({ success: false, error: "Migration failed", details: error }, { status: 500 })
  }
}
