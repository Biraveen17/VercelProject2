import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename

    // List all blobs to find the one with matching filename
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // Find the blob that matches the filename
    const matchingBlob = blobs.find(
      (blob) => blob.pathname.includes(filename) || blob.pathname.split("/").pop() === filename,
    )

    if (!matchingBlob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Redirect to the actual blob URL
    return NextResponse.redirect(matchingBlob.url)
  } catch (error) {
    console.error("Error fetching blob:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
