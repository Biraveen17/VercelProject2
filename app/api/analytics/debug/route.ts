import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Force dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("[v0] DEBUG: Creating fresh MongoDB connection")

    const uri = process.env.MONGODB_URI
    if (!uri) {
      return NextResponse.json({ error: "MONGODB_URI not found" }, { status: 500 })
    }

    // Create a completely fresh connection
    const client = new MongoClient(uri)
    await client.connect()

    console.log("[v0] DEBUG: Connected to MongoDB")

    const db = client.db("wedding-website")
    const rsvpSubmissionsCollection = db.collection("rsvpSubmissions")

    console.log("[v0] DEBUG: Database name:", db.databaseName)
    console.log("[v0] DEBUG: Collection name:", rsvpSubmissionsCollection.collectionName)

    // Get all data directly
    const allSubmissions = await rsvpSubmissionsCollection.find({}).toArray()
    console.log("[v0] DEBUG: Found", allSubmissions.length, "submissions")
    console.log("[v0] DEBUG: Raw data:", JSON.stringify(allSubmissions, null, 2))

    // Get collection stats
    const stats = await db.command({ collStats: "rsvpSubmissions" })
    console.log("[v0] DEBUG: Collection stats:", JSON.stringify(stats, null, 2))

    // List all collections
    const collections = await db.listCollections().toArray()
    console.log(
      "[v0] DEBUG: All collections:",
      collections.map((c) => c.name),
    )

    await client.close()

    return NextResponse.json(
      {
        database: db.databaseName,
        collection: rsvpSubmissionsCollection.collectionName,
        totalSubmissions: allSubmissions.length,
        submissions: allSubmissions,
        collectionStats: stats,
        allCollections: collections.map((c) => c.name),
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] DEBUG: Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch debug data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
