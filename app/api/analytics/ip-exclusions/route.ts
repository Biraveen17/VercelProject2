import { type NextRequest, NextResponse } from "next/server"
import { getIpExclusionsCollection } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// Get all IP exclusions
export async function GET() {
  try {
    const collection = await getIpExclusionsCollection()
    const exclusions = await collection.find({}).toArray()

    return NextResponse.json(exclusions)
  } catch (error) {
    console.error("[v0] Error fetching IP exclusions:", error)
    return NextResponse.json({ error: "Failed to fetch IP exclusions" }, { status: 500 })
  }
}

// Add new IP exclusion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ipAddress } = body

    if (!ipAddress || !ipAddress.trim()) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 })
    }

    const collection = await getIpExclusionsCollection()

    // Check if IP already exists
    const existing = await collection.findOne({ ipAddress: ipAddress.trim() })
    if (existing) {
      return NextResponse.json({ error: "IP address already excluded" }, { status: 400 })
    }

    const result = await collection.insertOne({
      ipAddress: ipAddress.trim(),
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error adding IP exclusion:", error)
    return NextResponse.json({ error: "Failed to add IP exclusion" }, { status: 500 })
  }
}
