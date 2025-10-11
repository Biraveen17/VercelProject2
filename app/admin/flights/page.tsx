"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

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

interface AirportMapping {
  code: string
  name: string
}

interface AirlineIconMapping {
  airline: string
  iconUrl: string
}

export default function FlightsManagementPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [flights, setFlights] = useState<Flight[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    flightId: string
    flightInfo: string
  }>({
    show: false,
    flightId: "",
    flightInfo: "",
  })

  const [airportMappings, setAirportMappings] = useState<AirportMapping[]>([])
  const [newAirportCode, setNewAirportCode] = useState("")
  const [newAirportName, setNewAirportName] = useState("")

  const [airlineIconMappings, setAirlineIconMappings] = useState<AirlineIconMapping[]>([])
  const [newAirlineName, setNewAirlineName] = useState("")
  const [newAirlineIconUrl, setNewAirlineIconUrl] = useState("")

  const [formData, setFormData] = useState({
    airline: "",
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    costCabinBag: "",
    costCheckedBag: "",
    costTicketAlone: "",
    notes: "",
    enabled: true,
  })

  const [errorMessage, setErrorMessage] = useState("")

  const [csvImportConfirmation, setCsvImportConfirmation] = useState<{
    show: boolean
    flightsToDisable: Flight[]
    flightsToAdd: any[]
    csvData: any[]
  }>({
    show: false,
    flightsToDisable: [],
    flightsToAdd: [],
    csvData: [],
  })

  const formatDateToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return ""
    if (dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-")
      return `${day}/${month}/${year}`
    }
    return dateStr
  }

  const formatDateToYYYYMMDD = (dateStr: string) => {
    if (!dateStr) return ""
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/")
      return `${year}-${month}-${day}`
    }
    return dateStr
  }

  const normalizeFlightForComparison = (flight: any) => {
    return {
      airline: flight.airline?.trim() || "",
      departureAirport: flight.departureAirport?.trim().toUpperCase() || "",
      arrivalAirport: flight.arrivalAirport?.trim().toUpperCase() || "",
      departureDate: formatDateToDDMMYYYY(flight.departureDate?.trim() || ""),
      departureTime: flight.departureTime?.trim() || "",
    }
  }

  const getAirportName = (code: string) => {
    const mapping = airportMappings.find((m) => m.code === code.toUpperCase())
    return mapping ? mapping.name : ""
  }

  const loadAirportMappings = async () => {
    try {
      const response = await fetch("/api/airport-mappings")
      if (response.ok) {
        const data = await response.json()
        setAirportMappings(data)
      }
    } catch (error) {
      console.error("Error loading airport mappings:", error)
    }
  }

  const loadAirlineMappings = async () => {
    try {
      const response = await fetch("/api/airline-mappings")
      if (response.ok) {
        const data = await response.json()
        setAirlineIconMappings(data)
      }
    } catch (error) {
      console.error("Error loading airline mappings:", error)
    }
  }

  const loadFlights = async () => {
    try {
      const response = await fetch("/api/flights")
      if (response.ok) {
        const data = await response.json()
        setFlights(Array.isArray(data) ? data.map((f: any) => ({ ...f, id: f._id || f.id })) : [])
      } else {
        console.error("Failed to fetch flights")
        setFlights([])
      }
    } catch (error) {
      console.error("Error loading flights:", error)
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await checkAuthentication()
      setAuthenticated(isAuth)
      if (isAuth) {
        loadFlights()
        loadAirportMappings()
        loadAirlineMappings()
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.airline.trim()) {
      setErrorMessage("Airline is required.")
      return
    }

    try {
      const url = editingFlight ? `/api/flights/${editingFlight._id || editingFlight.id}` : "/api/flights"
      const method = editingFlight ? "PATCH" : "POST"

      const departureAirportName = getAirportName(formData.departureAirport)
      const arrivalAirportName = getAirportName(formData.arrivalAirport)

      // Convert numeric cost fields to numbers, handling empty strings
      const numericFormData = {
        ...formData,
        costCabinBag: formData.costCabinBag ? Number.parseFloat(formData.costCabinBag) : 0,
        costCheckedBag: formData.costCheckedBag ? Number.parseFloat(formData.costCheckedBag) : 0,
        costTicketAlone: formData.costTicketAlone ? Number.parseFloat(formData.costTicketAlone) : 0,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...numericFormData,
          departureAirportName,
          arrivalAirportName,
        }),
      })

      if (response.ok) {
        await loadFlights()
        setShowAddDialog(false)
        setEditingFlight(null)
        setFormData({
          airline: "",
          departureAirport: "",
          arrivalAirport: "",
          departureDate: "",
          departureTime: "",
          arrivalDate: "",
          arrivalTime: "",
          costCabinBag: "",
          costCheckedBag: "",
          costTicketAlone: "",
          notes: "",
          enabled: true,
        })
      } else {
        const error = await response.json()
        setErrorMessage(error.error || "Failed to save flight. Please try again.")
      }
    } catch (error) {
      console.error("Error saving flight:", error)
      setErrorMessage("An error occurred while saving the flight.")
    }
  }

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight)
    setFormData({
      airline: flight.airline,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureDate: formatDateToYYYYMMDD(flight.departureDate),
      departureTime: flight.departureTime,
      arrivalDate: formatDateToYYYYMMDD(flight.arrivalDate),
      arrivalTime: flight.arrivalTime,
      costCabinBag: flight.costCabinBag ? flight.costCabinBag.toString() : "",
      costCheckedBag: flight.costCheckedBag ? flight.costCheckedBag.toString() : "",
      costTicketAlone: flight.costTicketAlone ? flight.costTicketAlone.toString() : "",
      notes: flight.notes || "",
      enabled: flight.enabled !== undefined ? flight.enabled : true,
    })
    setShowAddDialog(true)
  }

  const handleDelete = (id: string) => {
    const flight = flights.find((f) => (f._id || f.id) === id)
    if (flight) {
      setDeleteConfirmation({
        show: true,
        flightId: id,
        flightInfo: `${flight.airline} from ${flight.departureAirport} to ${flight.arrivalAirport}`,
      })
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/flights/${deleteConfirmation.flightId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadFlights()
        setDeleteConfirmation({ show: false, flightId: "", flightInfo: "" })
      } else {
        console.error("Failed to delete flight")
      }
    } catch (error) {
      console.error("Error deleting flight:", error)
    }
  }

  const handleAddAirportMapping = async () => {
    const code = newAirportCode.trim().toUpperCase()
    const name = newAirportName.trim()

    if (code && name) {
      if (!airportMappings.find((m) => m.code === code)) {
        try {
          const response = await fetch("/api/airport-mappings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, name }),
          })

          if (response.ok) {
            await loadAirportMappings()
            setNewAirportCode("")
            setNewAirportName("")
          } else {
            alert("Failed to add airport mapping")
          }
        } catch (error) {
          console.error("Error adding airport mapping:", error)
          alert("Error adding airport mapping")
        }
      } else {
        alert(`Airport code ${code} already exists`)
      }
    } else {
      alert("Please enter both airport code and name")
    }
  }

  const handleRemoveAirportMapping = async (code: string) => {
    try {
      const response = await fetch(`/api/airport-mappings?code=${code}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadAirportMappings()
      } else {
        alert("Failed to delete airport mapping")
      }
    } catch (error) {
      console.error("Error deleting airport mapping:", error)
      alert("Error deleting airport mapping")
    }
  }

  const handleAddAirlineIconMapping = async () => {
    const airline = newAirlineName.trim()
    const iconUrl = newAirlineIconUrl.trim()

    if (airline && iconUrl) {
      if (!airlineIconMappings.find((m) => m.airline === airline)) {
        try {
          const response = await fetch("/api/airline-mappings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ airline, iconUrl }),
          })

          if (response.ok) {
            await loadAirlineMappings()
            setNewAirlineName("")
            setNewAirlineIconUrl("")
          } else {
            alert("Failed to add airline mapping")
          }
        } catch (error) {
          console.error("Error adding airline mapping:", error)
          alert("Error adding airline mapping")
        }
      } else {
        alert(`Airline ${airline} already exists`)
      }
    } else {
      alert("Please enter both airline name and icon URL")
    }
  }

  const handleRemoveAirlineIconMapping = async (airline: string) => {
    try {
      const response = await fetch(`/api/airline-mappings?airline=${encodeURIComponent(airline)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadAirlineMappings()
      } else {
        alert("Failed to delete airline mapping")
      }
    } catch (error) {
      console.error("Error deleting airline mapping:", error)
      alert("Error deleting airline mapping")
    }
  }

  const handleExportCSV = () => {
    const headers = [
      "Airline",
      "Departure Airport",
      "Departure Airport Name",
      "Arrival Airport",
      "Arrival Airport Name",
      "Departure Date",
      "Departure Time",
      "Arrival Date",
      "Arrival Time",
      "Cost Cabin Bag",
      "Cost Checked Bag",
      "Cost Ticket Alone",
      "Notes",
      "Enabled",
    ]

    const rows = flights.map((flight) => [
      flight.airline,
      flight.departureAirport,
      flight.departureAirportName,
      flight.arrivalAirport,
      flight.arrivalAirportName,
      flight.departureDate,
      flight.departureTime,
      flight.arrivalDate,
      flight.arrivalTime,
      flight.costCabinBag,
      flight.costCheckedBag,
      flight.costTicketAlone,
      flight.notes || "",
      flight.enabled ? "true" : "false",
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `flights_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const flightsMatch = (flight1: any, flight2: any) => {
    const normalized1 = normalizeFlightForComparison(flight1)
    const normalized2 = normalizeFlightForComparison(flight2)

    console.log("[v0] Comparing flights:", {
      flight1: normalized1,
      flight2: normalized2,
      match:
        normalized1.airline === normalized2.airline &&
        normalized1.departureAirport === normalized2.departureAirport &&
        normalized1.arrivalAirport === normalized2.arrivalAirport &&
        normalized1.departureDate === normalized2.departureDate &&
        normalized1.departureTime === normalized2.departureTime,
    })

    return (
      normalized1.airline === normalized2.airline &&
      normalized1.departureAirport === normalized2.departureAirport &&
      normalized1.arrivalAirport === normalized2.arrivalAirport &&
      normalized1.departureDate === normalized2.departureDate &&
      normalized1.departureTime === normalized2.departureTime
    )
  }

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

        // Parse CSV rows
        const csvFlights = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.replace(/"/g, "").trim())
          return {
            airline: values[0],
            departureAirport: values[1],
            departureAirportName: values[2],
            arrivalAirport: values[3],
            arrivalAirportName: values[4],
            departureDate: values[5],
            departureTime: values[6],
            arrivalDate: values[7],
            arrivalTime: values[8],
            costCabinBag: Number.parseFloat(values[9]) || 0,
            costCheckedBag: Number.parseFloat(values[10]) || 0,
            costTicketAlone: Number.parseFloat(values[11]) || 0,
            notes: values[12] || "",
            enabled: values[13] === "true",
          }
        })

        // Find flights to disable (exist in system but not in CSV)
        const flightsToDisable = flights.filter(
          (existingFlight) => !csvFlights.some((csvFlight) => flightsMatch(existingFlight, csvFlight)),
        )

        // Find flights to add (exist in CSV but not in system)
        const flightsToAdd = csvFlights.filter(
          (csvFlight) => !flights.some((existingFlight) => flightsMatch(existingFlight, csvFlight)),
        )

        // If there are flights to disable, show confirmation dialog
        if (flightsToDisable.length > 0) {
          setCsvImportConfirmation({
            show: true,
            flightsToDisable,
            flightsToAdd,
            csvData: csvFlights,
          })
        } else {
          // No flights to disable, proceed directly
          await processCsvImport(csvFlights, flightsToDisable, flightsToAdd)
        }
      } catch (error) {
        console.error("Error importing CSV:", error)
        alert("Error importing CSV file. Please check the format and try again.")
      }
    }
    reader.readAsText(file)
    event.target.value = "" // Reset input
  }

  const processCsvImport = async (csvFlights: any[], flightsToDisable: Flight[], flightsToAdd: any[]) => {
    try {
      // Disable flights that are not in CSV
      for (const flight of flightsToDisable) {
        await fetch(`/api/flights/${flight._id || flight.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: false }),
        })
      }

      // Add new flights from CSV
      for (const flight of flightsToAdd) {
        await fetch("/api/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...flight, enabled: true }),
        })
      }

      // Reload flights
      await loadFlights()
      alert(
        `Successfully imported CSV:\n- ${flightsToAdd.length} new flights added\n- ${flightsToDisable.length} flights disabled`,
      )
    } catch (error) {
      console.error("Error processing CSV import:", error)
      alert("Error processing CSV import. Please try again.")
    }
  }

  const confirmCsvImport = async () => {
    await processCsvImport(
      csvImportConfirmation.csvData,
      csvImportConfirmation.flightsToDisable,
      csvImportConfirmation.flightsToAdd,
    )
    setCsvImportConfirmation({
      show: false,
      flightsToDisable: [],
      flightsToAdd: [],
      csvData: [],
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Flight Management</h1>
              <p className="text-muted-foreground">Manage flights displayed on the flights page</p>
            </div>
          </div>
          <Button onClick={() => logout()} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{flights.length}</div>
              <div className="text-sm text-muted-foreground">Total Flights</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{flights.filter((f) => f.enabled).length}</div>
              <div className="text-sm text-muted-foreground">Enabled Flights</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{new Set(flights.map((f) => f.departureAirport)).size}</div>
              <div className="text-sm text-muted-foreground">Departure Airports</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Flight
          </Button>
          <Button onClick={handleExportCSV} variant="outline">
            Export to CSV
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Import from CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Airline</th>
                    <th className="text-left p-3">From</th>
                    <th className="text-left p-3">To</th>
                    <th className="text-left p-3">Departure</th>
                    <th className="text-left p-3">Arrival</th>
                    <th className="text-left p-3">Costs</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            flight.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {flight.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          {airlineIconMappings.find((m) => m.airline === flight.airline) && (
                            <img
                              src={
                                airlineIconMappings.find((m) => m.airline === flight.airline)?.iconUrl ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={flight.airline}
                              className="h-8 w-8 object-contain mr-2"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          )}
                          {flight.airline}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{flight.departureAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.departureAirportName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{flight.arrivalAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrivalAirportName}</div>
                      </td>
                      <td className="p-3">
                        <div>{formatDateToDDMMYYYY(flight.departureDate)}</div>
                        <div className="text-sm text-muted-foreground">{flight.departureTime}</div>
                      </td>
                      <td className="p-3">
                        <div>{formatDateToDDMMYYYY(flight.arrivalDate)}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrivalTime}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>Ticket: £{flight.costTicketAlone || 0}</div>
                          <div>Cabin: £{flight.costCabinBag || 0}</div>
                          <div>Checked: £{flight.costCheckedBag || 0}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(flight)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(flight.id as string)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {flights.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No flights added yet. Click "Add Flight" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Airport Code Mappings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage airport code to name mappings. When adding flights, airport names will be auto-populated from these
              mappings.
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Airport Code (e.g., LHR)"
                value={newAirportCode}
                onChange={(e) => setNewAirportCode(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-32"
              />
              <Input
                placeholder="Airport Name (e.g., London Heathrow)"
                value={newAirportName}
                onChange={(e) => setNewAirportName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddAirportMapping}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Airport Code</th>
                    <th className="text-left p-3">Airport Name</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airportMappings.map((mapping) => (
                    <tr key={mapping.code} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono font-semibold">{mapping.code}</td>
                      <td className="p-3">{mapping.name}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAirportMapping(mapping.code)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {airportMappings.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground">
                        No airport mappings added yet. Add mappings to help with flight management.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Airline Icon Mappings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage airline name to icon URL mappings. These icons will be displayed on the flights page. If no icon is
              configured for an airline, no icon will be shown.
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Airline Name (e.g., British Airways)"
                value={newAirlineName}
                onChange={(e) => setNewAirlineName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Icon URL (e.g., https://example.com/icon.png)"
                value={newAirlineIconUrl}
                onChange={(e) => setNewAirlineIconUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddAirlineIconMapping}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Airline Name</th>
                    <th className="text-left p-3">Icon Preview</th>
                    <th className="text-left p-3">Icon URL</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airlineIconMappings.map((mapping) => (
                    <tr key={mapping.airline} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-semibold">{mapping.airline}</td>
                      <td className="p-3">
                        <img
                          src={mapping.iconUrl || "/placeholder.svg"}
                          alt={mapping.airline}
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground truncate block max-w-md">{mapping.iconUrl}</span>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAirlineIconMapping(mapping.airline)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {airlineIconMappings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No airline icon mappings added yet. Add mappings to display airline icons on the flights page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open)
            if (!open) {
              setEditingFlight(null)
              setFormData({
                airline: "",
                departureAirport: "",
                arrivalAirport: "",
                departureDate: "",
                departureTime: "",
                arrivalDate: "",
                arrivalTime: "",
                costCabinBag: "",
                costCheckedBag: "",
                costTicketAlone: "",
                notes: "",
                enabled: true,
              })
              setErrorMessage("")
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFlight ? "Edit Flight" : "Add Flight"}</DialogTitle>
              <DialogDescription>
                {editingFlight ? "Update flight information" : "Add a new flight to the flights page"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <Label htmlFor="enabled">Enable this flight (visible on flights page)</Label>
              </div>

              <div>
                <Label htmlFor="airline">Airline *</Label>
                <select
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select an airline</option>
                  {airlineIconMappings.map((mapping) => (
                    <option key={mapping.airline} value={mapping.airline}>
                      {mapping.airline}
                    </option>
                  ))}
                </select>
                {airlineIconMappings.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    No airlines configured. Add airlines in the Airline Icon Mappings section below.
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureAirport">Departure Airport *</Label>
                  <select
                    id="departureAirport"
                    value={formData.departureAirport}
                    onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select departure airport</option>
                    {airportMappings.map((mapping) => (
                      <option key={mapping.code} value={mapping.code}>
                        {mapping.code} - {mapping.name}
                      </option>
                    ))}
                  </select>
                  {airportMappings.length === 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      No airports configured. Add airports in the Airport Code Mappings section below.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="arrivalAirport">Arrival Airport *</Label>
                  <select
                    id="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select arrival airport</option>
                    {airportMappings.map((mapping) => (
                      <option key={mapping.code} value={mapping.code}>
                        {mapping.code} - {mapping.name}
                      </option>
                    ))}
                  </select>
                  {airportMappings.length === 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      No airports configured. Add airports in the Airport Code Mappings section below.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => {
                      const newDate = e.target.value
                      setFormData({
                        ...formData,
                        departureDate: newDate,
                        arrivalDate: formData.arrivalDate || newDate, // Only set if arrival date is empty
                      })
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => {
                      const newTime = e.target.value
                      setFormData({
                        ...formData,
                        departureTime: newTime,
                        arrivalTime: formData.arrivalTime || newTime, // Only set if arrival time is empty
                      })
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalDate">Arrival Date *</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time *</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="costTicketAlone">Ticket Cost (£)</Label>
                  <Input
                    id="costTicketAlone"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costTicketAlone}
                    onChange={(e) => setFormData({ ...formData, costTicketAlone: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="costCabinBag">Cabin Bag Cost (£)</Label>
                  <Input
                    id="costCabinBag"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costCabinBag}
                    onChange={(e) => setFormData({ ...formData, costCabinBag: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="costCheckedBag">Checked Bag Cost (£)</Label>
                  <Input
                    id="costCheckedBag"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costCheckedBag}
                    onChange={(e) => setFormData({ ...formData, costCheckedBag: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information about the flight"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingFlight ? "Update Flight" : "Add Flight"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false)
                    setEditingFlight(null)
                    setErrorMessage("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteConfirmation.show}
          onOpenChange={(open) => !open && setDeleteConfirmation({ show: false, flightId: "", flightInfo: "" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete flight <strong>{deleteConfirmation.flightInfo}</strong>?
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ show: false, flightId: "", flightInfo: "" })}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={csvImportConfirmation.show}
          onOpenChange={(open) =>
            !open &&
            setCsvImportConfirmation({
              show: false,
              flightsToDisable: [],
              flightsToAdd: [],
              csvData: [],
            })
          }
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Confirm CSV Import</DialogTitle>
              <DialogDescription>
                The following flights will be disabled as they are not in the CSV file:
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-destructive">
                  Flights to be disabled ({csvImportConfirmation.flightsToDisable.length}):
                </h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  {csvImportConfirmation.flightsToDisable.map((flight, index) => (
                    <div key={index} className="text-sm py-1 border-b last:border-b-0">
                      <strong>{flight.airline}</strong> - {flight.departureAirport} to {flight.arrivalAirport} on{" "}
                      {formatDateToDDMMYYYY(flight.departureDate)} at {flight.departureTime}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-green-600">
                  New flights to be added ({csvImportConfirmation.flightsToAdd.length}):
                </h3>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {csvImportConfirmation.flightsToAdd.map((flight, index) => (
                    <div key={index} className="text-sm py-1 border-b last:border-b-0">
                      <strong>{flight.airline}</strong> - {flight.departureAirport} to {flight.arrivalAirport} on{" "}
                      {formatDateToDDMMYYYY(flight.departureDate)} at {flight.departureTime}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Flights that exist in both the system and CSV will remain unchanged.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setCsvImportConfirmation({
                    show: false,
                    flightsToDisable: [],
                    flightsToAdd: [],
                    csvData: [],
                  })
                }
              >
                Cancel
              </Button>
              <Button onClick={confirmCsvImport}>Confirm Import</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
