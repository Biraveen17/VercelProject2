import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const matchingBlob = blobs.find(
      (blob) => blob.pathname.includes(filename) || blob.pathname.split("/").pop() === filename,
    )

    if (!matchingBlob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.redirect(matchingBlob.url, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error fetching blob:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
