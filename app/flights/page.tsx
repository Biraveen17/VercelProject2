"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, X, ChevronRight, Plane, Calculator } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

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
  | "totalCost" // Added totalCost sort field for calculator mode
type SortDirection = "asc" | "desc" | null

const CYPRUS_AIRPORT_CODES = ["LCA", "PFO", "ECN"]

export default function FlightsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [accessible, setAccessible] = useState(true)

  const [airlineIconMappings, setAirlineIconMappings] = useState<AirlineIconMapping[]>([])

  const [isCalculatorActive, setIsCalculatorActive] = useState(false)
  const [numGuests, setNumGuests] = useState<string>("")
  const [numCabinBags, setNumCabinBags] = useState<string>("")
  const [numCheckedBags, setNumCheckedBags] = useState<string>("")

  const [showCalculatorNotification, setShowCalculatorNotification] = useState(false)

  const outgoingTableRef = useRef<HTMLDivElement>(null)
  const returnTableRef = useRef<HTMLDivElement>(null)
  const [outgoingHasScrolledToEnd, setOutgoingHasScrolledToEnd] = useState(false)
  const [returnHasScrolledToEnd, setReturnHasScrolledToEnd] = useState(false)

  const outgoingScrollPositionRef = useRef<number>(0)
  const returnScrollPositionRef = useRef<number>(0)

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

  const [outgoingCurrentPage, setOutgoingCurrentPage] = useState<number>(1)
  const [returnCurrentPage, setReturnCurrentPage] = useState<number>(1)

  useEffect(() => {
    checkAccessibility()
  }, [])

  useLayoutEffect(() => {
    if (outgoingTableRef.current && outgoingScrollPositionRef.current > 0) {
      outgoingTableRef.current.scrollLeft = outgoingScrollPositionRef.current
    }
  }, [outgoingHasScrolledToEnd])

  useLayoutEffect(() => {
    if (returnTableRef.current && returnScrollPositionRef.current > 0) {
      returnTableRef.current.scrollLeft = returnScrollPositionRef.current
    }
  }, [returnHasScrolledToEnd])

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

  useEffect(() => {
    if (isCalculatorActive) {
      setShowCalculatorNotification(true)
      // Hide notification after 2.5 seconds
      const timer = setTimeout(() => {
        setShowCalculatorNotification(false)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isCalculatorActive])

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

  const sortFlights = (flightsToSort: Flight[], sortField: SortField | null, sortDirection: SortDirection) => {
    return [...flightsToSort].sort((a, b) => {
      // If no sort field selected, use default multi-level sort
      if (!sortField || !sortDirection) {
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
      }

      // User-selected sort
      let compareResult = 0
      const direction = sortDirection === "asc" ? 1 : -1

      switch (sortField) {
        case "date":
          compareResult = new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
          break
        case "day":
          compareResult = getDayOfWeek(a.departureDate).localeCompare(getDayOfWeek(b.departureDate))
          break
        case "takeOffTime":
          compareResult = a.departureTime.localeCompare(b.departureTime)
          break
        case "landingTime":
          compareResult = a.arrivalTime.localeCompare(b.arrivalTime)
          break
        case "fromAirport":
          compareResult = a.departureAirport.localeCompare(b.departureAirport)
          break
        case "toAirport":
          compareResult = a.arrivalAirport.localeCompare(b.arrivalAirport)
          break
        case "airline":
          compareResult = a.airline.localeCompare(b.airline)
          break
        case "costCabinBag":
          compareResult = a.costCabinBag - b.costCabinBag
          break
        case "costCheckedBag":
          compareResult = a.costCheckedBag - b.costCheckedBag
          break
        case "costTicketAlone":
          compareResult = a.costTicketAlone - b.costTicketAlone
          break
        case "costTicketCabin":
          compareResult = getTicketPlusCabin(a) - getTicketPlusCabin(b)
          break
        case "costTicketChecked":
          compareResult = getTicketPlusChecked(a) - getTicketPlusChecked(b)
          break
        case "costTicketBoth":
          compareResult = getTicketPlusBoth(a) - getTicketPlusBoth(b)
          break
        case "totalCost":
          const guests = numGuests === "" ? 1 : Number.parseInt(numGuests) || 1
          const cabinBags = numCabinBags === "" ? 0 : Number.parseInt(numCabinBags) || 0
          const checkedBags = numCheckedBags === "" ? 0 : Number.parseInt(numCheckedBags) || 0

          const totalA = a.costTicketAlone * guests + a.costCabinBag * cabinBags + a.costCheckedBag * checkedBags
          const totalB = b.costTicketAlone * guests + b.costCabinBag * cabinBags + b.costCheckedBag * checkedBags
          compareResult = totalA - totalB
          break
      }

      return compareResult * direction
    })
  }

  const sortedOutgoingFlights = useMemo(
    () => sortFlights(filteredOutgoingFlights, outgoingSortField, outgoingSortDirection),
    [filteredOutgoingFlights, outgoingSortField, outgoingSortDirection],
  )
  const sortedReturnFlights = useMemo(
    () => sortFlights(filteredReturnFlights, returnSortField, returnSortDirection),
    [filteredReturnFlights, returnSortField, returnSortDirection],
  )

  useEffect(() => {
    setOutgoingCurrentPage(1)
  }, [
    outgoingDateFilters,
    outgoingDayFilters,
    outgoingFromAirportFilters,
    outgoingToAirportFilters,
    outgoingAirlineFilters,
  ])

  useEffect(() => {
    setReturnCurrentPage(1)
  }, [returnDateFilters, returnDayFilters, returnFromAirportFilters, returnToAirportFilters, returnAirlineFilters])

  const handleOutgoingScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const { scrollLeft, scrollWidth, clientWidth } = target
    const scrollableWidth = scrollWidth - clientWidth

    outgoingScrollPositionRef.current = scrollLeft

    console.log("[v0] Outgoing scroll event fired:", {
      scrollLeft,
      scrollWidth,
      clientWidth,
      scrollableWidth,
      hasScrolledToEnd: outgoingHasScrolledToEnd,
    })

    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1
    if (isAtEnd && !outgoingHasScrolledToEnd) {
      console.log("[v0] Setting outgoingHasScrolledToEnd to true")
      setOutgoingHasScrolledToEnd(true)
    }
  }

  const handleReturnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const { scrollLeft, scrollWidth, clientWidth } = target
    const scrollableWidth = scrollWidth - clientWidth

    returnScrollPositionRef.current = scrollLeft

    console.log("[v0] Return scroll event fired:", {
      scrollLeft,
      scrollWidth,
      clientWidth,
      scrollableWidth,
      hasScrolledToEnd: returnHasScrolledToEnd,
    })

    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1
    if (isAtEnd && !returnHasScrolledToEnd) {
      console.log("[v0] Setting returnHasScrolledToEnd to true")
      setReturnHasScrolledToEnd(true)
    }
  }

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
          <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-3 z-[100] w-64">
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
    onScroll,
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
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
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

    const calculateTotalCost = (flight: Flight) => {
      const guests = numGuests === "" ? 1 : Number.parseInt(numGuests) || 1
      const cabinBags = numCabinBags === "" ? 0 : Number.parseInt(numCabinBags) || 0
      const checkedBags = numCheckedBags === "" ? 0 : Number.parseInt(numCheckedBags) || 0

      return flight.costTicketAlone * guests + flight.costCabinBag * cabinBags + flight.costCheckedBag * checkedBags
    }

    return (
      <div className="mb-12">
        <Card className="shadow-lg p-0 rounded-lg overflow-hidden isolate">
          <CardContent className="p-0">
            <div className="relative">
              <div
                className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none z-20 flex items-center justify-end pr-2 transition-opacity duration-300 ${
                  showScrollIndicator ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-xl border-2 border-white animate-bounce">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div ref={tableRef} className="overflow-x-auto max-w-full rounded-lg" onScroll={onScroll}>
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                    <tr className="border-b-2 border-border">
                      <th className="text-left p-3 font-semibold text-sm whitespace-nowrap rounded-tl-lg">
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
                      {!isCalculatorActive ? (
                        <>
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
                          <th className="text-right p-3 font-semibold text-sm whitespace-nowrap bg-amber-50 rounded-tr-lg">
                            <button
                              onClick={() => handleSort("costTicketBoth")}
                              className="flex items-center justify-end hover:text-primary ml-auto"
                            >
                              Ticket + Both
                              <SortIcon field="costTicketBoth" />
                            </button>
                          </th>
                        </>
                      ) : (
                        <th className="text-right p-3 font-semibold text-sm whitespace-nowrap bg-primary/10 rounded-tr-lg">
                          <button
                            onClick={() => handleSort("totalCost")}
                            className="flex items-center justify-end hover:text-primary ml-auto w-full"
                          >
                            <div className="flex items-center">
                              <Calculator className="w-4 h-4 mr-2" />
                              <span>Total Cost</span>
                              <SortIcon field="totalCost" />
                            </div>
                          </button>
                          <div className="text-xs font-normal text-muted-foreground mt-1">
                            {numGuests === "" ? 1 : Number.parseInt(numGuests) || 1} guest
                            {(numGuests === "" ? 1 : Number.parseInt(numGuests) || 1) !== 1 ? "s" : ""},{" "}
                            {numCabinBags === "" ? 0 : Number.parseInt(numCabinBags) || 0} cabin,{" "}
                            {numCheckedBags === "" ? 0 : Number.parseInt(numCheckedBags) || 0} checked
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {flights.length === 0 ? (
                      <tr>
                        <td colSpan={isCalculatorActive ? 8 : 13} className="p-12 text-center text-muted-foreground">
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
                                  className="h-8 w-16 object-contain cursor-help"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                    const parent = e.currentTarget.parentElement
                                    if (parent) {
                                      parent.innerHTML = `<span class="font-medium text-sm">${flight.airline}</span>`
                                    }
                                  }}
                                />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                                  {flight.airline}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            ) : (
                              <span className="font-medium text-sm">{flight.airline}</span>
                            )}
                          </td>
                          {!isCalculatorActive ? (
                            <>
                              <td className="p-3 text-sm text-right font-mono">
                                {formatCurrency(flight.costCabinBag)}
                              </td>
                              <td className="p-3 text-sm text-right font-mono">
                                {formatCurrency(flight.costCheckedBag)}
                              </td>
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
                            </>
                          ) : (
                            <td className="p-3 text-sm text-right font-mono font-bold text-lg bg-primary/10">
                              {formatCurrency(calculateTotalCost(flight))}
                            </td>
                          )}
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

        <div className="mb-8 flex justify-center">
          <div className="inline-block px-6 py-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm max-w-3xl">
            <p className="text-sm text-amber-900 text-center">
              <strong>Note:</strong> The flight details below were checked in October 2025 and may vary depending on
              when you book.
            </p>
          </div>
        </div>

        {showCalculatorNotification && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
            <div className="bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-2xl border-2 border-primary-foreground/20 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 animate-pulse" />
                <span className="font-medium">Scroll right in the tables below to see the Total Cost column</span>
                <ChevronRight className="w-5 h-5 animate-pulse" />
              </div>
              <button
                onClick={() => setShowCalculatorNotification(false)}
                className="ml-2 hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="my-16 flex items-center justify-center">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/30"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
              <Plane className="w-5 h-5 text-primary rotate-180" />
              <span className="text-xl font-medium text-primary">Flights to Cyprus</span>
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/30"></div>
          </div>
        </div>

        <FlightTable
          flights={sortedOutgoingFlights}
          tableRef={outgoingTableRef}
          showScrollIndicator={!outgoingHasScrolledToEnd}
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
          onScroll={handleOutgoingScroll}
        />

        <div className="my-16 flex items-center justify-center">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/30"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
              <Plane className="w-5 h-5 text-primary rotate-180" />
              <span className="text-xl font-medium text-primary">Flights from Cyprus</span>
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/30"></div>
          </div>
        </div>

        <FlightTable
          flights={sortedReturnFlights}
          tableRef={returnTableRef}
          showScrollIndicator={!returnHasScrolledToEnd}
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
          onScroll={handleReturnScroll}
        />

        <div className="mt-16 mb-8">
          <Card className="shadow-xl border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-primary">Flight Cost Calculator</h2>
              </div>

              {!isCalculatorActive ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Calculate the total cost for your group by entering the number of guests and baggage requirements.
                    The tables above will update to show personalized total costs.
                  </p>
                  <div className="flex flex-wrap gap-6 justify-center items-end mb-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Number of Guests</label>
                      <Input
                        type="number"
                        min="1"
                        value={numGuests}
                        onChange={(e) => setNumGuests(e.target.value)}
                        placeholder=""
                        className="w-32 text-center text-lg font-semibold border-2 border-gray-300 bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Cabin Bags</label>
                      <Input
                        type="number"
                        min="0"
                        value={numCabinBags}
                        onChange={(e) => setNumCabinBags(e.target.value)}
                        placeholder=""
                        className="w-32 text-center text-lg font-semibold border-2 border-gray-300 bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Checked Bags</label>
                      <Input
                        type="number"
                        min=""
                        value={numCheckedBags}
                        onChange={(e) => setNumCheckedBags(e.target.value)}
                        placeholder="0"
                        className="w-32 text-center text-lg font-semibold border-2 border-gray-300 bg-background"
                      />
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setIsCalculatorActive(true)}
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Total Costs
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/20">
                    <p className="text-lg mb-2">
                      Showing total costs for{" "}
                      <span className="font-bold text-primary">
                        {numGuests === "" ? 1 : Number.parseInt(numGuests) || 1}
                      </span>{" "}
                      guest
                      {(numGuests === "" ? 1 : Number.parseInt(numGuests) || 1) !== 1 ? "s" : ""}
                    </p>
                    <p className="text-muted-foreground">
                      with{" "}
                      <span className="font-semibold">
                        {numCabinBags === "" ? 0 : Number.parseInt(numCabinBags) || 0}
                      </span>{" "}
                      cabin bag
                      {(numCabinBags === "" ? 0 : Number.parseInt(numCabinBags) || 0) !== 1 ? "s" : ""} and{" "}
                      <span className="font-semibold">
                        {numCheckedBags === "" ? 0 : Number.parseInt(numCheckedBags) || 0}
                      </span>{" "}
                      checked bag
                      {(numCheckedBags === "" ? 0 : Number.parseInt(numCheckedBags) || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsCalculatorActive(false)}
                    className="text-lg px-8"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Show Individual Costs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
