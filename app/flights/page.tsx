"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Clock, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { Flight } from "@/lib/database"

export default function FlightsPage() {
  const { t } = useLanguage()
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departureFilter, setDepartureFilter] = useState("all")
  const [arrivalFilter, setArrivalFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    try {
      const response = await fetch("/api/flights")
      if (response.ok) {
        const data = await response.json()
        setFlights(data)
      }
    } catch (error) {
      console.error("Error fetching flights:", error)
    } finally {
      setLoading(false)
    }
  }

  const uniqueDepartureAirports = Array.from(new Set(flights.map((f) => f.departureAirport)))
  const uniqueArrivalAirports = Array.from(new Set(flights.map((f) => f.arrivalAirport)))

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      searchTerm === "" ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departureAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrivalAirport.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDeparture = departureFilter === "all" || flight.departureAirport === departureFilter
    const matchesArrival = arrivalFilter === "all" || flight.arrivalAirport === arrivalFilter

    return matchesSearch && matchesDeparture && matchesArrival
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="script text-5xl sm:text-6xl mb-4">{t("flightsTitle")}</h1>
          <p className="text-xl text-muted-foreground mb-2">{t("flightsSubtitle")}</p>
          <p className="text-muted-foreground max-w-3xl mx-auto">{t("flightsDescription")}</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder={t("searchFlights")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <Select value={departureFilter} onValueChange={setDepartureFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filterByDeparture")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allAirports")}</SelectItem>
              {uniqueDepartureAirports.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={arrivalFilter} onValueChange={setArrivalFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filterByArrival")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allAirports")}</SelectItem>
              {uniqueArrivalAirports.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Flights List */}
        {filteredFlights.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Plane className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t("noFlightsFound")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFlights.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{flight.airline}</span>
                    <span className="text-sm font-mono text-muted-foreground">{flight.flightNumber}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    <span>
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("departureAirport")}</p>
                      <p className="font-semibold">{flight.departureAirportName}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(flight.departureDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{flight.departureTime}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("arrivalAirport")}</p>
                      <p className="font-semibold">{flight.arrivalAirportName}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(flight.arrivalDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{flight.arrivalTime}</span>
                      </div>
                    </div>
                  </div>

                  {flight.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{flight.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
