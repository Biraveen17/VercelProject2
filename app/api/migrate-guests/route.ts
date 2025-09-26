import { getCollection } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting guest management migration...")

    const guestsCollection = await getCollection("guests")
    const groupsCollection = await getCollection("guest_groups")

    // Clear existing data
    await guestsCollection.deleteMany({})
    await groupsCollection.deleteMany({})

    console.log("[v0] Cleared existing guest data")

    // Create indexes for better performance
    await guestsCollection.createIndex({ name: 1 }, { unique: true })
    await guestsCollection.createIndex({ group_id: 1 })
    await guestsCollection.createIndex({ side: 1 })
    await guestsCollection.createIndex({ rsvp_status: 1 })
    await guestsCollection.createIndex({ is_individual: 1 })
    await guestsCollection.createIndex({ is_tbc: 1 })

    await groupsCollection.createIndex({ name: 1 }, { unique: true })
    await groupsCollection.createIndex({ side: 1 })

    console.log("[v0] Created MongoDB indexes")

    console.log("[v0] Guest management migration completed successfully")

    return NextResponse.json({
      success: true,
      message: "Guest management database migration completed successfully",
    })
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    return NextResponse.json({ success: false, error: "Migration failed", details: error }, { status: 500 })
  }
}
