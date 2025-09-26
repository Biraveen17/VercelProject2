import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const budgetCollection = await getCollection("budget_items")
    const budgetItems = await budgetCollection.find({}).sort({ created_at: -1 }).toArray()

    // Transform database format back to frontend format
    const transformedItems = budgetItems.map((item: any) => ({
      id: item.id || item._id.toString(),
      category1: item.category1,
      category2: item.category2,
      itemName: item.item_name || item.itemName,
      vendor: item.vendor,
      cost: typeof item.cost === "string" ? Number.parseFloat(item.cost) : item.cost,
      status: item.status,
      notes: item.notes,
      lastUpdated: item.last_updated || item.lastUpdated,
      createdAt: item.created_at || item.createdAt,
    }))

    return NextResponse.json({ data: transformedItems })
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return NextResponse.json({ error: "Failed to fetch budget items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const item = await request.json()

    const budgetCollection = await getCollection("budget_items")

    // Transform frontend format to MongoDB document
    const budgetDoc = {
      id: item.id,
      category1: item.category1,
      category2: item.category2,
      item_name: item.itemName,
      vendor: item.vendor,
      cost: item.cost,
      status: item.status,
      notes: item.notes,
      last_updated: item.lastUpdated,
      created_at: item.createdAt || new Date().toISOString(),
    }

    const result = await budgetCollection.insertOne(budgetDoc)

    // Return the inserted document
    const insertedItem = await budgetCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ data: insertedItem })
  } catch (error) {
    console.error("Error creating budget item:", error)
    return NextResponse.json({ error: "Failed to create budget item" }, { status: 500 })
  }
}
