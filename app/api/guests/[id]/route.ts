import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          type: body.type,
          groupName: body.groupName || null,
          guestName: body.guestName || null,
          maxGroupSize: body.maxGroupSize || null,
          groupMembers: body.groupMembers || [],
          notes: body.notes || "",
          rsvpStatus: body.rsvpStatus,
          events: body.events || [],
          dietaryRequirements: body.dietaryRequirements || "",
          questions: body.questions || "",
          side: body.side || null,
          lastUpdated: new Date().toISOString(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getGuestsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}
