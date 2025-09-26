import { loadGuests, saveGuests } from "@/lib/blob-storage"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guests = await loadGuests()
    const guest = guests.find((g) => g.id === params.id)

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ data: guest })
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updates = await request.json()
    const guests = await loadGuests()
    const guestIndex = guests.findIndex((g) => g.id === params.id)

    if (guestIndex === -1) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    guests[guestIndex] = {
      ...guests[guestIndex],
      name: updates.guestName || updates.name || guests[guestIndex].name,
      email: updates.email || guests[guestIndex].email,
      phone: updates.phone || guests[guestIndex].phone,
      group: updates.groupName || updates.group || guests[guestIndex].group,
      rsvpStatus: updates.rsvpStatus || guests[guestIndex].rsvpStatus,
      dietaryRestrictions:
        updates.dietaryRequirements || updates.dietaryRestrictions || guests[guestIndex].dietaryRestrictions,
      plusOne: updates.plusOne ?? guests[guestIndex].plusOne,
      updatedAt: new Date().toISOString(),
    }

    await saveGuests(guests)
    return NextResponse.json({ data: guests[guestIndex] })
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const guests = await loadGuests()
    const guestIndex = guests.findIndex((g) => g.id === params.id)

    if (guestIndex === -1) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    const deletedGuest = guests.splice(guestIndex, 1)[0]
    await saveGuests(guests)

    return NextResponse.json({ data: { id: deletedGuest.id } })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}
