import { NextResponse } from "next/server"
import { getHotelsCollection } from "@/lib/mongodb"

const existingHotels = [
  {
    name: "Coral Beach Hotel & Resort",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "8 km",
    avgPrice: "€350",
    website: "https://www.coral.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/coral-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=luxury%20beach%20resort%20cyprus",
  },
  {
    name: "Annabelle Hotel",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "6 km",
    avgPrice: "€320",
    website: "https://www.annabelle.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/annabelle.html",
    imageUrl: "https://www.annabelle.com.cy/Resources/images/Annabelle/home-hero-1920x1244.jpg",
  },
  {
    name: "Elysium Hotel",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "7 km",
    avgPrice: "€340",
    website: "https://www.elysium.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/elysium.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=stylish%20hotel%20sea%20view%20cyprus",
  },
  {
    name: "Alexander The Great Beach Hotel",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "5 km",
    avgPrice: "€180",
    website: "https://www.alexanderhotel.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/alexander-the-great.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=beachfront%20hotel%20paphos",
  },
  {
    name: "Constantinou Bros Athena Beach Hotel",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "9 km",
    avgPrice: "€200",
    website: "https://www.athenabch.com",
    bookingUrl: "https://www.booking.com/hotel/cy/athena-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=family%20beach%20hotel%20cyprus",
  },
  {
    name: "Almyra Hotel",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "6.5 km",
    avgPrice: "€310",
    website: "https://www.almyra.com",
    bookingUrl: "https://www.booking.com/hotel/cy/almyra.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=modern%20boutique%20hotel%20cyprus",
  },
  {
    name: "Constantinou Bros Athena Royal Beach Hotel",
    stars: 4,
    adultOnly: true,
    hasParking: true,
    distanceToVenue: "9.5 km",
    avgPrice: "€240",
    website: "https://www.athenaroyalbch.com",
    bookingUrl: "https://www.booking.com/hotel/cy/athena-royal-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=adults%20only%20beach%20resort%20cyprus",
  },
  {
    name: "Olympic Lagoon Resort Paphos",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "10 km",
    avgPrice: "€280",
    website: "https://www.kanikhotels.com",
    bookingUrl: "https://www.booking.com/hotel/cy/olympic-lagoon-resort.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=lagoon%20resort%20paphos%20cyprus",
  },
  {
    name: "Azia Resort & Spa",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "12 km",
    avgPrice: "€290",
    website: "https://www.aziaresort.com",
    bookingUrl: "https://www.booking.com/hotel/cy/azia-resort-spa.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=spa%20resort%20paphos",
  },
  {
    name: "Louis Phaethon Beach",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "8.5 km",
    avgPrice: "€170",
    website: "https://www.louishotels.com",
    bookingUrl: "https://www.booking.com/hotel/cy/louis-phaethon-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=beach%20hotel%20paphos%20cyprus",
  },
  {
    name: "Amavi Hotel",
    stars: 5,
    adultOnly: true,
    hasParking: true,
    distanceToVenue: "7.5 km",
    avgPrice: "€330",
    website: "https://www.amavihotel.com",
    bookingUrl: "https://www.booking.com/hotel/cy/amavi.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=adults%20only%20luxury%20hotel%20cyprus",
  },
  {
    name: "Constantinou Bros Asimina Suites Hotel",
    stars: 5,
    adultOnly: true,
    hasParking: true,
    distanceToVenue: "9 km",
    avgPrice: "€360",
    website: "https://www.asiminasuites.com",
    bookingUrl: "https://www.booking.com/hotel/cy/asimina-suites.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=luxury%20suites%20adults%20only%20cyprus",
  },
  {
    name: "Aquamare Beach Hotel & Spa",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "11 km",
    avgPrice: "€190",
    website: "https://www.aquamarehotel.com",
    bookingUrl: "https://www.booking.com/hotel/cy/aquamare-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=beach%20spa%20hotel%20paphos",
  },
  {
    name: "Capital Coast Resort & Spa",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "8 km",
    avgPrice: "€270",
    website: "https://www.capitalcoastresort.com",
    bookingUrl: "https://www.booking.com/hotel/cy/capital-coast-resort.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=coast%20resort%20spa%20cyprus",
  },
  {
    name: "Sentido Cypria Bay",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "10.5 km",
    avgPrice: "€160",
    website: "https://www.sentidohotels.com",
    bookingUrl: "https://www.booking.com/hotel/cy/sentido-cypria-bay.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=bay%20hotel%20paphos%20cyprus",
  },
  {
    name: "Venus Beach Hotel",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "6 km",
    avgPrice: "€150",
    website: "https://www.venusbeach.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/venus-beach.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=affordable%20beach%20hotel%20paphos",
  },
  {
    name: "Amphora Hotel & Suites",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "5.5 km",
    avgPrice: "€140",
    website: "https://www.amphora.com.cy",
    bookingUrl: "https://www.booking.com/hotel/cy/amphora.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=hotel%20suites%20paphos%20harbor",
  },
  {
    name: "King Evelthon Beach Hotel & Resort",
    stars: 5,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "13 km",
    avgPrice: "€260",
    website: "https://www.evelthon.com",
    bookingUrl: "https://www.booking.com/hotel/cy/king-evelthon.html",
    imageUrl: "/.jpg?key=ii7t1&height=200&width=400&query=beach%20resort%20hotel%20paphos",
  },
]

export async function POST() {
  try {
    const collection = await getHotelsCollection()

    // Check if hotels already exist
    const count = await collection.countDocuments()
    if (count > 0) {
      return NextResponse.json({ message: "Hotels already migrated", count }, { status: 200 })
    }

    // Add timestamps to all hotels
    const hotelsWithTimestamps = existingHotels.map((hotel) => ({
      ...hotel,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }))

    const result = await collection.insertMany(hotelsWithTimestamps)

    return NextResponse.json(
      {
        message: "Hotels migrated successfully",
        count: result.insertedCount,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error migrating hotels:", error)
    return NextResponse.json({ error: "Failed to migrate hotels" }, { status: 500 })
  }
}
