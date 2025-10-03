import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()
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
        groupMembers: { $elemMatch: { $regex: new RegExp(normalizedName, "i") } },
      })
    }

    // If not found, try to find individual
    if (!guest) {
      guest = await collection.findOne({
        type: "individual",
        groupName: null,
        guestName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
      })
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Update guest with RSVP data
    await collection.updateOne(
      { _id: guest._id },
      {
        $set: {
          rsvpStatus: body.isAttending ? "attending" : "not-attending",
          events: body.isAttending ? body.events : [],
          dietaryRequirements: body.isAttending ? body.dietaryRequirements : "",
          questions: body.questions || "",
          lastUpdated: new Date().toISOString(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
