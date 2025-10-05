import { NextResponse } from "next/server"
import { getSpreadsheetCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getSpreadsheetCollection()
    const spreadsheets = await collection.find({}).toArray()

    if (spreadsheets.length === 0) {
      // Create default spreadsheet
      const defaultSheet = {
        id: "sheet-1",
        name: "Wedding Planning",
        cells: {},
        lastModified: new Date().toISOString(),
      }
      await collection.insertOne(defaultSheet)
      return NextResponse.json([defaultSheet])
    }

    return NextResponse.json(spreadsheets)
  } catch (error) {
    console.error("[v0] Error fetching spreadsheets:", error)
    return NextResponse.json({ error: "Failed to fetch spreadsheets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const collection = await getSpreadsheetCollection()

    const newSheet = {
      ...body,
      lastModified: new Date().toISOString(),
    }

    await collection.insertOne(newSheet)
    return NextResponse.json(newSheet)
  } catch (error) {
    console.error("[v0] Error creating spreadsheet:", error)
    return NextResponse.json({ error: "Failed to create spreadsheet" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const collection = await getSpreadsheetCollection()

    // Update all spreadsheets (bulk update)
    if (Array.isArray(body)) {
      // Delete all existing and insert new ones
      await collection.deleteMany({})
      const sheetsWithTimestamp = body.map((sheet) => ({
        ...sheet,
        lastModified: new Date().toISOString(),
      }))
      await collection.insertMany(sheetsWithTimestamp)
      return NextResponse.json(sheetsWithTimestamp)
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating spreadsheets:", error)
    return NextResponse.json({ error: "Failed to update spreadsheets" }, { status: 500 })
  }
}
