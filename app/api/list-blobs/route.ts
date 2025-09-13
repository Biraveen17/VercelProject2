import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN)

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const files = blobs.map((blob) => ({
      ...blob,
      filename: blob.pathname.split("/").pop() || "unknown",
    }))

    console.log("[v0] Found files:", files.length)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
