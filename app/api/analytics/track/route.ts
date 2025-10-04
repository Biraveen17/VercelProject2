import { type NextRequest, NextResponse } from "next/server"
import { getPageVisitsCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, uniqueId, userAgent } = body

    console.log("[v0] Received tracking request for page:", page, "uniqueId:", uniqueId)

    // Get IP and location info from headers
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const country = request.headers.get("x-vercel-ip-country") || "unknown"
    const city = request.headers.get("x-vercel-ip-city") || "unknown"

    console.log("[v0] Location info - IP:", ip, "Country:", country, "City:", city)

    const pageVisitsCollection = await getPageVisitsCollection()

    const visit = {
      page,
      uniqueId,
      timestamp: new Date().toISOString(),
      ip,
      country,
      city,
      userAgent,
    }

    const result = await pageVisitsCollection.insertOne(visit)
    console.log("[v0] Visit inserted with ID:", result.insertedId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error tracking page visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
