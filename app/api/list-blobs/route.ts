import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list()

    return NextResponse.json(
      {
        files: blobs.map((blob) => ({
          url: blob.url,
          pathname: blob.pathname,
          filename: blob.pathname.split("/").pop(),
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Error listing blobs:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
