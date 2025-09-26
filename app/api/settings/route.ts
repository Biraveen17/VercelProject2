import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Settings API: Starting GET request")

    const settingsCollection = await getCollection("wedding_settings")
    const settings = await settingsCollection.findOne({ _id: "default" })

    console.log("[v0] Settings API: Query result:", settings)

    if (!settings) {
      console.log("[v0] Settings API: No settings found, returning defaults")
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

    console.log("[v0] Settings API: Transforming settings data")
    // Transform database format back to frontend format
    const transformedSettings = {
      brideName: settings.bride_name || settings.brideName,
      groomName: settings.groom_name || settings.groomName,
      weddingDate: settings.wedding_date || settings.weddingDate,
      ceremonyDate: settings.ceremony_date || settings.ceremonyDate,
      receptionDate: settings.reception_date || settings.receptionDate,
      venue: settings.venue,
      location: settings.location,
      allowVideoDownload: settings.allow_video_download ?? settings.allowVideoDownload,
      allowVideoFullscreen: settings.allow_video_fullscreen ?? settings.allowVideoFullscreen,
    }

    console.log("[v0] Settings API: Returning transformed settings:", transformedSettings)
    return NextResponse.json({ data: transformedSettings })
  } catch (error) {
    console.error("[v0] Settings API: Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()

    const settingsCollection = await getCollection("wedding_settings")

    // Transform frontend format to MongoDB document
    const settingsDoc = {
      _id: "default",
      bride_name: settings.brideName,
      groom_name: settings.groomName,
      wedding_date: settings.weddingDate,
      ceremony_date: settings.ceremonyDate,
      reception_date: settings.receptionDate,
      venue: settings.venue,
      location: settings.location,
      allow_video_download: settings.allowVideoDownload,
      allow_video_fullscreen: settings.allowVideoFullscreen,
      updated_at: new Date().toISOString(),
    }

    // Use upsert to insert or update
    const result = await settingsCollection.findOneAndUpdate(
      { _id: "default" },
      { $set: settingsDoc },
      { upsert: true, returnDocument: "after" },
    )

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("[v0] Settings API: Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
