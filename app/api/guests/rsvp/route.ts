import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    // Find guest by name (similar to findGuestForRSVP logic)
    const normalizedName = body.name.toLowerCase().trim()

    // Try to find group first
    let guest = await collection.findOne({
      type: "group",
      groupName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    })

    // If not found, try to find group with member
    if (!guest) {
      guest = await collection.findOne({
        type: "group",
        groupMembers: { $elemMatch: { $regex: new RegExp(`^${normalizedName}$`, "i") } },
      })
    }

    // If not found, try to find individual
    if (!guest) {
      guest = await collection.findOne({
        type: "individual",
        groupName: { $exists: false },
        guestName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
      })
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Update guest with RSVP data
    const updateData = {
      rsvpStatus: body.isAttending ? "attending" : "not-attending",
      events: body.isAttending ? body.events : [],
      dietaryRequirements: body.isAttending ? body.dietaryRequirements : "",
      questions: body.questions || "",
      lastUpdated: new Date().toISOString(),
    }

    await collection.updateOne({ _id: guest._id }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
