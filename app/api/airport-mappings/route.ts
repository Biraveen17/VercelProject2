import { type NextRequest, NextResponse } from "next/server"
import { getAirportMappingsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getAirportMappingsCollection()
    const mappings = await collection.find({}).sort({ code: 1 }).toArray()
    return NextResponse.json(mappings)
  } catch (error) {
    console.error("Error fetching airport mappings:", error)
    return NextResponse.json({ error: "Failed to fetch airport mappings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getAirportMappingsCollection()

    const mapping = {
      code: body.code.toUpperCase(),
      name: body.name,
      createdAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(mapping)
    return NextResponse.json({ ...mapping, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating airport mapping:", error)
    return NextResponse.json({ error: "Failed to create airport mapping" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Airport code is required" }, { status: 400 })
    }

    const collection = await getAirportMappingsCollection()
    await collection.deleteOne({ code: code.toUpperCase() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting airport mapping:", error)
    return NextResponse.json({ error: "Failed to delete airport mapping" }, { status: 500 })
  }
}
