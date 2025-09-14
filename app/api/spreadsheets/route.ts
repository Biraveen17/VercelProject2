import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const spreadsheets = await sql`
      SELECT * FROM spreadsheets 
      ORDER BY created_at DESC
    `

    // Transform database format back to frontend format
    const transformedSheets = spreadsheets.map((sheet: any) => ({
      id: sheet.id,
      name: sheet.name,
      cells: sheet.cells || {},
      lastModified: new Date(sheet.last_modified),
    }))

    return NextResponse.json({ data: transformedSheets })
  } catch (error) {
    console.error("Error fetching spreadsheets:", error)
    return NextResponse.json({ error: "Failed to fetch spreadsheets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sheet = await request.json()

    const result = await sql`
      INSERT INTO spreadsheets (id, name, cells) 
      VALUES (${sheet.id}, ${sheet.name}, ${JSON.stringify(sheet.cells || {})})
      RETURNING *
    `

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating spreadsheet:", error)
    return NextResponse.json({ error: "Failed to create spreadsheet" }, { status: 500 })
  }
}
