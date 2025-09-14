import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const settings = await sql`
      SELECT * FROM wedding_settings WHERE id = 'default'
    `

    if (settings.length === 0) {
      // Return default settings if none exist
      const defaultSettings = {
        brideName: "Varnie",
        groomName: "Biraveen",
        weddingDate: "2026-03-27",
        ceremonyDate: "2026-03-27",
        receptionDate: "2026-03-28",
        venue: "Paphos, Cyprus",
        location: "Cyprus",
        allowVideoDownload: true,
        allowVideoFullscreen: true,
      }
      return NextResponse.json({ data: defaultSettings })
    }

    // Transform database format back to frontend format
    const transformedSettings = {
      brideName: settings[0].bride_name,
      groomName: settings[0].groom_name,
      weddingDate: settings[0].wedding_date,
      ceremonyDate: settings[0].ceremony_date,
      receptionDate: settings[0].reception_date,
      venue: settings[0].venue,
      location: settings[0].location,
      allowVideoDownload: settings[0].allow_video_download,
      allowVideoFullscreen: settings[0].allow_video_fullscreen,
    }

    return NextResponse.json({ data: transformedSettings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()

    const result = await sql`
      INSERT INTO wedding_settings (
        id, bride_name, groom_name, wedding_date, ceremony_date, reception_date,
        venue, location, allow_video_download, allow_video_fullscreen, updated_at
      ) VALUES (
        'default', ${settings.brideName}, ${settings.groomName}, ${settings.weddingDate},
        ${settings.ceremonyDate}, ${settings.receptionDate}, ${settings.venue},
        ${settings.location}, ${settings.allowVideoDownload}, ${settings.allowVideoFullscreen}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        bride_name = ${settings.brideName},
        groom_name = ${settings.groomName},
        wedding_date = ${settings.weddingDate},
        ceremony_date = ${settings.ceremonyDate},
        reception_date = ${settings.receptionDate},
        venue = ${settings.venue},
        location = ${settings.location},
        allow_video_download = ${settings.allowVideoDownload},
        allow_video_fullscreen = ${settings.allowVideoFullscreen},
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
