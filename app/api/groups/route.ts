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

    const { group_name, total_guests, notes, guests = [] } = await request.json()
    console.log("[v0] Creating group with data:", { group_name, total_guests, notes, guests })

    const result = await sql.begin(async (sql) => {
      // Create the group first
      const groupResult = await sql`
        INSERT INTO groups (
          group_name, total_guests, defined_guests, tbc_guests, rsvp_submitted, notes
        ) VALUES (
          ${group_name}, ${total_guests}, 0, 0, false, ${notes || null}
        ) RETURNING *
      `

      const newGroup = groupResult[0]
      let definedCount = 0
      let tbcCount = 0

      // Create individual guests for this group
      if (guests && guests.length > 0) {
        for (const guest of guests) {
          if (guest.guest_name || guest.is_tbc) {
            await sql`
              INSERT INTO guests (
                guest_name, group_id, is_group_header, is_tbc, side, is_child, 
                child_age_category, rsvp_status, events, rsvp_submitted
              ) VALUES (
                ${guest.is_tbc ? null : guest.guest_name}, 
                ${newGroup.id}, 
                false, 
                ${guest.is_tbc}, 
                ${guest.side}, 
                ${guest.is_child}, 
                ${guest.is_child ? guest.child_age_category : null}, 
                'pending', 
                '{}', 
                false
              )
            `

            if (guest.is_tbc) {
              tbcCount++
            } else {
              definedCount++
            }
          }
        }

        // Update group counts
        await sql`
          UPDATE groups 
          SET defined_guests = ${definedCount}, tbc_guests = ${tbcCount}
          WHERE id = ${newGroup.id}
        `
      }

      return { ...newGroup, defined_guests: definedCount, tbc_guests: tbcCount }
    })

    console.log("[v0] Group created successfully with guests:", result)
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
