import { type NextRequest, NextResponse } from "next/server"
import { getIpExclusionsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// Update IP exclusion
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { ipAddress } = body

    if (!ipAddress || !ipAddress.trim()) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 })
    }

    const collection = await getIpExclusionsCollection()

    // Check if another IP with the same address exists
    const existing = await collection.findOne({
      ipAddress: ipAddress.trim(),
      _id: { $ne: new ObjectId(params.id) },
    })

    if (existing) {
      return NextResponse.json({ error: "IP address already excluded" }, { status: 400 })
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ipAddress: ipAddress.trim() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "IP exclusion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating IP exclusion:", error)
    return NextResponse.json({ error: "Failed to update IP exclusion" }, { status: 500 })
  }
}

// Delete IP exclusion
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const collection = await getIpExclusionsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "IP exclusion not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting IP exclusion:", error)
    return NextResponse.json({ error: "Failed to delete IP exclusion" }, { status: 500 })
  }
}
