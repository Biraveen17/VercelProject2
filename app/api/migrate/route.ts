import { sql } from "@/lib/neon"
import { initializeDatabase, insertDefaultSettings } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    if (action === "initialize") {
      // Initialize database schema
      const initialized = await initializeDatabase()
      if (initialized) {
        await insertDefaultSettings()
        return NextResponse.json({ success: true, message: "Database initialized successfully" })
      } else {
        return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
      }
    }

    if (action === "migrate-localStorage") {
      // Migrate data from localStorage to database
      const { guests, budget, settings, content, spreadsheets } = data

      // Migrate guests
      if (guests && guests.length > 0) {
        for (const guest of guests) {
          await sql`
            INSERT INTO guests (
              id, type, group_name, guest_name, max_group_size, group_members,
              notes, rsvp_status, events, dietary_requirements, questions, side
            ) VALUES (
              ${guest.id}, ${guest.type}, ${guest.groupName}, ${guest.guestName},
              ${guest.maxGroupSize}, ${JSON.stringify(guest.groupMembers || [])},
              ${guest.notes}, ${guest.rsvpStatus}, ${JSON.stringify(guest.events || [])},
              ${guest.dietaryRequirements}, ${guest.questions}, ${guest.side}
            ) ON CONFLICT (id) DO NOTHING
          `
        }
      }

      // Migrate budget items
      if (budget && budget.length > 0) {
        for (const item of budget) {
          await sql`
            INSERT INTO budget_items (
              id, category1, category2, item_name, vendor, cost, status, notes
            ) VALUES (
              ${item.id}, ${item.category1}, ${item.category2}, ${item.itemName},
              ${item.vendor}, ${item.cost}, ${item.status}, ${item.notes}
            ) ON CONFLICT (id) DO NOTHING
          `
        }
      }

      // Migrate settings
      if (settings) {
        await sql`
          INSERT INTO wedding_settings (
            id, bride_name, groom_name, wedding_date, ceremony_date, reception_date,
            venue, location, allow_video_download, allow_video_fullscreen
          ) VALUES (
            'default', ${settings.brideName}, ${settings.groomName}, ${settings.weddingDate},
            ${settings.ceremonyDate}, ${settings.receptionDate}, ${settings.venue},
            ${settings.location}, ${settings.allowVideoDownload}, ${settings.allowVideoFullscreen}
          ) ON CONFLICT (id) DO UPDATE SET
            bride_name = ${settings.brideName},
            groom_name = ${settings.groomName},
            wedding_date = ${settings.weddingDate},
            ceremony_date = ${settings.ceremonyDate},
            reception_date = ${settings.receptionDate},
            venue = ${settings.venue},
            location = ${settings.location},
            allow_video_download = ${settings.allowVideoDownload},
            allow_video_fullscreen = ${settings.allowVideoFullscreen}
        `
      }

      // Migrate content
      if (content) {
        for (const [pageKey, pageData] of Object.entries(content)) {
          const page = pageData as any
          await sql`
            INSERT INTO content_pages (
              id, page_key, title, description, content, enabled, page_order
            ) VALUES (
              ${pageKey}, ${pageKey}, ${page.title}, ${page.description}, ${page.content},
              ${page.enabled}, ${page.order}
            ) ON CONFLICT (page_key) DO UPDATE SET
              title = ${page.title},
              description = ${page.description},
              content = ${page.content},
              enabled = ${page.enabled},
              page_order = ${page.order}
          `
        }
      }

      // Migrate spreadsheets
      if (spreadsheets && spreadsheets.length > 0) {
        for (const sheet of spreadsheets) {
          await sql`
            INSERT INTO spreadsheets (id, name, cells) 
            VALUES (${sheet.id}, ${sheet.name}, ${JSON.stringify(sheet.cells || {})})
            ON CONFLICT (id) DO NOTHING
          `
        }
      }

      return NextResponse.json({ success: true, message: "Data migrated successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: "Migration failed" }, { status: 500 })
  }
}
