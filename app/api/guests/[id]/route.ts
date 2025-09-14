import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guest = await sql`
      SELECT * FROM guests WHERE id = ${params.id}
    `

    if (guest.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Transform database format back to frontend format
    const transformedGuest = {
      id: guest[0].id,
      type: guest[0].type,
      groupName: guest[0].group_name,
      guestName: guest[0].guest_name,
      maxGroupSize: guest[0].max_group_size,
      groupMembers: guest[0].group_members || [],
      notes: guest[0].notes,
      rsvpStatus: guest[0].rsvp_status,
      events: guest[0].events || [],
      dietaryRequirements: guest[0].dietary_requirements,
      questions: guest[0].questions,
      side: guest[0].side,
      lastUpdated: guest[0].last_updated,
    }

    return NextResponse.json({ data: transformedGuest })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const result = await sql`
      UPDATE guests SET
        type = ${updates.type},
        group_name = ${updates.groupName},
        guest_name = ${updates.guestName},
        max_group_size = ${updates.maxGroupSize},
        group_members = ${JSON.stringify(updates.groupMembers || [])},
        notes = ${updates.notes},
        rsvp_status = ${updates.rsvpStatus},
        events = ${JSON.stringify(updates.events || [])},
        dietary_requirements = ${updates.dietaryRequirements},
        questions = ${updates.questions},
        side = ${updates.side},
        last_updated = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result[0] })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM guests WHERE id = ${params.id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ data: { id: result[0].id } })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}
