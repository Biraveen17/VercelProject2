"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, X, ChevronLeft, ChevronRight, Plane } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
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

  const [outgoingSortField, setOutgoingSortField] = useState<SortField | null>(null)
  const [outgoingSortDirection, setOutgoingSortDirection] = useState<SortDirection>(null)
  const [returnSortField, setReturnSortField] = useState<SortField | null>(null)
  const [returnSortDirection, setReturnSortDirection] = useState<SortDirection>(null)

  const [outgoingDateFilters, setOutgoingDateFilters] = useState<string[]>([])
  const [outgoingDayFilters, setOutgoingDayFilters] = useState<string[]>([])
  const [outgoingFromAirportFilters, setOutgoingFromAirportFilters] = useState<string[]>([])
  const [outgoingToAirportFilters, setOutgoingToAirportFilters] = useState<string[]>([])
  const [outgoingAirlineFilters, setOutgoingAirlineFilters] = useState<string[]>([])

  const [returnDateFilters, setReturnDateFilters] = useState<string[]>([])
  const [returnDayFilters, setReturnDayFilters] = useState<string[]>([])
  const [returnFromAirportFilters, setReturnFromAirportFilters] = useState<string[]>([])
  const [returnToAirportFilters, setReturnToAirportFilters] = useState<string[]>([])
  const [returnAirlineFilters, setReturnAirlineFilters] = useState<string[]>([])

  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAccessibility()
  }, [])

  useEffect(() => {
    if (flights.length > 0 && outgoingSortField === null) {
      setOutgoingSortField("date")
      setOutgoingSortDirection("asc")
    }
  }, [flights, outgoingSortField])

  useEffect(() => {
    if (flights.length > 0 && returnSortField === null) {
      setReturnSortField("date")
      setReturnSortDirection("asc")
    }
  }, [flights, returnSortField])

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

  const outgoingUniqueDates = useMemo(
    () => Array.from(new Set(outgoingFlights.map((f) => formatDate(f.departureDate)))),
    [outgoingFlights],
  )
  const outgoingUniqueDays = useMemo(
    () => Array.from(new Set(outgoingFlights.map((f) => getDayOfWeek(f.departureDate)))),
    [outgoingFlights],
  )
  const outgoingUniqueFromAirports = useMemo(
    () => Array.from(new Set(outgoingFlights.map((f) => `${f.departureAirport} - ${f.departureAirportName}`))),
    [outgoingFlights],
  )
  const outgoingUniqueToAirports = useMemo(
    () => Array.from(new Set(outgoingFlights.map((f) => `${f.arrivalAirport} - ${f.arrivalAirportName}`))),
    [outgoingFlights],
  )
  const outgoingUniqueAirlines = useMemo(
    () => Array.from(new Set(outgoingFlights.map((f) => f.airline))),
    [outgoingFlights],
  )

  const returnUniqueDates = useMemo(
    () => Array.from(new Set(returnFlights.map((f) => formatDate(f.departureDate)))),
    [returnFlights],
  )
  const returnUniqueDays = useMemo(
    () => Array.from(new Set(returnFlights.map((f) => getDayOfWeek(f.departureDate)))),
    [returnFlights],
  )
  const returnUniqueFromAirports = useMemo(
    () => Array.from(new Set(returnFlights.map((f) => `${f.departureAirport} - ${f.departureAirportName}`))),
    [returnFlights],
  )
  const returnUniqueToAirports = useMemo(
    () => Array.from(new Set(returnFlights.map((f) => `${f.arrivalAirport} - ${f.arrivalAirportName}`))),
    [returnFlights],
  )
  const returnUniqueAirlines = useMemo(() => Array.from(new Set(returnFlights.map((f) => f.airline))), [returnFlights])

  const filteredOutgoingFlights = useMemo(() => {
    return outgoingFlights.filter((flight) => {
      if (outgoingDateFilters.length > 0 && !outgoingDateFilters.includes(formatDate(flight.departureDate)))
        return false
      if (outgoingDayFilters.length > 0 && !outgoingDayFilters.includes(getDayOfWeek(flight.departureDate)))
        return false
      if (
        outgoingFromAirportFilters.length > 0 &&
        !outgoingFromAirportFilters.includes(`${flight.departureAirport} - ${flight.departureAirportName}`)
      )
        return false
      if (
        outgoingToAirportFilters.length > 0 &&
        !outgoingToAirportFilters.includes(`${flight.arrivalAirport} - ${flight.arrivalAirportName}`)
      )
        return false
      if (outgoingAirlineFilters.length > 0 && !outgoingAirlineFilters.includes(flight.airline)) return false
      return true
    })
  }, [
    outgoingFlights,
    outgoingDateFilters,
    outgoingDayFilters,
    outgoingFromAirportFilters,
    outgoingToAirportFilters,
    outgoingAirlineFilters,
  ])

  const filteredReturnFlights = useMemo(() => {
    return returnFlights.filter((flight) => {
      if (returnDateFilters.length > 0 && !returnDateFilters.includes(formatDate(flight.departureDate))) return false
      if (returnDayFilters.length > 0 && !returnDayFilters.includes(getDayOfWeek(flight.departureDate))) return false
      if (
        returnFromAirportFilters.length > 0 &&
        !returnFromAirportFilters.includes(`${flight.departureAirport} - ${flight.departureAirportName}`)
      )
        return false
      if (
        returnToAirportFilters.length > 0 &&
        !returnToAirportFilters.includes(`${flight.arrivalAirport} - ${flight.arrivalAirportName}`)
      )
        return false
      if (returnAirlineFilters.length > 0 && !returnAirlineFilters.includes(flight.airline)) return false
      return true
    })
  }, [
    returnFlights,
    returnDateFilters,
    returnDayFilters,
    returnFromAirportFilters,
    returnToAirportFilters,
    returnAirlineFilters,
  ])

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

  useEffect(() => {
    setOutgoingCurrentPage(1)
  }, [
    outgoingDateFilters,
    outgoingDayFilters,
    outgoingFromAirportFilters,
    outgoingToAirportFilters,
    outgoingAirlineFilters,
    outgoingItemsPerPage,
  ])

  useEffect(() => {
    setReturnCurrentPage(1)
  }, [
    returnDateFilters,
    returnDayFilters,
    returnFromAirportFilters,
    returnToAirportFilters,
    returnAirlineFilters,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setOpenFilterDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const FilterDropdown = ({
    values,
    selectedValues,
    onSelectionChange,
    label,
    filterId,
  }: {
    values: string[]
    selectedValues: string[]
    onSelectionChange: (values: string[]) => void
    label: string
    filterId: string
  }) => {
    const isOpen = openFilterDropdown === filterId

    const toggleValue = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]
      onSelectionChange(newValues)
    }

    const clearAll = () => onSelectionChange([])

    return (
      <div className="relative inline-block" ref={isOpen ? filterDropdownRef : null}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={(e) => {
            e.stopPropagation()
            setOpenFilterDropdown(isOpen ? null : filterId)
          }}
        >
          <ChevronDown className="w-3 h-3" />
          {selectedValues.length > 0 && (
            <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5">
              {selectedValues.length}
            </span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3 z-[100]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{label}</span>
              {selectedValues.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-xs">
                  Clear
                </Button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {values.map((value) => {
                const isChecked = selectedValues.includes(value)
                return (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${filterId}-${value}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleValue(value)}
                    />
                    <label
                      htmlFor={`${filterId}-${value}`}
                      className="text-sm cursor-pointer flex-1"
                      onClick={() => toggleValue(value)}
                    >
                      {value}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const FlightTable = ({
    flights,
    tableRef,
    showScrollIndicator,
    title,
    uniqueDates,
    uniqueDays,
    uniqueFromAirports,
    uniqueToAirports,
    uniqueAirlines,
    dateFilters,
    setDateFilters,
    dayFilters,
    setDayFilters,
    fromAirportFilters,
    setFromAirportFilters,
    toAirportFilters,
    setToAirportFilters,
    airlineFilters,
    setAirlineFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    tableId,
  }: {
    flights: Flight[]
    tableRef: React.RefObject<HTMLDivElement>
    showScrollIndicator: boolean
    title: string
    uniqueDates: string[]
    uniqueDays: string[]
    uniqueFromAirports: string[]
    uniqueToAirports: string[]
    uniqueAirlines: string[]
    dateFilters: string[]
    setDateFilters: (values: string[]) => void
    dayFilters: string[]
    setDayFilters: (values: string[]) => void
    fromAirportFilters: string[]
    setFromAirportFilters: (values: string[]) => void
    toAirportFilters: string[]
    setToAirportFilters: (values: string[]) => void
    airlineFilters: string[]
    setAirlineFilters: (values: string[]) => void
    sortField: SortField | null
    setSortField: (field: SortField | null) => void
    sortDirection: SortDirection
    setSortDirection: (direction: SortDirection) => void
    tableId: string
  }) => {
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

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">{title}</h2>
        <Card className="shadow-lg p-0">
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
                          <FilterDropdown
                            values={uniqueDates}
                            selectedValues={dateFilters}
                            onSelectionChange={setDateFilters}
                            label="Filter by Date"
                            filterId={`${tableId}-date-filter`}
                          />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          <button onClick={() => handleSort("day")} className="flex items-center hover:text-primary">
                            Day
                            <SortIcon field="day" />
                          </button>
                          <FilterDropdown
                            values={uniqueDays}
                            selectedValues={dayFilters}
                            onSelectionChange={setDayFilters}
                            label="Filter by Day"
                            filterId={`${tableId}-day-filter`}
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
                          <FilterDropdown
                            values={uniqueFromAirports}
                            selectedValues={fromAirportFilters}
                            onSelectionChange={setFromAirportFilters}
                            label="Filter by Departure"
                            filterId={`${tableId}-from-airport-filter`}
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
                          <FilterDropdown
                            values={uniqueToAirports}
                            selectedValues={toAirportFilters}
                            onSelectionChange={setToAirportFilters}
                            label="Filter by Arrival"
                            filterId={`${tableId}-to-airport-filter`}
                          />
                        </div>
                      </th>
                      <th className="text-left p-3 font-semibold text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleSort("airline")}
                            className="flex items-center hover:text-primary"
                          >
                            Airline
                            <SortIcon field="airline" />
                          </button>
                          <FilterDropdown
                            values={uniqueAirlines}
                            selectedValues={airlineFilters}
                            onSelectionChange={setAirlineFilters}
                            label="Filter by Airline"
                            filterId={`${tableId}-airline-filter`}
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
  }

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

        {(outgoingDateFilters.length > 0 ||
          outgoingDayFilters.length > 0 ||
          outgoingFromAirportFilters.length > 0 ||
          outgoingToAirportFilters.length > 0 ||
          outgoingAirlineFilters.length > 0 ||
          returnDateFilters.length > 0 ||
          returnDayFilters.length > 0 ||
          returnFromAirportFilters.length > 0 ||
          returnToAirportFilters.length > 0 ||
          returnAirlineFilters.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {[
              ...outgoingDateFilters,
              ...outgoingDayFilters,
              ...outgoingFromAirportFilters,
              ...outgoingToAirportFilters,
              ...outgoingAirlineFilters,
              ...returnDateFilters,
              ...returnDayFilters,
              ...returnFromAirportFilters,
              ...returnToAirportFilters,
              ...returnAirlineFilters,
            ].map((filter) => (
              <Button
                key={filter}
                variant="secondary"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setOutgoingDateFilters(outgoingDateFilters.filter((f) => f !== filter))
                  setOutgoingDayFilters(outgoingDayFilters.filter((f) => f !== filter))
                  setOutgoingFromAirportFilters(outgoingFromAirportFilters.filter((f) => f !== filter))
                  setOutgoingToAirportFilters(outgoingToAirportFilters.filter((f) => f !== filter))
                  setOutgoingAirlineFilters(outgoingAirlineFilters.filter((f) => f !== filter))
                  setReturnDateFilters(returnDateFilters.filter((f) => f !== filter))
                  setReturnDayFilters(returnDayFilters.filter((f) => f !== filter))
                  setReturnFromAirportFilters(returnFromAirportFilters.filter((f) => f !== filter))
                  setReturnToAirportFilters(returnToAirportFilters.filter((f) => f !== filter))
                  setReturnAirlineFilters(returnAirlineFilters.filter((f) => f !== filter))
                }}
              >
                {filter}
                <X className="w-3 h-3 ml-1" />
              </Button>
            ))}
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
          uniqueDates={outgoingUniqueDates}
          uniqueDays={outgoingUniqueDays}
          uniqueFromAirports={outgoingUniqueFromAirports}
          uniqueToAirports={outgoingUniqueToAirports}
          uniqueAirlines={outgoingUniqueAirlines}
          dateFilters={outgoingDateFilters}
          setDateFilters={setOutgoingDateFilters}
          dayFilters={outgoingDayFilters}
          setDayFilters={setOutgoingDayFilters}
          fromAirportFilters={outgoingFromAirportFilters}
          setFromAirportFilters={setOutgoingFromAirportFilters}
          toAirportFilters={outgoingToAirportFilters}
          setToAirportFilters={setOutgoingToAirportFilters}
          airlineFilters={outgoingAirlineFilters}
          setAirlineFilters={setOutgoingAirlineFilters}
          sortField={outgoingSortField}
          setSortField={setOutgoingSortField}
          sortDirection={outgoingSortDirection}
          setSortDirection={setOutgoingSortDirection}
          tableId="outgoing"
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
          uniqueDates={returnUniqueDates}
          uniqueDays={returnUniqueDays}
          uniqueFromAirports={returnUniqueFromAirports}
          uniqueToAirports={returnUniqueToAirports}
          uniqueAirlines={returnUniqueAirlines}
          dateFilters={returnDateFilters}
          setDateFilters={setReturnDateFilters}
          dayFilters={returnDayFilters}
          setDayFilters={setReturnDayFilters}
          fromAirportFilters={returnFromAirportFilters}
          setFromAirportFilters={setReturnFromAirportFilters}
          toAirportFilters={returnToAirportFilters}
          setToAirportFilters={setReturnToAirportFilters}
          airlineFilters={returnAirlineFilters}
          setAirlineFilters={setReturnAirlineFilters}
          sortField={returnSortField}
          setSortField={setReturnSortField}
          sortDirection={returnSortDirection}
          setSortDirection={setReturnSortDirection}
          tableId="return"
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
