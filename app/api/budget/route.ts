import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const budgetItems = await sql`
      SELECT * FROM budget_items 
      ORDER BY created_at DESC
    `

    // Transform database format back to frontend format
    const transformedItems = budgetItems.map((item: any) => ({
      id: item.id,
      category1: item.category1,
      category2: item.category2,
      itemName: item.item_name,
      vendor: item.vendor,
      cost: Number.parseFloat(item.cost),
      status: item.status,
      notes: item.notes,
      lastUpdated: item.last_updated,
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

    const result = await sql`
      INSERT INTO budget_items (
        id, category1, category2, item_name, vendor, cost, status, notes
      ) VALUES (
        ${item.id}, ${item.category1}, ${item.category2}, ${item.itemName},
        ${item.vendor}, ${item.cost}, ${item.status}, ${item.notes}
      ) RETURNING *
    `

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating budget item:", error)
    return NextResponse.json({ error: "Failed to create budget item" }, { status: 500 })
  }
}
