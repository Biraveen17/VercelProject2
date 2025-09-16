import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const groups = await sql`
      SELECT * FROM groups 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ data: groups })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Add authentication check
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const group = await request.json()
    console.log("[v0] Creating group with data:", group)

    const result = await sql`
      INSERT INTO groups (
        group_name, total_guests, defined_guests, tbc_guests, rsvp_submitted
      ) VALUES (
        ${group.group_name}, ${group.total_guests}, 0, 0, false
      ) RETURNING *
    `

    console.log("[v0] Group created successfully:", result[0])
    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
