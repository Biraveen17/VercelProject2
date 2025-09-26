import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const spreadsheetsCollection = await getCollection("spreadsheets")
    const spreadsheets = await spreadsheetsCollection.find({}).sort({ created_at: -1 }).toArray()

    // Transform database format back to frontend format
    const transformedSheets = spreadsheets.map((sheet: any) => ({
      id: sheet.id || sheet._id.toString(),
      name: sheet.name,
      cells: sheet.cells || {},
      lastModified: new Date(sheet.last_modified || sheet.lastModified),
      createdAt: sheet.created_at || sheet.createdAt,
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

    const spreadsheetsCollection = await getCollection("spreadsheets")

    const sheetDoc = {
      id: sheet.id,
      name: sheet.name,
      cells: sheet.cells || {},
      last_modified: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const result = await spreadsheetsCollection.insertOne(sheetDoc)
    const insertedSheet = await spreadsheetsCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ data: insertedSheet })
  } catch (error) {
    console.error("Error creating spreadsheet:", error)
    return NextResponse.json({ error: "Failed to create spreadsheet" }, { status: 500 })
  }
}
