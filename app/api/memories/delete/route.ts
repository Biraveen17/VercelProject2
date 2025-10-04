import { del, list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = await request.json()

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 })
    }

    // Delete the image file
    await del(pathname)

    // Find and delete the corresponding metadata file
    const { blobs } = await list({
      prefix: "memories/metadata/",
    })

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const metadata = await response.json()

        if (metadata.pathname === pathname) {
          await del(blob.pathname)
          break
        }
      } catch (error) {
        console.error("[v0] Error checking metadata:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
