import { NextResponse } from "next/server"
import { getSpreadsheetCollection } from "@/lib/mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const collection = await getSpreadsheetCollection()
    await collection.deleteOne({ id: params.id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting spreadsheet:", error)
    return NextResponse.json({ error: "Failed to delete spreadsheet" }, { status: 500 })
  }
}
