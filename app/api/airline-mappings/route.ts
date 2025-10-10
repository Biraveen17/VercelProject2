import { type NextRequest, NextResponse } from "next/server"
import { getAirlineMappingsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getAirlineMappingsCollection()
    const mappings = await collection.find({}).sort({ airline: 1 }).toArray()
    return NextResponse.json(mappings)
  } catch (error) {
    console.error("Error fetching airline mappings:", error)
    return NextResponse.json({ error: "Failed to fetch airline mappings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getAirlineMappingsCollection()

    const mapping = {
      airline: body.airline,
      iconUrl: body.iconUrl,
      createdAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(mapping)
    return NextResponse.json({ ...mapping, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating airline mapping:", error)
    return NextResponse.json({ error: "Failed to create airline mapping" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const airline = searchParams.get("airline")

    if (!airline) {
      return NextResponse.json({ error: "Airline name is required" }, { status: 400 })
    }

    const collection = await getAirlineMappingsCollection()
    await collection.deleteOne({ airline })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting airline mapping:", error)
    return NextResponse.json({ error: "Failed to delete airline mapping" }, { status: 500 })
  }
}
