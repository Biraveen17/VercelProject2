import { put } from "@vercel/blob"
import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const memories = await sql`
      SELECT id, blob_url, caption, uploader_name, created_at 
      FROM memories 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ memories })
  } catch (error) {
    console.error("[v0] Error fetching memories:", error)
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caption = formData.get("caption") as string
    const uploaderName = formData.get("uploaderName") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Save metadata to database
    const result = await sql`
      INSERT INTO memories (blob_url, caption, uploader_name)
      VALUES (${blob.url}, ${caption || null}, ${uploaderName || null})
      RETURNING id, blob_url, caption, uploader_name, created_at
    `

    return NextResponse.json({ memory: result[0] })
  } catch (error) {
    console.error("[v0] Error uploading memory:", error)
    return NextResponse.json({ error: "Failed to upload memory" }, { status: 500 })
  }
}
