"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plane,
  Hotel,
  Car,
  MapPin,
  Wine,
  Utensils,
  Camera,
  Sun,
  Star,
  ParkingCircle,
  Users,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"
import { useState, useEffect } from "react"
import Image from "next/image"

interface HotelData {
  _id?: string
  id?: string
  name: string
  stars: number
  adultOnly: boolean
  hasParking: boolean
  distanceToVenue: string
  avgPrice: string
  website: string
  bookingUrl: string
  imageUrl: string
}

type SortOption = "name" | "stars" | "distance" | "price"

export default function TravelPage() {
  const { t } = useLanguage()
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await fetch("/api/hotels")
        if (response.ok) {
          const data = await response.json()
          setHotels(data)
        }
      } catch (error) {
        console.error("Error loading hotels:", error)
      } finally {
        setLoading(false)
      }
    }
    loadHotels()
  }, [])

  const sortedHotels = [...hotels].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "stars":
        return b.stars - a.stars
      case "distance":
        return Number.parseFloat(a.distanceToVenue) - Number.parseFloat(b.distanceToVenue)
      case "price":
        return Number.parseFloat(a.avgPrice.replace("€", "")) - Number.parseFloat(b.avgPrice.replace("€", ""))
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen section-spacing">
      <PageTracker pageName="travel" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-text mb-6">{t("travelTitle")}</h1>
          <p className="subtitle-text max-w-3xl mx-auto">{t("travelSubtitle")}</p>
        </div>

        {/* Getting There */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("gettingThereTitle")}</h2>
            <p className="body-text max-w-3xl mx-auto text-muted-foreground">{t("gettingThereDescription")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 caption-text text-primary">
                  <Plane className="w-6 h-6" />
                  {t("sfoTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="body-text text-sm">{t("sfoDescription")}</p>
                <div className="pt-2 border-t border-border">
                  <p className="caption-text text-primary">{t("sfoDrive")}</p>
                </div>
                <div className="pt-2 border-t border-border space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Direct Flights:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("sfoDirectFlights")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Airlines:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("sfoAirlines")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Single Transit Options:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("sfoTransitOptions")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 caption-text text-primary">
                  <Plane className="w-6 h-6" />
                  {t("oakTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="body-text text-sm">{t("oakDescription")}</p>
                <div className="pt-2 border-t border-border">
                  <p className="caption-text text-primary">{t("oakDrive")}</p>
                </div>
                <div className="pt-2 border-t border-border space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Direct Flights:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("oakDirectFlights")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Airlines:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("oakAirlines")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary mb-1">Single Transit Options:</p>
                    <p className="body-text text-sm text-muted-foreground">{t("oakTransitOptions")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transportation */}
        <section className="mb-20">
          <Card className="decorative-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 caption-text text-primary justify-center">
                <Car className="w-6 h-6" />
                {t("transportationTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="body-text leading-relaxed max-w-4xl mx-auto space-y-4">
                <p className="font-semibold text-primary">
                  We recommend hiring a rental car from the airport for the duration of your stay.
                </p>

                <p>
                  There is no Uber service in Cyprus, and Bolt operates on a limited basis. Local taxis are an option,
                  though they can be relatively expensive for everyday travel.
                </p>

                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm text-primary">Driving in Cyprus:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Driving is relaxed and on the left side of the road</li>
                    <li>Speed limits: 50 km/h in towns, 80 km/h on open roads, 100 km/h on highways</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-sm text-primary mb-2">Booking Your Rental:</p>
                  <p className="text-sm mb-3">
                    We recommend booking in advance to get better prices. Good comparison websites include:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm" className="btn-secondary bg-transparent">
                      <a href="https://www.rentalcars.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        RentalCars.com
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="btn-secondary bg-transparent">
                      <a href="https://www.booking.com/cars" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Booking.com
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="btn-secondary bg-transparent">
                      <a href="https://www.discovercars.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        DiscoverCars.com
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-primary mb-1">Major Rental Companies:</p>
                  <p className="text-muted-foreground">
                    Enterprise, Alamo, Sixt, Hertz, Avis, Europcar, Budget, and others
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold text-primary">Driving License:</p>
                  <p>
                    UK and EU driving license holders should not need an international driving permit as Cyprus is an EU
                    member country. However, it's best to check with the rental company directly.
                  </p>
                </div>

                <p className="text-sm italic text-center pt-2">
                  If you need any help with booking your rental, please reach out to us directly.
                </p>
              </div>
              {/* </CHANGE> */}
            </CardContent>
          </Card>
        </section>

        {/* Travel Tips */}
        <section className="mb-20">
          <Card className="decorative-border">
            <CardHeader>
              <CardTitle className="caption-text text-primary text-center">{t("travelTipsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="body-text leading-relaxed text-center max-w-4xl mx-auto whitespace-pre-line">
                {t("travelTipsDescription")}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Where to Stay */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("accommodationsTitle")}</h2>
            <p className="body-text text-muted-foreground max-w-3xl mx-auto mb-8">
              <Button
                asChild
                size="sm"
                className="bg-[#FF5A5F] hover:bg-[#E00007] text-white font-medium px-3 py-1 h-auto inline-flex items-center"
              >
                <a href="https://www.airbnb.com/s/Paphos--Cyprus/homes" target="_blank" rel="noopener noreferrer">
                  Airbnb
                </a>
              </Button>{" "}
              can be a great option for groups or longer stays. For those who prefer hotels, we’ve listed some
              recommendations below. Please note that the prices shown were checked in October 2025 and may vary
              depending on when you book.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hotels available yet.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <Button
                  variant={sortBy === "name" ? "default" : "outline"}
                  onClick={() => setSortBy("name")}
                  className={sortBy === "name" ? "btn-primary" : "btn-secondary bg-transparent"}
                >
                  Sort by Name
                </Button>
                <Button
                  variant={sortBy === "stars" ? "default" : "outline"}
                  onClick={() => setSortBy("stars")}
                  className={sortBy === "stars" ? "btn-primary" : "btn-secondary bg-transparent"}
                >
                  Sort by Star Rating
                </Button>
                <Button
                  variant={sortBy === "distance" ? "default" : "outline"}
                  onClick={() => setSortBy("distance")}
                  className={sortBy === "distance" ? "btn-primary" : "btn-secondary bg-transparent"}
                >
                  Sort by Distance
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  onClick={() => setSortBy("price")}
                  className={sortBy === "price" ? "btn-primary" : "btn-secondary bg-transparent"}
                >
                  Sort by Price
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHotels.map((hotel) => (
                  <Card key={hotel._id || hotel.id} className="decorative-border overflow-hidden flex flex-col p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={hotel.imageUrl || "/placeholder.svg"}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-3 pt-6">
                      <CardTitle className="caption-text text-primary text-lg leading-tight">{hotel.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col pb-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="body-text text-sm">
                            {hotel.adultOnly ? "Adults Only" : "Family Friendly"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ParkingCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="body-text text-sm">
                            {hotel.hasParking ? "Parking Available" : "No Parking"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="body-text text-sm">{hotel.distanceToVenue} to venue</span>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <p className="caption-text text-primary font-semibold">{hotel.avgPrice} / night</p>
                          <p className="text-xs text-muted-foreground">Avg. for 2 adults, late March 2026</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <Button asChild variant="outline" size="sm" className="flex-1 btn-secondary bg-transparent">
                          <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Website
                          </a>
                        </Button>
                        <Button asChild size="sm" className="flex-1 bg-[#003580] hover:bg-[#002855] text-white">
                          <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                            <Hotel className="w-3 h-3 mr-1" />
                            Booking.com
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Things to Do */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("thingsToDoTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Wine className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity1Title")}</h3>
                <p className="body-text text-sm">{t("activity1Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity2Title")}</h3>
                <p className="body-text text-sm">{t("activity2Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity3Title")}</h3>
                <p className="body-text text-sm">{t("activity3Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity4Title")}</h3>
                <p className="body-text text-sm">{t("activity4Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity5Title")}</h3>
                <p className="body-text text-sm">{t("activity5Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity6Title")}</h3>
                <p className="body-text text-sm">{t("activity6Description")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Questions CTA */}
        <section>
          <Card className="decorative-border bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-serif font-light mb-4">{t("questionsTitle")}</h2>
              <p className="body-text text-muted-foreground mb-8 max-w-2xl mx-auto">{t("questionsDescription")}</p>
              <Button asChild size="lg" className="btn-primary">
                <Link href="/rsvp">{t("rsvpNow")}</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
