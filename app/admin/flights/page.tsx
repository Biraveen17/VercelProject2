"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

interface Flight {
  _id?: string
  id?: string
  airline: string
  flightNumber: string
  departureAirport: string
  departureAirportName: string
  arrivalAirport: string
  arrivalAirportName: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  notes?: string
  createdAt: string
  lastUpdated: string
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

  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    departureAirport: "",
    departureAirportName: "",
    arrivalAirport: "",
    arrivalAirportName: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    notes: "",
  })

  const [errorMessage, setErrorMessage] = useState("")

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
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.airline.trim() || !formData.flightNumber.trim()) {
      setErrorMessage("Airline and flight number are required.")
      return
    }

    try {
      const url = editingFlight ? `/api/flights/${editingFlight._id || editingFlight.id}` : "/api/flights"
      const method = editingFlight ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadFlights()
        setShowAddDialog(false)
        setEditingFlight(null)
        setFormData({
          airline: "",
          flightNumber: "",
          departureAirport: "",
          departureAirportName: "",
          arrivalAirport: "",
          arrivalAirportName: "",
          departureDate: "",
          departureTime: "",
          arrivalDate: "",
          arrivalTime: "",
          notes: "",
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
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      departureAirportName: flight.departureAirportName,
      arrivalAirport: flight.arrivalAirport,
      arrivalAirportName: flight.arrivalAirportName,
      departureDate: flight.departureDate,
      departureTime: flight.departureTime,
      arrivalDate: flight.arrivalDate,
      arrivalTime: flight.arrivalTime,
      notes: flight.notes || "",
    })
    setShowAddDialog(true)
  }

  const handleDelete = (id: string) => {
    const flight = flights.find((f) => (f._id || f.id) === id)
    if (flight) {
      setDeleteConfirmation({
        show: true,
        flightId: id,
        flightInfo: `${flight.airline} ${flight.flightNumber}`,
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
              <div className="text-2xl font-bold">{new Set(flights.map((f) => f.departureAirport)).size}</div>
              <div className="text-sm text-muted-foreground">Departure Airports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{new Set(flights.map((f) => f.arrivalAirport)).size}</div>
              <div className="text-sm text-muted-foreground">Arrival Airports</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Flight
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Airline</th>
                    <th className="text-left p-3">Flight #</th>
                    <th className="text-left p-3">From</th>
                    <th className="text-left p-3">To</th>
                    <th className="text-left p-3">Departure</th>
                    <th className="text-left p-3">Arrival</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{flight.airline}</td>
                      <td className="p-3 font-mono">{flight.flightNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold">{flight.departureAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.departureAirportName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{flight.arrivalAirport}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrivalAirportName}</div>
                      </td>
                      <td className="p-3">
                        <div>{flight.departureDate}</div>
                        <div className="text-sm text-muted-foreground">{flight.departureTime}</div>
                      </td>
                      <td className="p-3">
                        <div>{flight.arrivalDate}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrivalTime}</div>
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
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No flights added yet. Click "Add Flight" to get started.
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
                flightNumber: "",
                departureAirport: "",
                departureAirportName: "",
                arrivalAirport: "",
                arrivalAirportName: "",
                departureDate: "",
                departureTime: "",
                arrivalDate: "",
                arrivalTime: "",
                notes: "",
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="airline">Airline *</Label>
                  <Input
                    id="airline"
                    value={formData.airline}
                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                    placeholder="e.g., British Airways"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="flightNumber">Flight Number *</Label>
                  <Input
                    id="flightNumber"
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    placeholder="e.g., BA123"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureAirport">Departure Airport Code *</Label>
                  <Input
                    id="departureAirport"
                    value={formData.departureAirport}
                    onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value.toUpperCase() })}
                    placeholder="e.g., LHR"
                    maxLength={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureAirportName">Departure Airport Name *</Label>
                  <Input
                    id="departureAirportName"
                    value={formData.departureAirportName}
                    onChange={(e) => setFormData({ ...formData, departureAirportName: e.target.value })}
                    placeholder="e.g., London Heathrow"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalAirport">Arrival Airport Code *</Label>
                  <Input
                    id="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value.toUpperCase() })}
                    placeholder="e.g., PFO"
                    maxLength={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalAirportName">Arrival Airport Name *</Label>
                  <Input
                    id="arrivalAirportName"
                    value={formData.arrivalAirportName}
                    onChange={(e) => setFormData({ ...formData, arrivalAirportName: e.target.value })}
                    placeholder="e.g., Paphos International"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
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
      </div>
    </div>
  )
}
