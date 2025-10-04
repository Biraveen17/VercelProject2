import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getGuestsCollection()

    const guest = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const existingGuest = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!existingGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    const isOnlyLockStatusUpdate = body.lockStatus !== undefined && Object.keys(body).length === 1

    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.guestType !== undefined) updateData.guestType = body.guestType
    if (body.isChild !== undefined) updateData.isChild = body.isChild
    if (body.ageGroup !== undefined) updateData.ageGroup = body.ageGroup
    if (body.side !== undefined) updateData.side = body.side
    if (body.groupId !== undefined) updateData.groupId = body.groupId
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.rsvpStatus !== undefined) updateData.rsvpStatus = body.rsvpStatus
    if (body.events !== undefined) updateData.events = body.events
    if (body.dietaryRequirements !== undefined) updateData.dietaryRequirements = body.dietaryRequirements
    if (body.questions !== undefined) updateData.questions = body.questions
    if (body.lockStatus !== undefined) updateData.lockStatus = body.lockStatus

    if (!isOnlyLockStatusUpdate) {
      updateData.lastUpdated = new Date().toISOString()
    }

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: body.name,
          isChild: body.isChild || false,
          side: body.side || null,
          groupId: body.groupId || null,
          notes: body.notes || "",
          rsvpStatus: body.rsvpStatus || "pending",
          events: body.events || [],
          dietaryRequirements: body.dietaryRequirements || "",
          questions: body.questions || "",
          lockStatus: body.lockStatus || "unlocked",
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
