import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const result = await sql`
      UPDATE spreadsheets SET
        name = ${updates.name},
        cells = ${JSON.stringify(updates.cells || {})},
        last_modified = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Spreadsheet not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error updating spreadsheet:", error)
    return NextResponse.json({ error: "Failed to update spreadsheet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM spreadsheets WHERE id = ${params.id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Spreadsheet not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result[0].id } })
  } catch (error) {
    console.error("Error deleting spreadsheet:", error)
    return NextResponse.json({ error: "Failed to delete spreadsheet" }, { status: 500 })
  }
}
