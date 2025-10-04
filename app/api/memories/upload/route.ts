import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caption = formData.get("caption") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!caption) {
      return NextResponse.json({ error: "No caption provided" }, { status: 400 })
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now()
    const filename = `memories/${timestamp}-${file.name}`

    // Upload to Vercel Blob with metadata
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Store caption in blob metadata (we'll use a separate metadata file)
    const metadataFilename = `memories/metadata/${timestamp}.json`
    const metadata = {
      url: blob.url,
      caption,
      uploadedAt: new Date().toISOString(),
      pathname: blob.pathname,
    }

    await put(metadataFilename, JSON.stringify(metadata), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      caption,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
