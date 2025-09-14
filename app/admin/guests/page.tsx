"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

type Guest = {
  id: string
  type: "individual" | "group"
  groupName: string
  guestName: string
  maxGroupSize: number
  groupMembers: string[]
  notes: string
  rsvpStatus: "pending" | "attending" | "not_attending"
  events: string[]
  dietaryRequirements: string
  questions: string
  side: "bride" | "groom" | "both"
  lastUpdated?: string
}

const loadGuests = async (
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    console.log("[v0] Loading guests from API...")
    const response = await fetch("/api/guests")
    if (!response.ok) {
      throw new Error(`Failed to fetch guests: ${response.statusText}`)
    }
    const result = await response.json()
    console.log("[v0] Guests loaded:", result.data?.length || 0)
    setGuests(result.data || [])
  } catch (error) {
    console.error("[v0] Error loading guests:", error)
    setGuests([])
  } finally {
    setLoading(false)
  }
}

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSide, setFilterSide] = useState<string>("all")
  const [filterRSVP, setFilterRSVP] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Checking authentication...")
      const isAuth = await checkAuthentication()
      console.log("[v0] Authentication result:", isAuth)
      setAuthenticated(isAuth)
      if (isAuth) {
        await loadGuests(setGuests, setLoading)
      } else {
        setLoading(false)
        router.push("/admin")
      }
    }
    checkAuth()
  }, [router])

  const handleAddGuest = async (guestData: Omit<Guest, "id" | "lastUpdated">) => {
    try {
      console.log("[v0] Adding guest:", guestData)
      const newGuest = {
        ...guestData,
        id: Date.now().toString(),
      }

      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGuest),
      })

      if (!response.ok) {
        throw new Error(`Failed to add guest: ${response.statusText}`)
      }

      console.log("[v0] Guest added successfully")
      await loadGuests(setGuests, setLoading)
      setShowAddDialog(false)
    } catch (error) {
      console.error("[v0] Error adding guest:", error)
      alert("Failed to add guest. Please try again.")
    }
  }

  const handleUpdateGuest = async (guestData: Guest) => {
    try {
      console.log("[v0] Updating guest:", guestData.id)
      const response = await fetch(`/api/guests/${guestData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update guest: ${response.statusText}`)
      }

      console.log("[v0] Guest updated successfully")
      await loadGuests(setGuests, setLoading)
      setEditingGuest(null)
    } catch (error) {
      console.error("[v0] Error updating guest:", error)
      alert("Failed to update guest. Please try again.")
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return

    try {
      console.log("[v0] Deleting guest:", guestId)
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete guest: ${response.statusText}`)
      }

      console.log("[v0] Guest deleted successfully")
      await loadGuests(setGuests, setLoading)
    } catch (error) {
      console.error("[v0] Error deleting guest:", error)
      alert("Failed to delete guest. Please try again.")
    }
  }

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.groupName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSide = filterSide === "all" || guest.side === filterSide
      const matchesRSVP = filterRSVP === "all" || guest.rsvpStatus === filterRSVP
      const matchesType = filterType === "all" || guest.type === filterType

      return matchesSearch && matchesSide && matchesRSVP && matchesType
    })
  }, [guests, searchTerm, filterSide, filterRSVP, filterType])

  const stats = useMemo(() => {
    const totalGuests = guests.length
    const attending = guests.filter((g) => g.rsvpStatus === "attending").length
    const notAttending = guests.filter((g) => g.rsvpStatus === "not_attending").length
    const pending = guests.filter((g) => g.rsvpStatus === "pending").length
    const brideGuests = guests.filter((g) => g.side === "bride").length
    const groomGuests = guests.filter((g) => g.side === "groom").length
    const bothGuests = guests.filter((g) => g.side === "both").length

    return {
      totalGuests,
      attending,
      notAttending,
      pending,
      brideGuests,
      groomGuests,
      bothGuests,
    }
  }, [guests])

  if (loading) {
    return (
      <div className="min-h-screen floral-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading guest management...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen floral-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Please log in to access guest management.</p>
          <Button asChild className="mt-4">
            <Link href="/admin">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Guest Management</h1>
              <p className="text-muted-foreground">Manage your wedding guest list and RSVPs</p>
            </div>
          </div>
          <Button onClick={() => logout()} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Not Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.notAttending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input placeholder="Search guests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sides</SelectItem>
                <SelectItem value="bride">Bride</SelectItem>
                <SelectItem value="groom">Groom</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRSVP} onValueChange={setFilterRSVP}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVP</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="not_attending">Not Attending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Guest List */}
        <div className="grid gap-4">
          {filteredGuests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No guests found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredGuests.map((guest) => (
              <Card key={guest.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{guest.guestName}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            guest.rsvpStatus === "attending"
                              ? "bg-green-100 text-green-800"
                              : guest.rsvpStatus === "not_attending"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {guest.rsvpStatus.replace("_", " ").toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {guest.side.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {guest.type.toUpperCase()}
                        </span>
                      </div>
                      {guest.type === "group" && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Group: {guest.groupName} (Max: {guest.maxGroupSize})
                        </p>
                      )}
                      {guest.groupMembers.length > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">Members: {guest.groupMembers.join(", ")}</p>
                      )}
                      {guest.events.length > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">Events: {guest.events.join(", ")}</p>
                      )}
                      {guest.dietaryRequirements && (
                        <p className="text-sm text-muted-foreground mb-1">Dietary: {guest.dietaryRequirements}</p>
                      )}
                      {guest.notes && <p className="text-sm text-muted-foreground">Notes: {guest.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingGuest(guest)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteGuest(guest.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Guest Dialog */}
        <GuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddGuest}
          title="Add New Guest"
        />

        {/* Edit Guest Dialog */}
        {editingGuest && (
          <GuestDialog
            open={!!editingGuest}
            onOpenChange={(open) => !open && setEditingGuest(null)}
            onSubmit={handleUpdateGuest}
            initialData={editingGuest}
            title="Edit Guest"
          />
        )}
      </div>
    </div>
  )
}

function GuestDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: Guest
  title: string
}) {
  const [formData, setFormData] = useState({
    type: "individual" as "individual" | "group",
    groupName: "",
    guestName: "",
    maxGroupSize: 1,
    groupMembers: [] as string[],
    notes: "",
    rsvpStatus: "pending" as "pending" | "attending" | "not_attending",
    events: [] as string[],
    dietaryRequirements: "",
    questions: "",
    side: "bride" as "bride" | "groom" | "both",
  })

  const [groupMemberInput, setGroupMemberInput] = useState("")
  const [eventInput, setEventInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        groupName: initialData.groupName,
        guestName: initialData.guestName,
        maxGroupSize: initialData.maxGroupSize,
        groupMembers: [...initialData.groupMembers],
        notes: initialData.notes,
        rsvpStatus: initialData.rsvpStatus,
        events: [...initialData.events],
        dietaryRequirements: initialData.dietaryRequirements,
        questions: initialData.questions,
        side: initialData.side,
      })
    } else {
      setFormData({
        type: "individual",
        groupName: "",
        guestName: "",
        maxGroupSize: 1,
        groupMembers: [],
        notes: "",
        rsvpStatus: "pending",
        events: [],
        dietaryRequirements: "",
        questions: "",
        side: "bride",
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  const addGroupMember = () => {
    if (groupMemberInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        groupMembers: [...prev.groupMembers, groupMemberInput.trim()],
      }))
      setGroupMemberInput("")
    }
  }

  const removeGroupMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((_, i) => i !== index),
    }))
  }

  const addEvent = () => {
    if (eventInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        events: [...prev.events, eventInput.trim()],
      }))
      setEventInput("")
    }
  }

  const removeEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "individual" | "group") => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="side">Side</Label>
              <Select
                value={formData.side}
                onValueChange={(value: "bride" | "groom" | "both") => setFormData((prev) => ({ ...prev, side: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData((prev) => ({ ...prev, guestName: e.target.value }))}
              required
            />
          </div>

          {formData.type === "group" && (
            <>
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxGroupSize">Max Group Size</Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  min="1"
                  value={formData.maxGroupSize}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, maxGroupSize: Number.parseInt(e.target.value) || 1 }))
                  }
                />
              </div>
              <div>
                <Label>Group Members</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={groupMemberInput}
                    onChange={(e) => setGroupMemberInput(e.target.value)}
                    placeholder="Add group member"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGroupMember())}
                  />
                  <Button type="button" onClick={addGroupMember}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.groupMembers.map((member, index) => (
                    <span key={index} className="bg-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {member}
                      <button
                        type="button"
                        onClick={() => removeGroupMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="rsvpStatus">RSVP Status</Label>
            <Select
              value={formData.rsvpStatus}
              onValueChange={(value: "pending" | "attending" | "not_attending") =>
                setFormData((prev) => ({ ...prev, rsvpStatus: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="not_attending">Not Attending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Events</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="Add event"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEvent())}
              />
              <Button type="button" onClick={addEvent}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.events.map((event, index) => (
                <span key={index} className="bg-secondary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {event}
                  <button type="button" onClick={() => removeEvent(index)} className="text-red-500 hover:text-red-700">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
            <Input
              id="dietaryRequirements"
              value={formData.dietaryRequirements}
              onChange={(e) => setFormData((prev) => ({ ...prev, dietaryRequirements: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="questions">Questions/Special Requests</Label>
            <Textarea
              id="questions"
              value={formData.questions}
              onChange={(e) => setFormData((prev) => ({ ...prev, questions: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"} Guest</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
