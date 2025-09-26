import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const guests = await sql`
      SELECT * FROM guests 
      ORDER BY created_at DESC
    `

    // Transform database format to frontend format
    const transformedGuests = guests.map((guest: any) => ({
      id: guest.id,
      type: guest.type,
      groupName: guest.group_name,
      guestName: guest.guest_name,
      maxGroupSize: guest.max_group_size,
      groupMembers: guest.group_members || [],
      notes: guest.notes,
      rsvpStatus: guest.rsvp_status,
      events: guest.events || [],
      dietaryRequirements: guest.dietary_requirements,
      questions: guest.questions,
      side: guest.side,
      lastUpdated: guest.last_updated,
      createdAt: guest.created_at,
    }))

    return NextResponse.json({ data: transformedGuests })
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

    const result = await sql`
      INSERT INTO guests (
        id, type, group_name, guest_name, max_group_size, 
        group_members, notes, rsvp_status, events, 
        dietary_requirements, questions, side, last_updated, created_at
      ) VALUES (
        ${guest.id}, ${guest.type}, ${guest.groupName}, ${guest.guestName}, 
        ${guest.maxGroupSize}, ${JSON.stringify(guest.groupMembers || [])}, 
        ${guest.notes}, ${guest.rsvpStatus}, ${JSON.stringify(guest.events || [])}, 
        ${guest.dietaryRequirements}, ${guest.questions}, ${guest.side}, 
        ${guest.lastUpdated}, ${guest.createdAt || new Date().toISOString()}
      ) RETURNING *
    `

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
