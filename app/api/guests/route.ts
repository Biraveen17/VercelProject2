import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const guests = await sql`
      SELECT * FROM guests 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ data: guests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const guest = await request.json()
    console.log("[v0] Creating guest with data:", guest)

    const result = await sql`
      INSERT INTO guests (
        guest_name, group_id, is_group_header, group_name, is_tbc, side, 
        is_child, child_age_category, rsvp_status, events, dietary_requirements, 
        questions_for_couple, notes, rsvp_submitted
      ) VALUES (
        ${guest.guest_name}, ${guest.group_id || null}, ${guest.is_group_header || false}, 
        ${guest.group_name || null}, ${guest.is_tbc || false}, ${guest.side},
        ${guest.is_child || false}, ${guest.child_age_category || null}, 
        ${guest.rsvp_status}, ${JSON.stringify(guest.events || [])}, 
        ${guest.dietary_requirements || null}, ${guest.questions_for_couple || null}, 
        ${guest.notes || null}, ${guest.rsvp_submitted || false}
      ) RETURNING *
    `

    console.log("[v0] Guest created successfully:", result[0])
    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
