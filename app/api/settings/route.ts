import { NextResponse } from "next/server"
import { getSettingsCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const collection = await getSettingsCollection()
    const settings = await collection.findOne({ type: "wedding_settings" })

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        type: "wedding_settings",
        brideName: "Varnie",
        groomName: "Biraveen",
        weddingDate: "2026-03-27",
        ceremonyDate: "2026-03-27",
        receptionDate: "2026-03-28",
        venue: "Paphos, Cyprus",
        location: "Cyprus",
        allowVideoDownload: true,
        allowVideoFullscreen: true,
        galleryVisible: true,
        galleryAccessible: true,
        enableDanish: true,
        enableFrench: true,
        enableTamil: true,
        enableAutoLanguageDetection: true,
        lastUpdated: new Date().toISOString(),
      }
      await collection.insertOne(defaultSettings)
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const collection = await getSettingsCollection()

    const updatedSettings = {
      ...body,
      type: "wedding_settings",
      lastUpdated: new Date().toISOString(),
    }

    await collection.updateOne({ type: "wedding_settings" }, { $set: updatedSettings }, { upsert: true })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
