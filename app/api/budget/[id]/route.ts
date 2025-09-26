import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const budgetCollection = await getCollection("budget_items")

    // Transform frontend format to MongoDB document format
    const updateDoc = {
      category1: updates.category1,
      category2: updates.category2,
      item_name: updates.itemName,
      vendor: updates.vendor,
      cost: updates.cost,
      status: updates.status,
      notes: updates.notes,
      last_updated: new Date().toISOString(),
    }

    // Try to update by custom id first, then by MongoDB _id
    let result = await budgetCollection.findOneAndUpdate(
      { id: params.id },
      { $set: updateDoc },
      { returnDocument: "after" },
    )

    if (!result && ObjectId.isValid(params.id)) {
      result = await budgetCollection.findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateDoc },
        { returnDocument: "after" },
      )
    }

    if (!result) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error updating budget item:", error)
    return NextResponse.json({ error: "Failed to update budget item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const budgetCollection = await getCollection("budget_items")

    // Try to delete by custom id first, then by MongoDB _id
    let result = await budgetCollection.findOneAndDelete({ id: params.id })

    if (!result && ObjectId.isValid(params.id)) {
      result = await budgetCollection.findOneAndDelete({ _id: new ObjectId(params.id) })
    }

    if (!result) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result.id || result._id.toString() } })
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return NextResponse.json({ error: "Failed to delete budget item" }, { status: 500 })
  }
}
