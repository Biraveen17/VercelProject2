"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft, HotelIcon, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"
import Image from "next/image"

interface Hotel {
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
  createdAt: string
  lastUpdated: string
}

export default function HotelsManagementPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; hotelId: string; hotelName: string }>({
    show: false,
    hotelId: "",
    hotelName: "",
  })
  const [migrating, setMigrating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    stars: 4,
    adultOnly: false,
    hasParking: true,
    distanceToVenue: "",
    avgPrice: "",
    website: "",
    bookingUrl: "",
    imageUrl: "",
  })

  const [errorMessage, setErrorMessage] = useState("")

  const loadHotels = async () => {
    try {
      const response = await fetch("/api/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(Array.isArray(data) ? data.map((h: any) => ({ ...h, id: h._id || h.id })) : [])
      } else {
        console.error("Failed to fetch hotels")
        setHotels([])
      }
    } catch (error) {
      console.error("Error loading hotels:", error)
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const migrateExistingHotels = async () => {
    setMigrating(true)
    try {
      const response = await fetch("/api/hotels/migrate", {
        method: "POST",
      })

      if (response.ok) {
        await loadHotels()
        alert("Hotels migrated successfully!")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to migrate hotels")
      }
    } catch (error) {
      console.error("Error migrating hotels:", error)
      alert("An error occurred while migrating hotels")
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await checkAuthentication()
      setAuthenticated(isAuth)
      if (isAuth) {
        loadHotels()
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.name.trim()) {
      setErrorMessage("Hotel name is required.")
      return
    }

    try {
      const url = editingHotel ? `/api/hotels/${editingHotel._id || editingHotel.id}` : "/api/hotels"
      const method = editingHotel ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadHotels()
        setShowAddDialog(false)
        setEditingHotel(null)
        setFormData({
          name: "",
          stars: 4,
          adultOnly: false,
          hasParking: true,
          distanceToVenue: "",
          avgPrice: "",
          website: "",
          bookingUrl: "",
          imageUrl: "",
        })
      } else {
        const error = await response.json()
        setErrorMessage(error.error || "Failed to save hotel. Please try again.")
      }
    } catch (error) {
      console.error("Error saving hotel:", error)
      setErrorMessage("An error occurred while saving the hotel.")
    }
  }

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      stars: hotel.stars,
      adultOnly: hotel.adultOnly,
      hasParking: hotel.hasParking,
      distanceToVenue: hotel.distanceToVenue,
      avgPrice: hotel.avgPrice,
      website: hotel.website,
      bookingUrl: hotel.bookingUrl,
      imageUrl: hotel.imageUrl,
    })
    setShowAddDialog(true)
  }

  const handleDelete = (id: string) => {
    const hotel = hotels.find((h) => (h._id || h.id) === id)
    if (hotel) {
      setDeleteConfirmation({
        show: true,
        hotelId: id,
        hotelName: hotel.name,
      })
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/hotels/${deleteConfirmation.hotelId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadHotels()
        setDeleteConfirmation({ show: false, hotelId: "", hotelName: "" })
      } else {
        console.error("Failed to delete hotel")
      }
    } catch (error) {
      console.error("Error deleting hotel:", error)
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
              <h1 className="text-3xl font-bold text-primary">Hotel Management</h1>
              <p className="text-muted-foreground">Manage hotels displayed on the travel page</p>
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
              <div className="text-2xl font-bold">{hotels.length}</div>
              <div className="text-sm text-muted-foreground">Total Hotels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{hotels.filter((h) => h.stars === 5).length}</div>
              <div className="text-sm text-muted-foreground">5-Star Hotels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{hotels.filter((h) => h.adultOnly).length}</div>
              <div className="text-sm text-muted-foreground">Adults Only</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </Button>
          {hotels.length === 0 && (
            <Button onClick={migrateExistingHotels} variant="outline" disabled={migrating}>
              <HotelIcon className="w-4 h-4 mr-2" />
              {migrating ? "Migrating..." : "Migrate Existing Hotels"}
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={hotel.imageUrl || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div>{hotel.adultOnly ? "Adults Only" : "Family Friendly"}</div>
                  <div>{hotel.hasParking ? "Parking Available" : "No Parking"}</div>
                  <div>{hotel.distanceToVenue} to venue</div>
                  <div className="font-semibold text-primary">{hotel.avgPrice} / night</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(hotel)} className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(hotel.id as string)}
                    className="flex-1 text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open)
            if (!open) {
              setEditingHotel(null)
              setFormData({
                name: "",
                stars: 4,
                adultOnly: false,
                hasParking: true,
                distanceToVenue: "",
                avgPrice: "",
                website: "",
                bookingUrl: "",
                imageUrl: "",
              })
              setErrorMessage("")
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHotel ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
              <DialogDescription>
                {editingHotel ? "Update hotel information" : "Add a new hotel to the travel page"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
              )}

              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter hotel name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stars">Star Rating *</Label>
                <Select
                  value={formData.stars.toString()}
                  onValueChange={(value) => setFormData({ ...formData, stars: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adultOnly"
                  checked={formData.adultOnly}
                  onCheckedChange={(checked) => setFormData({ ...formData, adultOnly: checked as boolean })}
                />
                <Label htmlFor="adultOnly" className="cursor-pointer">
                  Adults Only
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasParking"
                  checked={formData.hasParking}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasParking: checked as boolean })}
                />
                <Label htmlFor="hasParking" className="cursor-pointer">
                  Has Parking
                </Label>
              </div>

              <div>
                <Label htmlFor="distanceToVenue">Distance to Venue *</Label>
                <Input
                  id="distanceToVenue"
                  value={formData.distanceToVenue}
                  onChange={(e) => setFormData({ ...formData, distanceToVenue: e.target.value })}
                  placeholder="e.g., 8 km"
                  required
                />
              </div>

              <div>
                <Label htmlFor="avgPrice">Average Price (2 adults, late March 2026) *</Label>
                <Input
                  id="avgPrice"
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                  placeholder="e.g., €350"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website">Website URL *</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.hotel.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bookingUrl">Booking.com URL *</Label>
                <Input
                  id="bookingUrl"
                  type="url"
                  value={formData.bookingUrl}
                  onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                  placeholder="https://www.booking.com/hotel/..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a direct image URL or use the placeholder format
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingHotel ? "Update Hotel" : "Add Hotel"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false)
                    setEditingHotel(null)
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
          onOpenChange={(open) => !open && setDeleteConfirmation({ show: false, hotelId: "", hotelName: "" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{deleteConfirmation.hotelName}</strong>?
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ show: false, hotelId: "", hotelName: "" })}
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
