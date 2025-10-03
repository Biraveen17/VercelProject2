import { type NextRequest, NextResponse } from "next/server"
import { getBudgetCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const collection = await getBudgetCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          category1: body.category1,
          category2: body.category2,
          itemName: body.itemName,
          vendor: body.vendor,
          cost: body.cost,
          status: body.status,
          notes: body.notes || "",
          lastUpdated: new Date().toISOString(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating budget item:", error)
    return NextResponse.json({ error: "Failed to update budget item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getBudgetCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return NextResponse.json({ error: "Failed to delete budget item" }, { status: 500 })
  }
}
