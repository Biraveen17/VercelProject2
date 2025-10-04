import { type NextRequest, NextResponse } from "next/server"
import { getIpNameMappingsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// Update IP name mapping
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if another mapping with the same IP exists
    const existing = await collection.findOne({
      ipAddress: ipAddress.trim(),
      _id: { $ne: new ObjectId(params.id) },
    })

    if (existing) {
      return NextResponse.json({ error: "IP address already has a name mapping" }, { status: 400 })
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ipAddress: ipAddress.trim(), name: name.trim() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "IP mapping not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating IP mapping:", error)
    return NextResponse.json({ error: "Failed to update IP mapping" }, { status: 500 })
  }
}

// Delete IP name mapping
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getIpNameMappingsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "IP mapping not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting IP mapping:", error)
    return NextResponse.json({ error: "Failed to delete IP mapping" }, { status: 500 })
  }
}
