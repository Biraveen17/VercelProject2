import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getGroupsCollection, getGuestsCollection } from "@/lib/mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGroupsCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: body.name,
          lastUpdated: new Date().toISOString(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating group:", error)
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGroupsCollection()

    const existingGroup = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!existingGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (body.name !== undefined && body.name !== existingGroup.name) {
      const allGroups = await collection.find({}).toArray()
      const guestsCollection = await getGuestsCollection()
      const allGuests = await guestsCollection.find({}).toArray()

      const duplicateGroup = allGroups.find(
        (g) => g.name?.toLowerCase().trim() === body.name.toLowerCase().trim() && g._id.toString() !== params.id,
      )

      const duplicateGuest = allGuests.find((g) => g.name?.toLowerCase().trim() === body.name.toLowerCase().trim())

      if (duplicateGroup || duplicateGuest) {
        return NextResponse.json(
          { error: "A guest or group with this name already exists. Please use a different name." },
          { status: 400 },
        )
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: body.name,
          lastUpdated: new Date().toISOString(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating group:", error)
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getGroupsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting group:", error)
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 })
  }
}
