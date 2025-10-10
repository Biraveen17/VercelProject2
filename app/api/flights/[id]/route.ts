import { type NextRequest, NextResponse } from "next/server"
import { getFlightsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    const collection = await getFlightsCollection()

    const updateData: any = {
      lastUpdated: new Date().toISOString(),
    }

    if (body.airline !== undefined) updateData.airline = body.airline
    if (body.departureAirport !== undefined) updateData.departureAirport = body.departureAirport
    if (body.departureAirportName !== undefined) updateData.departureAirportName = body.departureAirportName
    if (body.arrivalAirport !== undefined) updateData.arrivalAirport = body.arrivalAirport
    if (body.arrivalAirportName !== undefined) updateData.arrivalAirportName = body.arrivalAirportName
    if (body.departureDate !== undefined) updateData.departureDate = body.departureDate
    if (body.departureTime !== undefined) updateData.departureTime = body.departureTime
    if (body.arrivalDate !== undefined) updateData.arrivalDate = body.arrivalDate
    if (body.arrivalTime !== undefined) updateData.arrivalTime = body.arrivalTime
    if (body.costCabinBag !== undefined) updateData.costCabinBag = body.costCabinBag
    if (body.costCheckedBag !== undefined) updateData.costCheckedBag = body.costCheckedBag
    if (body.costTicketAlone !== undefined) updateData.costTicketAlone = body.costTicketAlone
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.enabled !== undefined) updateData.enabled = body.enabled

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ success: true, message: "Flight updated successfully" })
  } catch (error) {
    console.error("Error updating flight:", error)
    return NextResponse.json({ error: "Failed to update flight" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const collection = await getFlightsCollection()

    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, message: "Flight deleted successfully" })
  } catch (error) {
    console.error("Error deleting flight:", error)
    return NextResponse.json({ error: "Failed to delete flight" }, { status: 500 })
  }
}
