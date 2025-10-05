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
      const { groupId, isAttending, events, dietaryRequirements, questions, guests } = body

      const guestsToDelete = guests.filter((g: any) => !g.name || g.name.trim() === "")
      const guestsToKeep = guests.filter((g: any) => g.name && g.name.trim() !== "")

      console.log(
        "[v0] Guests with empty names to delete:",
        guestsToDelete.map((g: any) => g._id),
      )
      console.log(
        "[v0] Guests with names to keep:",
        guestsToKeep.map((g: any) => ({ id: g._id, name: g.name })),
      )

      if (guestsToDelete.length > 0) {
        for (const guestToDelete of guestsToDelete) {
          try {
            const guestId = new ObjectId(guestToDelete._id)
            console.log("[v0] Deleting guest with empty name:", guestToDelete._id)

            const deleteResult = await collection.deleteOne({ _id: guestId })
            console.log("[v0] Delete result:", {
              acknowledged: deleteResult.acknowledged,
              deletedCount: deleteResult.deletedCount,
            })

            if (deleteResult.deletedCount === 0) {
              console.error("[v0] WARNING: Guest was not deleted (deletedCount = 0):", guestToDelete._id)
            } else {
              console.log("[v0] Successfully deleted guest:", guestToDelete._id)
            }
          } catch (deleteError) {
            console.error("[v0] Error deleting guest:", guestToDelete._id, deleteError)
            throw deleteError
          }
        }
      }

      const allGuests = await collection.find({}).toArray()

      for (const guestData of guestsToKeep) {
        const name = guestData.name?.trim()
        if (name) {
          const duplicateGuest = allGuests.find(
            (g) => g.name?.toLowerCase() === name.toLowerCase() && g._id.toString() !== guestData._id,
          )

          if (duplicateGuest) {
            return NextResponse.json(
              {
                error: `A guest with the name "${name}" already exists. Please modify the name slightly to make it unique.`,
              },
              { status: 400 },
            )
          }
        }
      }

      for (const guestData of guestsToKeep) {
        const updateData: any = {
          rsvpStatus: isAttending ? "attending" : "not-attending",
          events: isAttending ? events : [],
          dietaryRequirements: isAttending ? dietaryRequirements : "",
          questions: questions || "",
          isChild: guestData.isChild || false,
          ageGroup: guestData.isChild && guestData.ageGroup ? guestData.ageGroup : undefined,
          lastUpdated: new Date().toISOString(),
        }

        if (guestData.guestType === "tbc" && guestData.name && guestData.name.trim()) {
          updateData.name = guestData.name.trim()
          updateData.guestType = "defined"
        }

        await collection.updateOne({ _id: new ObjectId(guestData._id) }, { $set: updateData })

        const submissionData = {
          guestId: guestData._id,
          guestName: guestData.name || updateData.name,
          rsvpStatus: updateData.rsvpStatus,
          events: updateData.events,
          timestamp: updateData.lastUpdated,
        }

        await rsvpSubmissionsCollection.insertOne(submissionData)
      }

      console.log("[v0] RSVP submission complete. Deleted:", guestsToDelete.length, "Updated:", guestsToKeep.length)
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
