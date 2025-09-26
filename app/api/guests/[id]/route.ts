import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestsCollection = await getCollection("guests")

    // Try to find by custom id first, then by MongoDB _id
    let guest = await guestsCollection.findOne({ id: params.id })
    if (!guest && ObjectId.isValid(params.id)) {
      guest = await guestsCollection.findOne({ _id: new ObjectId(params.id) })
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Transform database format back to frontend format
    const transformedGuest = {
      id: guest.id || guest._id.toString(),
      type: guest.type,
      groupName: guest.group_name || guest.groupName,
      guestName: guest.guest_name || guest.guestName,
      maxGroupSize: guest.max_group_size || guest.maxGroupSize,
      groupMembers: guest.group_members || guest.groupMembers || [],
      notes: guest.notes,
      rsvpStatus: guest.rsvp_status || guest.rsvpStatus,
      events: guest.events || [],
      dietaryRequirements: guest.dietary_requirements || guest.dietaryRequirements,
      questions: guest.questions,
      side: guest.side,
      lastUpdated: guest.last_updated || guest.lastUpdated,
      createdAt: guest.created_at || guest.createdAt,
    }

    return NextResponse.json({ data: transformedGuest })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const guestsCollection = await getCollection("guests")

    // Transform frontend format to MongoDB document format
    const updateDoc = {
      type: updates.type,
      group_name: updates.groupName,
      guest_name: updates.guestName,
      max_group_size: updates.maxGroupSize,
      group_members: updates.groupMembers || [],
      notes: updates.notes,
      rsvp_status: updates.rsvpStatus,
      events: updates.events || [],
      dietary_requirements: updates.dietaryRequirements,
      questions: updates.questions,
      side: updates.side,
      last_updated: new Date().toISOString(),
    }

    // Try to update by custom id first, then by MongoDB _id
    let result = await guestsCollection.findOneAndUpdate(
      { id: params.id },
      { $set: updateDoc },
      { returnDocument: "after" },
    )

    if (!result && ObjectId.isValid(params.id)) {
      result = await guestsCollection.findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateDoc },
        { returnDocument: "after" },
      )
    }

    if (!result) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestsCollection = await getCollection("guests")

    // Try to delete by custom id first, then by MongoDB _id
    let result = await guestsCollection.findOneAndDelete({ id: params.id })

    if (!result && ObjectId.isValid(params.id)) {
      result = await guestsCollection.findOneAndDelete({ _id: new ObjectId(params.id) })
    }

    if (!result) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result.id || result._id.toString() } })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}
