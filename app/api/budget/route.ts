import { type NextRequest, NextResponse } from "next/server"
import { getBudgetCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getBudgetCollection()
    const budgetItems = await collection.find({}).sort({ lastUpdated: -1 }).toArray()

    return NextResponse.json(budgetItems)
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return NextResponse.json({ error: "Failed to fetch budget items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getBudgetCollection()

    const budgetItem = {
      category1: body.category1,
      category2: body.category2,
      itemName: body.itemName,
      vendor: body.vendor,
      cost: body.cost,
      status: body.status,
      notes: body.notes || "",
      lastUpdated: new Date().toISOString(),
    }

    const result = await collection.insertOne(budgetItem)

    return NextResponse.json({ ...budgetItem, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating budget item:", error)
    return NextResponse.json({ error: "Failed to create budget item" }, { status: 500 })
  }
}
