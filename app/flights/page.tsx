"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, X, ChevronLeft, ChevronRight, Plane } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Flight {
  _id?: string
  id?: string
  airline: string
  departureAirport: string
  departureAirportName: string
  arrivalAirport: string
  arrivalAirportName: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  costCabinBag: number
  costCheckedBag: number
  costTicketAlone: number
  notes?: string
  enabled: boolean
  createdAt: string
  lastUpdated: string
}

interface AirlineIconMapping {
  airline: string
  iconUrl: string
}

type SortField =
  | "date"
  | "day"
  | "takeOffTime"
  | "landingTime"
  | "fromAirport"
  | "toAirport"
  | "airline"
  | "costCabinBag"
  | "costCheckedBag"
  | "costTicketAlone"
  | "costTicketCabin"
  | "costTicketChecked"
  | "costTicketBoth"
type SortDirection = "asc" | "desc" | null

const CYPRUS_AIRPORT_CODES = ["LCA", "PFO", "ECN"]

export default function FlightsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [accessible, setAccessible] = useState(true)

  const [airlineIconMappings, setAirlineIconMappings] = useState<AirlineIconMapping[]>([])

  const [outgoingItemsPerPage, setOutgoingItemsPerPage] = useState<number | "all">(10)
  const [outgoingCurrentPage, setOutgoingCurrentPage] = useState(1)
  const [returnItemsPerPage, setReturnItemsPerPage] = useState<number | "all">(10)
  const [returnCurrentPage, setReturnCurrentPage] = useState(1)

  const outgoingTableRef = useRef<HTMLDivElement>(null)
  const returnTableRef = useRef<HTMLDivElement>(null)
  const [showOutgoingScrollIndicator, setShowOutgoingScrollIndicator] = useState(true)
  const [showReturnScrollIndicator, setShowReturnScrollIndicator] = useState(true)

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Filter states
  const [dateFilters, setDateFilters] = useState<string[]>([])
  const [dayFilters, setDayFilters] = useState<string[]>([])
  const [fromAirportFilters, setFromAirportFilters] = useState<string[]>([])
  const [toAirportFilters, setToAirportFilters] = useState<string[]>([])
  const [airlineFilters, setAirlineFilters] = useState<string[]>([])

  useEffect(() => {
    checkAccessibility()
  }, [])

  useEffect(() => {
    if (flights.length > 0 && sortField === null) {
      setSortField("date")
      setSortDirection("asc")
    }
  }, [flights])

  const checkAccessibility = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const settings = await response.json()
        if (settings.flightsAccessible === false) {
          router.push("/")
          return
        }
        setAccessible(true)
        fetchFlights()
        fetchAirlineIconMappings()
      } else {
        fetchFlights()
        fetchAirlineIconMappings()
      }
    } catch (error) {
      console.error("Error checking accessibility:", error)
      fetchFlights()
      fetchAirlineIconMappings()
    }
  }

  const fetchFlights = async () => {
    try {
      const response = await fetch("/api/flights")
      if (response.ok) {
        const data = await response.json()
        setFlights(data.filter((f: Flight) => f.enabled !== false))
      }
    } catch (error) {
      console.error("Error fetching flights:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAirlineIconMappings = async () => {
    try {
      const response = await fetch("/api/airline-mappings")
      if (response.ok) {
        const data = await response.json()
        setAirlineIconMappings(data)
      }
    } catch (error) {
      console.error("Error fetching airline mappings:", error)
    }
  }

  const outgoingFlights = useMemo(() => {
    return flights.filter((f) => !CYPRUS_AIRPORT_CODES.includes(f.departureAirport.toUpperCase()))
  }, [flights])

  const returnFlights = useMemo(() => {
    return flights.filter((f) => CYPRUS_AIRPORT_CODES.includes(f.departureAirport.toUpperCase()))
  }, [flights])

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`
  }

  // Calculate combined costs
  const getTicketPlusCabin = (flight: Flight) => flight.costTicketAlone + flight.costCabinBag
  const getTicketPlusChecked = (flight: Flight) => flight.costTicketAlone + flight.costCheckedBag
  const getTicketPlusBoth = (flight: Flight) => flight.costTicketAlone + flight.costCabinBag + flight.costCheckedBag

  const getAirlineIcon = (airline: string) => {
    const mapping = airlineIconMappings.find((m) => m.airline === airline)
    return mapping?.iconUrl
  }

  // Get unique values for filters (from all flights)
  const uniqueDates = useMemo(() => Array.from(new Set(flights.map((f) => formatDate(f.departureDate)))), [flights])
  const uniqueDays = useMemo(() => Array.from(new Set(flights.map((f) => getDayOfWeek(f.departureDate)))), [flights])
  const uniqueFromAirports = useMemo(
    () => Array.from(new Set(flights.map((f) => `${f.departureAirport} - ${f.departureAirportName}`))),
    [flights],
  )
  const uniqueToAirports = useMemo(
    () => Array.from(new Set(flights.map((f) => `${f.arrivalAirport} - ${f.arrivalAirportName}`))),
    [flights],
  )
  const uniqueAirlines = useMemo(() => Array.from(new Set(flights.map((f) => f.airline))), [flights])

  const filteredOutgoingFlights = useMemo(() => {
    return outgoingFlights.filter((flight) => {
      if (dateFilters.length > 0 && !dateFilters.includes(formatDate(flight.departureDate))) return false
      if (dayFilters.length > 0 && !dayFilters.includes(getDayOfWeek(flight.departureDate))) return false
      if (
        fromAirportFilters.length > 0 &&
        !fromAirportFilters.includes(`${flight.departureAirport} - ${flight.departureAirportName}`)
      )
        return false
      if (
        toAirportFilters.length > 0 &&
        !toAirportFilters.includes(`${flight.arrivalAirport} - ${flight.arrivalAirportName}`)
      )
        return false
      if (airlineFilters.length > 0 && !airlineFilters.includes(flight.airline)) return false
      return true
    })
  }, [outgoingFlights, dateFilters, dayFilters, fromAirportFilters, toAirportFilters, airlineFilters])

  const filteredReturnFlights = useMemo(() => {
    return returnFlights.filter((flight) => {
      if (dateFilters.length > 0 && !dateFilters.includes(formatDate(flight.departureDate))) return false
      if (dayFilters.length > 0 && !dayFilters.includes(getDayOfWeek(flight.departureDate))) return false
      if (
        fromAirportFilters.length > 0 &&
        !fromAirportFilters.includes(`${flight.departureAirport} - ${flight.departureAirportName}`)
      )
        return false
      if (
        toAirportFilters.length > 0 &&
        !toAirportFilters.includes(`${flight.arrivalAirport} - ${flight.arrivalAirportName}`)
      )
        return false
      if (airlineFilters.length > 0 && !airlineFilters.includes(flight.airline)) return false
      return true
    })
  }, [returnFlights, dateFilters, dayFilters, fromAirportFilters, toAirportFilters, airlineFilters])

  // Sorting logic
  const sortFlights = (flightsToSort: Flight[]) => {
    return [...flightsToSort].sort((a, b) => {
      // Primary sort: Date (ascending)
      const dateA = new Date(a.departureDate).getTime()
      const dateB = new Date(b.departureDate).getTime()
      if (dateA !== dateB) return dateA - dateB

      // Secondary sort: Take Off Time (ascending)
      if (a.departureTime !== b.departureTime) {
        return a.departureTime.localeCompare(b.departureTime)
      }

      // Tertiary sort: From Airport (ascending)
      if (a.departureAirport !== b.departureAirport) {
        return a.departureAirport.localeCompare(b.departureAirport)
      }

      // Quaternary sort: To Airport (ascending)
      return a.arrivalAirport.localeCompare(b.arrivalAirport)
    })
  }

  const sortedOutgoingFlights = useMemo(() => sortFlights(filteredOutgoingFlights), [filteredOutgoingFlights])
  const sortedReturnFlights = useMemo(() => sortFlights(filteredReturnFlights), [filteredReturnFlights])

  const paginatedOutgoingFlights = useMemo(() => {
    if (outgoingItemsPerPage === "all") {
      return sortedOutgoingFlights
    }
    const startIndex = (outgoingCurrentPage - 1) * outgoingItemsPerPage
    const endIndex = startIndex + outgoingItemsPerPage
    return sortedOutgoingFlights.slice(startIndex, endIndex)
  }, [sortedOutgoingFlights, outgoingItemsPerPage, outgoingCurrentPage])

  const paginatedReturnFlights = useMemo(() => {
    if (returnItemsPerPage === "all") {
      return sortedReturnFlights
    }
    const startIndex = (returnCurrentPage - 1) * returnItemsPerPage
    const endIndex = startIndex + returnItemsPerPage
    return sortedReturnFlights.slice(startIndex, endIndex)
  }, [sortedReturnFlights, returnItemsPerPage, returnCurrentPage])

  const outgoingTotalPages = useMemo(() => {
    if (outgoingItemsPerPage === "all") return 1
    return Math.ceil(sortedOutgoingFlights.length / outgoingItemsPerPage)
  }, [sortedOutgoingFlights.length, outgoingItemsPerPage])

  const returnTotalPages = useMemo(() => {
    if (returnItemsPerPage === "all") return 1
    return Math.ceil(sortedReturnFlights.length / returnItemsPerPage)
  }, [sortedReturnFlights.length, returnItemsPerPage])

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setOutgoingCurrentPage(1)
    setReturnCurrentPage(1)
  }, [
    dateFilters,
    dayFilters,
    fromAirportFilters,
    toAirportFilters,
    airlineFilters,
    outgoingItemsPerPage,
    returnItemsPerPage,
  ])

  useEffect(() => {
    const outgoingContainer = outgoingTableRef.current
    if (!outgoingContainer) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = outgoingContainer
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10
      setShowOutgoingScrollIndicator(!isAtEnd)
    }

    handleScroll()
    outgoingContainer.addEventListener("scroll", handleScroll)
    return () => outgoingContainer.removeEventListener("scroll", handleScroll)
  }, [paginatedOutgoingFlights])

  useEffect(() => {
    const returnContainer = returnTableRef.current
    if (!returnContainer) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = returnContainer
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10
      setShowReturnScrollIndicator(!isAtEnd)
    }

    handleScroll()
    returnContainer.addEventListener("scroll", handleScroll)
    return () => returnContainer.removeEventListener("scroll", handleScroll)
  }, [paginatedReturnFlights])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4 ml-1" />
    return <ArrowDown className="w-4 h-4 ml-1" />
  }

  const FilterPopover = ({
    values,
    selectedValues,
    onSelectionChange,
    label,
  }: {
    values: string[]
    selectedValues: string[]
    onSelectionChange: (values: string[]) => void
    label: string
  }) => {
    const toggleValue = (value: string) => {
      if (selectedValues.includes(value)) {
        onSelectionChange(selectedValues.filter((v) => v !== value))
      } else {
        onSelectionChange([...selectedValues, value])
      }
    }

    const clearAll = () => onSelectionChange([])

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-6 px-2">
            <ChevronDown className="w-3 h-3" />
            {selectedValues.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5">
                {selectedValues.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-3" align="start">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{label}</span>
            {selectedValues.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-xs">
                Clear
              </Button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {values.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-${value}`}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={() => toggleValue(value)}
                />
                <label htmlFor={`${label}-${value}`} className="text-sm cursor-pointer flex-1">
                  {value}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const FlightTable = ({
    flights,
    tableRef,
    showScrollIndicator,
    title,
  }: {
    flights: Flight[]
    tableRef: React.RefObject<HTMLDivElement>
    showScrollIndicator: boolean
    title: string
  }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">{title}</h2>
      <Card className="overflow-hidden shadow-lg p-0">
        <CardContent className="p-0">
          <div className="relative">
            {showScrollIndicator && (
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-20 flex items-center justify-end pr-3">
                <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-xl border-2 border-white animate-bounce">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            )}

            <div ref={tableRef} className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button onClick={() => handleSort("date")} className="flex items-center hover:text-primary">
                          Date
                          <SortIcon field="date" />
                        </button>
                        <FilterPopover
                          values={uniqueDates}
                          selectedValues={dateFilters}
                          onSelectionChange={setDateFilters}
                          label="Filter by Date"
                        />
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button onClick={() => handleSort("day")} className="flex items-center hover:text-primary">
                          Day
                          <SortIcon field="day" />
                        </button>
                        <FilterPopover
                          values={uniqueDays}
                          selectedValues={dayFilters}
                          onSelectionChange={setDayFilters}
                          label="Filter by Day"
                        />
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSort("takeOffTime")}
                          className="flex items-center hover:text-primary"
                        >
                          Take Off Time
                          <SortIcon field="takeOffTime" />
                        </button>
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSort("landingTime")}
                          className="flex items-center hover:text-primary"
                        >
                          Landing Time
                          <SortIcon field="landingTime" />
                        </button>
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSort("fromAirport")}
                          className="flex items-center hover:text-primary"
                        >
                          From Airport
                          <SortIcon field="fromAirport" />
                        </button>
                        <FilterPopover
                          values={uniqueFromAirports}
                          selectedValues={fromAirportFilters}
                          onSelectionChange={setFromAirportFilters}
                          label="Filter by Departure"
                        />
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSort("toAirport")}
                          className="flex items-center hover:text-primary"
                        >
                          To Airport
                          <SortIcon field="toAirport" />
                        </button>
                        <FilterPopover
                          values={uniqueToAirports}
                          selectedValues={toAirportFilters}
                          onSelectionChange={setToAirportFilters}
                          label="Filter by Arrival"
                        />
                      </div>
                    </th>
                    <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <button onClick={() => handleSort("airline")} className="flex items-center hover:text-primary">
                          Airline
                          <SortIcon field="airline" />
                        </button>
                        <FilterPopover
                          values={uniqueAirlines}
                          selectedValues={airlineFilters}
                          onSelectionChange={setAirlineFilters}
                          label="Filter by Airline"
                        />
                      </div>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleSort("costCabinBag")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Cabin Bag
                        <SortIcon field="costCabinBag" />
                      </button>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleSort("costCheckedBag")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Checked Bag
                        <SortIcon field="costCheckedBag" />
                      </button>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleSort("costTicketAlone")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Ticket Alone
                        <SortIcon field="costTicketAlone" />
                      </button>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap bg-blue-50">
                      <button
                        onClick={() => handleSort("costTicketCabin")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Ticket + Cabin
                        <SortIcon field="costTicketCabin" />
                      </button>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap bg-green-50">
                      <button
                        onClick={() => handleSort("costTicketChecked")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Ticket + Checked
                        <SortIcon field="costTicketChecked" />
                      </button>
                    </th>
                    <th className="text-right p-3 font-semibold text-sm whitespace-nowrap bg-amber-50">
                      <button
                        onClick={() => handleSort("costTicketBoth")}
                        className="flex items-center justify-end hover:text-primary ml-auto"
                      >
                        Ticket + Both
                        <SortIcon field="costTicketBoth" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flights.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="p-12 text-center text-muted-foreground">
                        No flights found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    flights.map((flight, index) => (
                      <tr
                        key={flight._id || flight.id}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="p-3 text-sm whitespace-nowrap">{formatDate(flight.departureDate)}</td>
                        <td className="p-3 text-sm whitespace-nowrap">{getDayOfWeek(flight.departureDate)}</td>
                        <td className="p-3 text-sm font-mono">{flight.departureTime}</td>
                        <td className="p-3 text-sm font-mono">{flight.arrivalTime}</td>
                        <td className="p-3 text-sm">
                          <div className="font-semibold">{flight.departureAirport}</div>
                          <div className="text-xs text-muted-foreground">{flight.departureAirportName}</div>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="font-semibold">{flight.arrivalAirport}</div>
                          <div className="text-xs text-muted-foreground">{flight.arrivalAirportName}</div>
                        </td>
                        <td className="p-3 text-sm">
                          {getAirlineIcon(flight.airline) ? (
                            <div className="group relative inline-block">
                              <img
                                src={getAirlineIcon(flight.airline) || "/placeholder.svg"}
                                alt={flight.airline}
                                className="h-8 w-8 object-contain cursor-help"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<span class="font-medium text-sm">${flight.airline}</span>`
                                  }
                                }}
                              />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                {flight.airline}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          ) : (
                            <span className="font-medium text-sm">{flight.airline}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-right font-mono">{formatCurrency(flight.costCabinBag)}</td>
                        <td className="p-3 text-sm text-right font-mono">{formatCurrency(flight.costCheckedBag)}</td>
                        <td className="p-3 text-sm text-right font-mono font-semibold">
                          {formatCurrency(flight.costTicketAlone)}
                        </td>
                        <td className="p-3 text-sm text-right font-mono font-semibold bg-blue-50">
                          {formatCurrency(getTicketPlusCabin(flight))}
                        </td>
                        <td className="p-3 text-sm text-right font-mono font-semibold bg-green-50">
                          {formatCurrency(getTicketPlusChecked(flight))}
                        </td>
                        <td className="p-3 text-sm text-right font-mono font-semibold bg-amber-50">
                          {formatCurrency(getTicketPlusBoth(flight))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!accessible) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="script text-5xl sm:text-6xl mb-4">{t("flights")}</h1>
          <p className="text-xl text-muted-foreground mb-2">Flight Information</p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Browse available flights to help plan your journey to our wedding
          </p>
        </div>

        {(dateFilters.length > 0 ||
          dayFilters.length > 0 ||
          fromAirportFilters.length > 0 ||
          toAirportFilters.length > 0 ||
          airlineFilters.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {[...dateFilters, ...dayFilters, ...fromAirportFilters, ...toAirportFilters, ...airlineFilters].map(
              (filter) => (
                <Button
                  key={filter}
                  variant="secondary"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setDateFilters(dateFilters.filter((f) => f !== filter))
                    setDayFilters(dayFilters.filter((f) => f !== filter))
                    setFromAirportFilters(fromAirportFilters.filter((f) => f !== filter))
                    setToAirportFilters(toAirportFilters.filter((f) => f !== filter))
                    setAirlineFilters(airlineFilters.filter((f) => f !== filter))
                  }}
                >
                  {filter}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              ),
            )}
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <div className="inline-block px-6 py-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm max-w-3xl">
            <p className="text-sm text-amber-900 text-center">
              <strong>Note:</strong> The flight details below were checked in October 2025 and may vary depending on
              when you book. Please verify current prices and availability with the airlines.
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={outgoingItemsPerPage.toString()}
              onValueChange={(value) => setOutgoingItemsPerPage(value === "all" ? "all" : Number.parseInt(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="all">All flights</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {outgoingItemsPerPage === "all" ? (
              <>Showing all {sortedOutgoingFlights.length} outgoing flights</>
            ) : (
              <>
                Showing {(outgoingCurrentPage - 1) * outgoingItemsPerPage + 1}-
                {Math.min(outgoingCurrentPage * outgoingItemsPerPage, sortedOutgoingFlights.length)} of{" "}
                {sortedOutgoingFlights.length} outgoing flights
              </>
            )}
          </div>
        </div>

        <FlightTable
          flights={paginatedOutgoingFlights}
          tableRef={outgoingTableRef}
          showScrollIndicator={showOutgoingScrollIndicator}
          title="Outgoing Flights"
        />

        {outgoingItemsPerPage !== "all" && outgoingTotalPages > 1 && (
          <div className="mb-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOutgoingCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={outgoingCurrentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {outgoingCurrentPage} of {outgoingTotalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOutgoingCurrentPage((prev) => Math.min(outgoingTotalPages, prev + 1))}
              disabled={outgoingCurrentPage === outgoingTotalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        <div className="my-16 flex items-center justify-center">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/30"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
              <Plane className="w-5 h-5 text-primary rotate-180" />
              <span className="text-sm font-medium text-primary">Return Flights</span>
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/30"></div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={returnItemsPerPage.toString()}
              onValueChange={(value) => setReturnItemsPerPage(value === "all" ? "all" : Number.parseInt(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="all">All flights</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {returnItemsPerPage === "all" ? (
              <>Showing all {sortedReturnFlights.length} return flights</>
            ) : (
              <>
                Showing {(returnCurrentPage - 1) * returnItemsPerPage + 1}-
                {Math.min(returnCurrentPage * returnItemsPerPage, sortedReturnFlights.length)} of{" "}
                {sortedReturnFlights.length} return flights
              </>
            )}
          </div>
        </div>

        <FlightTable
          flights={paginatedReturnFlights}
          tableRef={returnTableRef}
          showScrollIndicator={showReturnScrollIndicator}
          title="Return Flights"
        />

        {returnItemsPerPage !== "all" && returnTotalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReturnCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={returnCurrentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {returnCurrentPage} of {returnTotalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReturnCurrentPage((prev) => Math.min(returnTotalPages, prev + 1))}
              disabled={returnCurrentPage === returnTotalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
