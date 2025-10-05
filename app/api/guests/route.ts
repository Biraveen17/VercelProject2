import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection, getGroupsCollection } from "@/lib/mongodb"

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
    const guestsCollection = await getGuestsCollection()
    const groupsCollection = await getGroupsCollection()

    const existingGuest = await guestsCollection.findOne({ name: body.name })
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this name already exists" }, { status: 400 })
    }

    const existingGroup = await groupsCollection.findOne({ name: body.name })
    if (existingGroup) {
      return NextResponse.json({ error: "A group with this name already exists" }, { status: 400 })
    }

    const guest = {
      name: body.name,
      guestType: body.guestType || "defined",
      isChild: body.isChild || false,
      ageGroup: body.isChild && body.ageGroup ? body.ageGroup : undefined, // Only save ageGroup if guest is a child and ageGroup is provided
      side: body.side || null,
      groupId: body.groupId || null,
      notes: body.notes || "",
      rsvpStatus: body.rsvpStatus || "pending",
      events: body.events || [],
      dietaryRequirements: body.dietaryRequirements || "",
      questions: body.questions || "",
      lockStatus: body.lockStatus || "unlocked", // Added lockStatus field
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const result = await guestsCollection.insertOne(guest)

    return NextResponse.json({ ...guest, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
