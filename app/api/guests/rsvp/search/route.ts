import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection, getGroupsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
    }

    const guestsCollection = await getGuestsCollection()
    const groupsCollection = await getGroupsCollection()
    const normalizedName = name.toLowerCase().trim()

    const guest = await guestsCollection.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    })

    if (guest) {
      // Check if guest already submitted RSVP
      if (guest.rsvpStatus && guest.rsvpStatus !== "pending") {
        return NextResponse.json(
          { error: "You have already submitted your RSVP. If you need to make changes, please contact us directly." },
          { status: 400 },
        )
      }

      if (guest.groupId) {
        const group = await groupsCollection.findOne({ _id: new ObjectId(guest.groupId) })
        if (!group) {
          return NextResponse.json({ error: "Group not found" }, { status: 404 })
        }

        // Check if group already submitted RSVP
        const groupGuests = await guestsCollection.find({ groupId: guest.groupId }).toArray()
        const hasSubmittedRSVP = groupGuests.some((g) => g.rsvpStatus && g.rsvpStatus !== "pending")
        if (hasSubmittedRSVP) {
          return NextResponse.json(
            {
              error:
                "Your group has already submitted an RSVP. If you need to make changes, please contact us directly.",
            },
            { status: 400 },
          )
        }

        return NextResponse.json({
          type: "group",
          group: { ...group, _id: group._id.toString() },
          guests: groupGuests.map((g) => ({ ...g, _id: g._id.toString() })),
        })
      }

      return NextResponse.json({
        type: "individual",
        guest: { ...guest, _id: guest._id.toString() },
      })
    }

    const group = await groupsCollection.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    })

    if (group) {
      const groupGuests = await guestsCollection.find({ groupId: group._id.toString() }).toArray()

      // Check if group already submitted RSVP
      const hasSubmittedRSVP = groupGuests.some((g) => g.rsvpStatus && g.rsvpStatus !== "pending")
      if (hasSubmittedRSVP) {
        return NextResponse.json(
          {
            error: "Your group has already submitted an RSVP. If you need to make changes, please contact us directly.",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        type: "group",
        group: { ...group, _id: group._id.toString() },
        guests: groupGuests.map((g) => ({ ...g, _id: g._id.toString() })),
      })
    }

    // No match found
    return NextResponse.json(
      { error: "Guest name not found. Please check the spelling or contact us for assistance." },
      { status: 404 },
    )
  } catch (error) {
    console.error("Error searching for guest:", error)
    return NextResponse.json({ error: "Failed to search for guest" }, { status: 500 })
  }
}
