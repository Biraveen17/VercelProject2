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

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: body.name,
          guestType: body.guestType,
          isChild: body.isChild || false,
          ageGroup: body.ageGroup || undefined,
          side: body.side || null,
          groupId: body.groupId || null,
          notes: body.notes || "",
          rsvpStatus: body.rsvpStatus || "pending",
          events: body.events || [],
          dietaryRequirements: body.dietaryRequirements || "",
          questions: body.questions || "",
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
