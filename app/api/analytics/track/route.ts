import { type NextRequest, NextResponse } from "next/server"
import { getPageVisitsCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, uniqueId, userAgent } = body

    // Get IP and location info from headers
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const country = request.headers.get("x-vercel-ip-country") || "unknown"
    const city = request.headers.get("x-vercel-ip-city") || "unknown"

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

    await pageVisitsCollection.insertOne(visit)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
