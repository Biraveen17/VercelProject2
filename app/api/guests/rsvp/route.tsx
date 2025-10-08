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
      const { groupId, isAttending, events, dietaryRequirements, questions, attendingGuests, originalGuests } = body

      const originalGuestNames = originalGuests.map((g: any) => g.name.toLowerCase().trim())
      const attendingGuestNames = attendingGuests.map((g: any) => g.name.toLowerCase().trim())

      // Find which original guests are not in the attending list
      const removedGuestNames = originalGuestNames.filter((name: string) => !attendingGuestNames.includes(name))

      console.log("[v0] Original guests:", originalGuestNames)
      console.log("[v0] Attending guests:", attendingGuestNames)
      console.log("[v0] Removed guests:", removedGuestNames)

      // Mark removed guests with removed flag
      for (const originalGuest of originalGuests) {
        const originalName = originalGuest.name.toLowerCase().trim()
        if (removedGuestNames.includes(originalName)) {
          console.log("[v0] Marking guest as removed:", originalGuest.name)
          await collection.updateOne(
            { _id: new ObjectId(originalGuest._id) },
            {
              $set: {
                removed: true,
                lastUpdated: new Date().toISOString(),
              },
            },
          )
        }
      }

      // Process attending guests
      for (const attendingGuest of attendingGuests) {
        const attendingName = attendingGuest.name.trim()

        // Check if this name matches an original guest
        const matchingOriginalGuest = originalGuests.find(
          (og: any) => og.name.toLowerCase().trim() === attendingName.toLowerCase(),
        )

        if (matchingOriginalGuest) {
          // Update existing guest
          console.log("[v0] Updating existing guest:", attendingName)
          const updateData: any = {
            rsvpStatus: isAttending ? "attending" : "not-attending",
            events: isAttending ? events : [],
            dietaryRequirements: isAttending ? dietaryRequirements : "",
            questions: questions || "",
            isChild: attendingGuest.isChild || false,
            ageGroup: attendingGuest.isChild && attendingGuest.ageGroup ? attendingGuest.ageGroup : undefined,
            removed: false, // Ensure removed flag is false for attending guests
            lastUpdated: new Date().toISOString(),
          }

          await collection.updateOne({ _id: new ObjectId(matchingOriginalGuest._id) }, { $set: updateData })

          const submissionData = {
            guestId: matchingOriginalGuest._id,
            guestName: attendingName,
            rsvpStatus: updateData.rsvpStatus,
            events: updateData.events,
            timestamp: updateData.lastUpdated,
          }

          await rsvpSubmissionsCollection.insertOne(submissionData)
        } else {
          // Create new guest (name doesn't match any original guest)
          console.log("[v0] Creating new guest:", attendingName)

          // Check for duplicates across all guests
          const allGuests = await collection.find({}).toArray()
          const duplicateGuest = allGuests.find((g) => g.name?.toLowerCase() === attendingName.toLowerCase())

          if (duplicateGuest) {
            return NextResponse.json(
              {
                error: `A guest with the name "${attendingName}" already exists. Please modify the name slightly to make it unique.`,
              },
              { status: 400 },
            )
          }

          // Get side from first original guest
          const side = originalGuests[0]?.side || "bride"

          const newGuestData = {
            name: attendingName,
            guestType: "defined",
            isChild: attendingGuest.isChild || false,
            ageGroup: attendingGuest.isChild && attendingGuest.ageGroup ? attendingGuest.ageGroup : undefined,
            side: side,
            groupId: groupId,
            rsvpStatus: isAttending ? "attending" : "not-attending",
            events: isAttending ? events : [],
            dietaryRequirements: isAttending ? dietaryRequirements : "",
            questions: questions || "",
            removed: false,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          }

          const insertResult = await collection.insertOne(newGuestData)

          const submissionData = {
            guestId: insertResult.insertedId.toString(),
            guestName: attendingName,
            rsvpStatus: newGuestData.rsvpStatus,
            events: newGuestData.events,
            timestamp: newGuestData.lastUpdated,
          }

          await rsvpSubmissionsCollection.insertOne(submissionData)
        }
      }

      console.log("[v0] RSVP submission complete")
      return NextResponse.json({ success: true })
    }

    if (body.type === "individual") {
      const { guestId, isAttending, events, dietaryRequirements, questions, isChild, ageGroup } = body

      const guest = await collection.findOne({ _id: new ObjectId(guestId) })
      const timestamp = new Date().toISOString()

      await collection.updateOne(
        { _id: new ObjectId(guestId) },
        {
          $set: {
            rsvpStatus: isAttending ? "attending" : "not-attending",
            events: isAttending ? events : [],
            dietaryRequirements: isAttending ? dietaryRequirements : "",
            questions: questions || "",
            isChild: isChild || false,
            ageGroup: isChild && ageGroup ? ageGroup : undefined,
            lastUpdated: timestamp,
          },
        },
      )

      const submissionData = {
        guestId: guestId,
        guestName: guest?.name || "Unknown",
        rsvpStatus: isAttending ? "attending" : "not-attending",
        events: isAttending ? events : [],
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
