import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getGuestsCollection()
    const guests = await collection.find({}).sort({ lastUpdated: -1 }).toArray()

    return NextResponse.json(guests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const guest = {
      type: body.type,
      groupName: body.groupName || null,
      guestName: body.guestName || null,
      maxGroupSize: body.maxGroupSize || null,
      groupMembers: body.groupMembers || [],
      notes: body.notes || "",
      rsvpStatus: body.rsvpStatus || "pending",
      events: body.events || [],
      dietaryRequirements: body.dietaryRequirements || "",
      questions: body.questions || "",
      side: body.side || null,
      lastUpdated: new Date().toISOString(),
    }

    const result = await collection.insertOne(guest)

    return NextResponse.json({ ...guest, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
