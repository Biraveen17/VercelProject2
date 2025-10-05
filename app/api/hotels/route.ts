import { type NextRequest, NextResponse } from "next/server"
import { getHotelsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getHotelsCollection()
    const hotels = await collection.find({}).sort({ stars: -1, name: 1 }).toArray()

    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getHotelsCollection()

    const existingHotel = await collection.findOne({ name: body.name })
    if (existingHotel) {
      return NextResponse.json({ error: "A hotel with this name already exists" }, { status: 400 })
    }

    const hotel = {
      name: body.name,
      stars: body.stars || 4,
      adultOnly: body.adultOnly || false,
      hasParking: body.hasParking || true,
      distanceToVenue: body.distanceToVenue || "",
      avgPrice: body.avgPrice || "",
      website: body.website || "",
      bookingUrl: body.bookingUrl || "",
      imageUrl: body.imageUrl || "",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const result = await collection.insertOne(hotel)

    return NextResponse.json({ ...hotel, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}
