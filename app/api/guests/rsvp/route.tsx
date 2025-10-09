import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection, getRsvpSubmissionsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] RSVP submission received:", JSON.stringify(body, null, 2))

    const collection = await getGuestsCollection()
    const rsvpSubmissionsCollection = await getRsvpSubmissionsCollection()

    if (body.type === "group") {
      const { groupId, guests, dietaryRequirements, questions } = body

      for (const guestData of guests) {
        const events = guestData.events || []
        const isNotAttending = events.includes("not-attending")
        const rsvpStatus = isNotAttending ? "not-attending" : "attending"
        const actualEvents = isNotAttending ? [] : events.filter((e: string) => e !== "not-attending")

        const updateData: any = {
          name: guestData.name,
          rsvpStatus: rsvpStatus,
          events: actualEvents,
          dietaryRequirements: isNotAttending ? "" : dietaryRequirements || "",
          questions: questions || "",
          isChild: guestData.isChild || false,
          ageGroup: guestData.isChild && guestData.ageGroup ? guestData.ageGroup : undefined,
          lockStatus: "locked",
          lastUpdated: new Date().toISOString(),
        }

        await collection.updateOne({ _id: new ObjectId(guestData._id) }, { $set: updateData })

        const submissionData = {
          guestId: guestData._id,
          guestName: guestData.name,
          rsvpStatus: rsvpStatus,
          events: actualEvents,
          timestamp: updateData.lastUpdated,
        }

        await rsvpSubmissionsCollection.insertOne(submissionData)
      }

      return NextResponse.json({ success: true })
    }

    if (body.type === "individual") {
      const { guestId, events, rsvpStatus, dietaryRequirements, questions, isChild, ageGroup } = body

      const timestamp = new Date().toISOString()

      await collection.updateOne(
        { _id: new ObjectId(guestId) },
        {
          $set: {
            rsvpStatus: rsvpStatus,
            events: events || [],
            dietaryRequirements: rsvpStatus === "attending" ? dietaryRequirements || "" : "",
            questions: questions || "",
            isChild: isChild || false,
            ageGroup: isChild && ageGroup ? ageGroup : undefined,
            lockStatus: "locked",
            lastUpdated: timestamp,
          },
        },
      )

      const guest = await collection.findOne({ _id: new ObjectId(guestId) })

      const submissionData = {
        guestId: guestId,
        guestName: guest?.name || "Unknown",
        rsvpStatus: rsvpStatus,
        events: events || [],
        timestamp: timestamp,
      }

      await rsvpSubmissionsCollection.insertOne(submissionData)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
