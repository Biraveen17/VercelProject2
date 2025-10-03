import { type NextRequest, NextResponse } from "next/server"
import { getGuestsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getGuestsCollection()

    const updateData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      _id: undefined, // Remove _id from update data
      id: undefined, // Remove id from update data
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
