import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const guests = await sql`
      SELECT * FROM guests 
      ORDER BY created_at DESC
    `

    // Transform database format back to frontend format
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
    }))

    return NextResponse.json({ data: transformedGuests })
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const guest = await request.json()

    const result = await sql`
      INSERT INTO guests (
        id, type, group_name, guest_name, max_group_size, group_members,
        notes, rsvp_status, events, dietary_requirements, questions, side
      ) VALUES (
        ${guest.id}, ${guest.type}, ${guest.groupName}, ${guest.guestName},
        ${guest.maxGroupSize}, ${JSON.stringify(guest.groupMembers || [])},
        ${guest.notes}, ${guest.rsvpStatus}, ${JSON.stringify(guest.events || [])},
        ${guest.dietaryRequirements}, ${guest.questions}, ${guest.side}
      ) RETURNING *
    `

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
