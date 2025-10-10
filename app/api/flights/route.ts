import { type NextRequest, NextResponse } from "next/server"
import { getFlightsCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getFlightsCollection()
    const flights = await collection.find({}).sort({ departureDate: 1, departureTime: 1 }).toArray()

    return NextResponse.json(flights)
  } catch (error) {
    console.error("Error fetching flights:", error)
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getFlightsCollection()

    const flight = {
      airline: body.airline,
      departureAirport: body.departureAirport,
      departureAirportName: body.departureAirportName || "",
      arrivalAirport: body.arrivalAirport,
      arrivalAirportName: body.arrivalAirportName || "",
      departureDate: body.departureDate,
      departureTime: body.departureTime,
      arrivalDate: body.arrivalDate,
      arrivalTime: body.arrivalTime,
      costCabinBag:
        body.costCabinBag === "" || body.costCabinBag === null || body.costCabinBag === undefined
          ? 0
          : Number(body.costCabinBag),
      costCheckedBag:
        body.costCheckedBag === "" || body.costCheckedBag === null || body.costCheckedBag === undefined
          ? 0
          : Number(body.costCheckedBag),
      costTicketAlone:
        body.costTicketAlone === "" || body.costTicketAlone === null || body.costTicketAlone === undefined
          ? 0
          : Number(body.costTicketAlone),
      notes: body.notes || "",
      enabled: body.enabled !== undefined ? body.enabled : true,
      lastUpdated: new Date().toISOString(),
    }

    const result = await collection.insertOne(flight)

    return NextResponse.json({ ...flight, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating flight:", error)
    return NextResponse.json({ error: "Failed to create flight" }, { status: 500 })
  }
}
