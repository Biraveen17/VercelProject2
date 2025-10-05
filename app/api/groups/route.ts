import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const groupsCollection = await getCollection("guest_groups")
    const groups = await groupsCollection.find({}).sort({ created_at: -1 }).toArray()

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

    const groupsCollection = await getCollection("guest_groups")
    const guestsCollection = await getCollection("guests")

    // Create the group first
    const groupDoc = {
      name: group_name,
      total_count: total_guests,
      defined_count: 0,
      tbc_count: 0,
      rsvp_status: "pending",
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const groupResult = await groupsCollection.insertOne(groupDoc)
    const groupId = groupResult.insertedId

    let definedCount = 0
    let tbcCount = 0

    // Create individual guests for this group
    if (guests && guests.length > 0) {
      for (const guest of guests) {
        if (guest.guest_name || guest.is_tbc) {
          const guestDoc = {
            name: guest.is_tbc ? null : guest.guest_name,
            group_id: groupId,
            is_individual: false,
            is_tbc: guest.is_tbc,
            side: guest.side,
            child_age_category: guest.is_child ? guest.child_age_category : null,
            rsvp_status: "pending",
            attending_ceremony: null,
            attending_reception: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          await guestsCollection.insertOne(guestDoc)

          if (guest.is_tbc) {
            tbcCount++
          } else {
            definedCount++
          }
        }
      }

      // Update group counts
      await groupsCollection.updateOne(
        { _id: groupId },
        {
          $set: {
            defined_count: definedCount,
            tbc_count: tbcCount,
            updated_at: new Date().toISOString(),
          },
        },
      )
    }

    const newGroup = await groupsCollection.findOne({ _id: groupId })
    console.log("[v0] Group created successfully with guests:", newGroup)

    return NextResponse.json({ data: newGroup })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
