import { NextResponse } from "next/server"
import { getPageVisitsCollection, getRsvpSubmissionsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const requestTime = new Date().toISOString()
    console.log("[v0] ========================================")
    console.log("[v0] Fetching analytics stats - START at", requestTime)

    const pageVisitsCollection = await getPageVisitsCollection()
    const rsvpSubmissionsCollection = await getRsvpSubmissionsCollection()

    console.log("[v0] Connected to collections")

    const collectionName = rsvpSubmissionsCollection.collectionName
    const dbName = rsvpSubmissionsCollection.dbName
    console.log("[v0] Database name:", dbName)
    console.log("[v0] Collection name:", collectionName)

    // Get total count first
    const totalCount = await rsvpSubmissionsCollection.countDocuments({})
    console.log("[v0] Total RSVP submissions in database:", totalCount)

    const allSubmissions = await rsvpSubmissionsCollection.find({}).toArray()
    console.log("[v0] All RSVP submissions (raw):", JSON.stringify(allSubmissions, null, 2))

    const pages = ["home", "events", "venue", "travel", "rsvp", "gallery"]

    // Get statistics for each page
    const pageStats = await Promise.all(
      pages.map(async (page) => {
        const visits = await pageVisitsCollection.find({ page }).toArray()
        const uniqueVisitors = new Set(visits.map((v: any) => v.uniqueId)).size
        const totalViews = visits.length
        const timestamps = visits
          .map((v: any) => v.timestamp)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

        console.log(`[v0] Page ${page}: ${uniqueVisitors} unique visitors, ${totalViews} total views`)

        return {
          page,
          uniqueVisitors,
          totalViews,
          timestamps,
        }
      }),
    )

    // Get home page visits with location
    const homeVisits = await pageVisitsCollection.find({ page: "home" }).sort({ timestamp: -1 }).toArray()
    console.log("[v0] Home page visits with location:", homeVisits.length)

    const homeVisitsWithLocation = homeVisits.map((visit: any) => ({
      timestamp: visit.timestamp,
      country: visit.country,
      city: visit.city,
      ip: visit.ip,
      device: visit.device || "Unknown",
    }))

    const rsvpSubmissions = await rsvpSubmissionsCollection.find({}).sort({ timestamp: -1 }).toArray()
    console.log("[v0] RSVP submissions retrieved:", rsvpSubmissions.length)

    const rsvpSubmissionsData = rsvpSubmissions.map((submission: any) => ({
      name: submission.guestName,
      timestamp: submission.timestamp,
      status: submission.rsvpStatus,
      events: submission.events,
    }))

    console.log("[v0] Transformed RSVP submissions:", JSON.stringify(rsvpSubmissionsData, null, 2))
    console.log("[v0] Returning analytics data with", rsvpSubmissionsData.length, "RSVP submissions")
    console.log("[v0] ========================================")

    return NextResponse.json(
      {
        pageStats,
        homeVisitsWithLocation,
        rsvpSubmissions: rsvpSubmissionsData,
        _metadata: {
          requestTime,
          totalRsvpSubmissions: totalCount,
          dbName,
          collectionName,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
