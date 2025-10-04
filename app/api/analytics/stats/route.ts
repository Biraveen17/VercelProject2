import { NextResponse } from "next/server"
import { getPageVisitsCollection, getGuestsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("[v0] Fetching analytics stats")

    const pageVisitsCollection = await getPageVisitsCollection()
    const guestsCollection = await getGuestsCollection()

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
    }))

    // Get RSVP submissions
    const rsvpSubmissions = await guestsCollection
      .find({ rsvpStatus: { $ne: "pending" } })
      .sort({ lastUpdated: -1 })
      .toArray()

    console.log("[v0] RSVP submissions found:", rsvpSubmissions.length)

    const rsvpSubmissionsData = rsvpSubmissions.map((guest: any) => ({
      name: guest.name,
      timestamp: guest.lastUpdated,
      status: guest.rsvpStatus,
    }))

    return NextResponse.json(
      {
        pageStats,
        homeVisitsWithLocation,
        rsvpSubmissions: rsvpSubmissionsData,
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
