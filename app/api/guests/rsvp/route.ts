import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    if (body.type === "group") {
      const { groupId, isAttending, events, dietaryRequirements, questions, guests } = body

      // Update all guests in the group
      for (const guestData of guests) {
        const updateData: any = {
          rsvpStatus: isAttending ? "attending" : "not-attending",
          events: isAttending ? events : [],
          dietaryRequirements: isAttending ? dietaryRequirements : "",
          questions: questions || "",
          lastUpdated: new Date().toISOString(),
        }

        if (guestData.guestType === "tbc" && guestData.name && guestData.name.trim()) {
          updateData.name = guestData.name.trim()
          updateData.guestType = "defined" // Convert TBC to defined once name is provided
        }

        await collection.updateOne({ _id: new ObjectId(guestData._id) }, { $set: updateData })
      }

      return NextResponse.json({ success: true })
    }

    if (body.type === "individual") {
      const { guestId, isAttending, events, dietaryRequirements, questions } = body

      await collection.updateOne(
        { _id: new ObjectId(guestId) },
        {
          $set: {
            rsvpStatus: isAttending ? "attending" : "not-attending",
            events: isAttending ? events : [],
            dietaryRequirements: isAttending ? dietaryRequirements : "",
            questions: questions || "",
            lastUpdated: new Date().toISOString(),
          },
        },
      )

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
