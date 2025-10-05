import { type NextRequest, NextResponse } from "next/server"
import { getHotelsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getHotelsCollection()

    const updateData = {
      ...body,
      lastUpdated: new Date().toISOString(),
    }

    delete updateData._id

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getHotelsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting hotel:", error)
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 })
  }
}
