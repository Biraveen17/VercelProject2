import { type NextRequest, NextResponse } from "next/server"
import { getPageVisitsCollection, getRsvpSubmissionsCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Verify password
    if (password !== "Pa55w0rd") {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    // Delete all page visits
    const pageVisitsCollection = await getPageVisitsCollection()
    const pageVisitsResult = await pageVisitsCollection.deleteMany({})

    // Delete all RSVP submissions
    const rsvpSubmissionsCollection = await getRsvpSubmissionsCollection()
    const rsvpSubmissionsResult = await rsvpSubmissionsCollection.deleteMany({})

    console.log("[v0] Statistics reset:")
    console.log(`  - Deleted ${pageVisitsResult.deletedCount} page visits`)
    console.log(`  - Deleted ${rsvpSubmissionsResult.deletedCount} RSVP submissions`)

    return NextResponse.json({
      success: true,
      deletedPageVisits: pageVisitsResult.deletedCount,
      deletedRsvpSubmissions: rsvpSubmissionsResult.deletedCount,
    })
  } catch (error) {
    console.error("[v0] Error resetting statistics:", error)
    return NextResponse.json({ error: "Failed to reset statistics" }, { status: 500 })
  }
}
