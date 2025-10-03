import { type NextRequest, NextResponse } from "next/server"
import { getGroupsCollection, getGuestsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getGroupsCollection()
    const groups = await collection.find({}).sort({ name: 1 }).toArray()

    return NextResponse.json(groups)
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const groupsCollection = await getGroupsCollection()
    const guestsCollection = await getGuestsCollection()

    const existingGroup = await groupsCollection.findOne({ name: body.name })
    if (existingGroup) {
      return NextResponse.json({ error: "A group with this name already exists" }, { status: 400 })
    }

    const existingGuest = await guestsCollection.findOne({ name: body.name })
    if (existingGuest) {
      return NextResponse.json({ error: "A guest with this name already exists" }, { status: 400 })
    }

    const group = {
      name: body.name,
      size: body.size || 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const result = await groupsCollection.insertOne(group)

    return NextResponse.json({ ...group, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
