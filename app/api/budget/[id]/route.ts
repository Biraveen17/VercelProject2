import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const result = await sql`
      UPDATE budget_items 
      SET 
        category1 = ${updates.category1},
        category2 = ${updates.category2},
        item_name = ${updates.itemName},
        vendor = ${updates.vendor},
        cost = ${updates.cost},
        status = ${updates.status},
        notes = ${updates.notes},
        last_updated = ${new Date().toISOString()}
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error updating budget item:", error)
    return NextResponse.json({ error: "Failed to update budget item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM budget_items 
      WHERE id = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Budget item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result[0].id } })
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return NextResponse.json({ error: "Failed to delete budget item" }, { status: 500 })
  }
}
