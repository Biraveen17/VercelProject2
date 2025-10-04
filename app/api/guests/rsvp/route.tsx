import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection, getRsvpSubmissionsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] RSVP submission received:", JSON.stringify(body, null, 2))

    const collection = await getGuestsCollection()
    const rsvpSubmissionsCollection = await getRsvpSubmissionsCollection()

    console.log("[v0] Using database:", rsvpSubmissionsCollection.dbName)
    console.log("[v0] Using collection:", rsvpSubmissionsCollection.collectionName)

    if (body.type === "group") {
      const { groupId, isAttending, events, dietaryRequirements, questions, guests } = body

      const allGroupGuests = await collection.find({ groupId }).toArray()
      console.log(
        "[v0] All guests in group from database:",
        allGroupGuests.map((g) => ({ id: g._id.toString(), name: g.name, type: g.guestType })),
      )
      console.log(
        "[v0] Guests from form submission:",
        guests.map((g: any) => ({ id: g._id, name: g.name, type: g.guestType })),
      )

      const guestsWithNames = guests.filter((g: any) => g.name && g.name.trim() !== "")
      const guestIdsWithNames = guestsWithNames.map((g: any) => g._id)
      console.log("[v0] Guest IDs with names filled in:", guestIdsWithNames)

      const guestsToDelete = allGroupGuests.filter((dbGuest) => {
        const isInSubmission = guests.some((formGuest: any) => formGuest._id === dbGuest._id.toString())
        const hasNameInSubmission = guestIdsWithNames.includes(dbGuest._id.toString())

        // Delete if: it's a TBC guest AND (not in submission OR in submission but no name filled)
        return dbGuest.guestType === "tbc" && (!isInSubmission || !hasNameInSubmission)
      })

      console.log(
        "[v0] TBC guests to delete:",
        guestsToDelete.map((g) => ({ id: g._id.toString(), name: g.name })),
      )

      if (guestsToDelete.length > 0) {
        for (const guestToDelete of guestsToDelete) {
          try {
            console.log("[v0] Attempting to delete TBC guest:", {
              id: guestToDelete._id.toString(),
              name: guestToDelete.name,
              type: guestToDelete.guestType,
            })

            const deleteResult = await collection.deleteOne({ _id: guestToDelete._id })
            console.log("[v0] Delete result:", {
              acknowledged: deleteResult.acknowledged,
              deletedCount: deleteResult.deletedCount,
            })

            // Verify deletion
            const stillExists = await collection.findOne({ _id: guestToDelete._id })
            if (stillExists) {
              console.error("[v0] ERROR: Guest still exists after deletion attempt!", guestToDelete._id.toString())
            } else {
              console.log("[v0] Successfully verified deletion of guest:", guestToDelete._id.toString())
            }
          } catch (deleteError) {
            console.error("[v0] Error deleting TBC guest:", guestToDelete._id.toString(), deleteError)
            throw deleteError
          }
        }

        // Final verification - check how many guests remain in the group
        const remainingGuests = await collection.find({ groupId }).toArray()
        console.log(
          "[v0] Remaining guests in group after deletion:",
          remainingGuests.map((g) => ({ id: g._id.toString(), name: g.name, type: g.guestType })),
        )
      }

      // Validate for duplicate names
      const allGuests = await collection.find({}).toArray()

      for (const guestData of guestsWithNames) {
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

      // Update all guests in the group that have names
      for (const guestData of guestsWithNames) {
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
        console.log("[v0] Inserting RSVP submission:", JSON.stringify(submissionData, null, 2))

        const insertResult = await rsvpSubmissionsCollection.insertOne(submissionData)
        console.log("[v0] RSVP submission inserted with ID:", insertResult.insertedId)

        const verifyInsert = await rsvpSubmissionsCollection.findOne({ _id: insertResult.insertedId })
        console.log("[v0] Verified inserted document:", JSON.stringify(verifyInsert, null, 2))

        const totalCount = await rsvpSubmissionsCollection.countDocuments({})
        console.log("[v0] Total RSVP submissions after insert:", totalCount)
      }

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
      console.log("[v0] Inserting individual RSVP submission:", JSON.stringify(submissionData, null, 2))

      const insertResult = await rsvpSubmissionsCollection.insertOne(submissionData)
      console.log("[v0] Individual RSVP submission inserted with ID:", insertResult.insertedId)

      const verifyInsert = await rsvpSubmissionsCollection.findOne({ _id: insertResult.insertedId })
      console.log("[v0] Verified inserted document:", JSON.stringify(verifyInsert, null, 2))

      const totalCount = await rsvpSubmissionsCollection.countDocuments({})
      console.log("[v0] Total RSVP submissions after insert:", totalCount)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
