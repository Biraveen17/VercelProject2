import { type NextRequest, NextResponse } from "next/server"
import { getIpNameMappingsCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// Get all IP name mappings
export async function GET() {
  try {
    const collection = await getIpNameMappingsCollection()
    const mappings = await collection.find({}).toArray()

    return NextResponse.json(mappings)
  } catch (error) {
    console.error("[v0] Error fetching IP mappings:", error)
    return NextResponse.json({ error: "Failed to fetch IP mappings" }, { status: 500 })
  }
}

// Add new IP name mapping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ipAddress, name } = body

    if (!ipAddress || !ipAddress.trim()) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 })
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const collection = await getIpNameMappingsCollection()

    // Check if IP already has a mapping
    const existing = await collection.findOne({ ipAddress: ipAddress.trim() })
    if (existing) {
      return NextResponse.json({ error: "IP address already has a name mapping" }, { status: 400 })
    }

    const result = await collection.insertOne({
      ipAddress: ipAddress.trim(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error adding IP mapping:", error)
    return NextResponse.json({ error: "Failed to add IP mapping" }, { status: 500 })
  }
}
