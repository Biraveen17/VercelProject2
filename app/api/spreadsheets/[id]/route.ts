import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const spreadsheetsCollection = await getCollection("spreadsheets")

    const updateDoc = {
      name: updates.name,
      cells: updates.cells || {},
      last_modified: new Date().toISOString(),
    }

    // Try to update by custom id first, then by MongoDB _id
    let result = await spreadsheetsCollection.findOneAndUpdate(
      { id: params.id },
      { $set: updateDoc },
      { returnDocument: "after" },
    )

    if (!result && ObjectId.isValid(params.id)) {
      result = await spreadsheetsCollection.findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateDoc },
        { returnDocument: "after" },
      )
    }

    if (!result) {
      return NextResponse.json({ error: "Spreadsheet not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error updating spreadsheet:", error)
    return NextResponse.json({ error: "Failed to update spreadsheet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const spreadsheetsCollection = await getCollection("spreadsheets")

    // Try to delete by custom id first, then by MongoDB _id
    let result = await spreadsheetsCollection.findOneAndDelete({ id: params.id })

    if (!result && ObjectId.isValid(params.id)) {
      result = await spreadsheetsCollection.findOneAndDelete({ _id: new ObjectId(params.id) })
    }

    if (!result) {
      return NextResponse.json({ error: "Spreadsheet not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result.id || result._id.toString() } })
  } catch (error) {
    console.error("Error deleting spreadsheet:", error)
    return NextResponse.json({ error: "Failed to delete spreadsheet" }, { status: 500 })
  }
}
