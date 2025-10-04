// ... existing code ...

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

      // Update all guests in the group
      for (const guestData of guests) {
        const updateData: any = {
          rsvpStatus: isAttending ? "attending" : "not-attending",
          events: isAttending ? events : [],
          dietaryRequirements: isAttending ? dietaryRequirements : "",
          questions: questions || "",
          // <CHANGE> Added child status and age group to update data
          isChild: guestData.isChild || false,
          ageGroup: guestData.isChild && guestData.ageGroup ? guestData.ageGroup : undefined,
          // </CHANGE>
          lastUpdated: new Date().toISOString(),
        }

        if (guestData.guestType === "tbc" && guestData.name && guestData.name.trim()) {
          updateData.name = guestData.name.trim()
          updateData.guestType = "defined"
        }

        await collection.updateOne({ _id: new ObjectId(guestData._id) }, { $set: updateData })

        // ... existing code ...
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
            // <CHANGE> Added child status and age group to individual update
            isChild: isChild || false,
            ageGroup: isChild && ageGroup ? ageGroup : undefined,
            // </CHANGE>
            lastUpdated: timestamp,
          },
        },
      )

      // ... existing code ...

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error submitting RSVP:", error)
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}
