import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"
import type { Guest } from "@/lib/database"

export async function GET() {
  try {
    const collection = await getGuestsCollection()
    const guests = await collection.find({}).toArray()

    // Convert MongoDB _id to string id for compatibility
    const formattedGuests = guests.map((guest) => ({
      ...guest,
      id: guest._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json(formattedGuests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const newGuest: Omit<Guest, "id"> = {
      type: body.type,
      groupName: body.groupName,
      guestName: body.guestName,
      maxGroupSize: body.maxGroupSize,
      groupMembers: body.groupMembers,
      notes: body.notes || "",
      rsvpStatus: body.rsvpStatus || "pending",
      events: body.events || [],
      dietaryRequirements: body.dietaryRequirements || "",
      questions: body.questions || "",
      side: body.side,
      lastUpdated: new Date().toISOString(),
    }

    const result = await collection.insertOne(newGuest)

    return NextResponse.json(
      {
        ...newGuest,
        id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
