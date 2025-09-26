import { loadGuests, saveGuests, generateId, type GuestData } from "@/lib/blob-storage"
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const guests = await loadGuests()
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

    const guestData = await request.json()

    const newGuest: GuestData = {
      id: guestData.id || generateId(),
      name: guestData.guestName || guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      group: guestData.groupName || guestData.group,
      rsvpStatus: guestData.rsvpStatus || "pending",
      dietaryRestrictions: guestData.dietaryRequirements || guestData.dietaryRestrictions,
      plusOne: guestData.plusOne || false,
      createdAt: guestData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const guests = await loadGuests()
    guests.push(newGuest)
    await saveGuests(guests)

    return NextResponse.json({ data: newGuest })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
