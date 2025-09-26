import { loadSettings, saveSettings } from "@/lib/blob-storage"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    console.log("[v0] Settings API: Starting GET request")

    const settings = await loadSettings()

    if (!settings) {
      console.log("[v0] Settings API: No settings found, returning defaults")
      const defaultSettings = {
        id: "default",
        coupleNames: "Varnie & Biraveen",
        weddingDate: "2026-03-27",
        venue: "Paphos, Cyprus",
        rsvpDeadline: "2026-02-27",
        welcomeMessage: "Welcome to our wedding website!",
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return NextResponse.json({ data: defaultSettings })
    }

    console.log("[v0] Settings API: Returning settings:", settings)
    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error("[v0] Settings API: Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const settingsData = await request.json()

    const settings = {
      id: "default",
      coupleNames: settingsData.coupleNames || settingsData.brideName + " & " + settingsData.groomName,
      weddingDate: settingsData.weddingDate,
      venue: settingsData.venue,
      rsvpDeadline: settingsData.rsvpDeadline,
      welcomeMessage: settingsData.welcomeMessage,
      isPublic: settingsData.isPublic ?? true,
      createdAt: settingsData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveSettings(settings)
    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error("[v0] Settings API: Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
