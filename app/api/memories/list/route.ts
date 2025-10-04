import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // List all blobs in the memories/metadata folder
    const { blobs } = await list({
      prefix: "memories/metadata/",
    })

    // Fetch and parse each metadata file
    const memories = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url)
          const metadata = await response.json()
          return metadata
        } catch (error) {
          console.error("[v0] Error parsing metadata:", error)
          return null
        }
      }),
    )

    // Filter out any null values and sort by date (newest first)
    const validMemories = memories
      .filter((m) => m !== null)
      .sort((a, b) => {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      })

    return NextResponse.json({ memories: validMemories })
  } catch (error) {
    console.error("[v0] Error listing memories:", error)
    return NextResponse.json({ error: "Failed to list memories" }, { status: 500 })
  }
}
