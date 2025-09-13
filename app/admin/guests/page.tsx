"use client"

import React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { isAuthenticated, logout } from "@/lib/auth"
import {
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  checkDuplicateGuest,
  addGuestToGroup,
  type Guest,
} from "@/lib/database"
import { Plus, Edit, Trash2, Download, Filter, ArrowUpDown, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GuestManagementPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [guests, setGuests] = useState<Guest[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [sortField, setSortField] = useState<keyof Guest>("lastUpdated")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filters, setFilters] = useState({
    rsvpStatus: "",
    events: "",
    groupName: "",
    side: "",
  })

  const [formData, setFormData] = useState({
    type: "individual" as "individual" | "group",
    guestName: "",
    groupName: "",
    maxGroupSize: 1,
    groupMembers: [""],
    notes: "",
    rsvpStatus: "pending" as "pending" | "attending" | "not-attending",
    events: [] as string[],
    dietaryRequirements: "",
    questions: "",
    side: "bride" as "bride" | "groom",
  })

  const [addToGroupData, setAddToGroupData] = useState({
    selectedGroup: "",
    newGuestName: "",
  })

  const [showAddToGroupDialog, setShowAddToGroupDialog] = useState(false)

  const handleDeleteGuest = (id: string) => {
    deleteGuest(id)
    loadGuests()
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    setAuthenticated(true)
    loadGuests()
    setLoading(false)
  }, [router])

  const loadGuests = () => {
    setGuests(getGuests())
  }

  const handleSort = (field: keyof Guest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedGuests = useMemo(() => {
    const filtered = guests.filter((guest) => {
      if (filters.rsvpStatus && guest.rsvpStatus !== filters.rsvpStatus) return false
      if (filters.events && !guest.events.includes(filters.events as "ceremony" | "reception")) return false
      if (filters.groupName && !guest.groupName?.toLowerCase().includes(filters.groupName.toLowerCase())) return false
      if (filters.side && guest.side !== filters.side) return false
      return true
    })

    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === "asc" ? 1 : -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }
      return 0
    })
  }, [guests, filters, sortField, sortDirection])

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault()

    const nameToCheck = formData.type === "individual" ? formData.guestName : formData.groupName
    if (checkDuplicateGuest(nameToCheck, formData.type === "group" ? formData.groupName : undefined)) {
      alert("A guest with this name already exists. Please use a different name.")
      return
    }

    const guestData = {
      type: formData.type,
      guestName: formData.type === "individual" ? formData.guestName : undefined,
      groupName: formData.type === "group" ? formData.groupName : undefined,
      maxGroupSize: formData.type === "group" ? formData.maxGroupSize : undefined,
      groupMembers: formData.type === "group" ? formData.groupMembers.filter((m) => m.trim()) : undefined,
      notes: formData.notes || undefined,
      rsvpStatus: "pending" as const,
      events: [] as ("ceremony" | "reception")[],
      dietaryRequirements: formData.dietaryRequirements || undefined,
      questions: formData.questions || undefined,
      side: formData.side,
    }

    addGuest(guestData)
    loadGuests()
    setShowAddDialog(false)
    resetForm()
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      type: guest.type,
      guestName: guest.guestName || "",
      groupName: guest.groupName || "",
      maxGroupSize: guest.maxGroupSize || 1,
      groupMembers: guest.groupMembers || [""],
      notes: guest.notes || "",
      rsvpStatus: guest.rsvpStatus,
      events: guest.events || [],
      dietaryRequirements: guest.dietaryRequirements || "",
      questions: guest.questions || "",
      side: guest.side || "bride",
    })
  }

  const handleUpdateGuest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGuest) return

    const nameToCheck = formData.type === "individual" ? formData.guestName : formData.groupName
    if (checkDuplicateGuest(nameToCheck, formData.type === "group" ? formData.groupName : undefined, editingGuest.id)) {
      alert("A guest with this name already exists. Please use a different name.")
      return
    }

    const updates = {
      type: formData.type,
      guestName: formData.type === "individual" ? formData.guestName : undefined,
      groupName: formData.type === "group" ? formData.groupName : undefined,
      maxGroupSize: formData.type === "group" ? formData.maxGroupSize : undefined,
      groupMembers: formData.type === "group" ? formData.groupMembers.filter((m) => m.trim()) : undefined,
      notes: formData.notes || undefined,
      rsvpStatus: formData.rsvpStatus,
      events: formData.events as ("ceremony" | "reception")[],
      dietaryRequirements: formData.dietaryRequirements || undefined,
      questions: formData.questions || undefined,
      side: formData.side,
    }

    updateGuest(editingGuest.id, updates)
    loadGuests()
    setEditingGuest(null)
    resetForm()
  }

  const handleAddToGroup = (e: React.FormEvent) => {
    e.preventDefault()

    if (checkDuplicateGuest(addToGroupData.newGuestName)) {
      alert("A guest with this name already exists. Please use a different name.")
      return
    }

    const success = addGuestToGroup(addToGroupData.selectedGroup, addToGroupData.newGuestName)
    if (success) {
      loadGuests()
      setShowAddToGroupDialog(false)
      setAddToGroupData({ selectedGroup: "", newGuestName: "" })
    } else {
      alert("Could not add guest to group. The group may be full or not found.")
    }
  }

  const resetForm = () => {
    setFormData({
      type: "individual",
      guestName: "",
      groupName: "",
      maxGroupSize: 1,
      groupMembers: [""],
      notes: "",
      rsvpStatus: "pending",
      events: [],
      dietaryRequirements: "",
      questions: "",
      side: "bride",
    })
  }

  const exportToCSV = () => {
    const headers = [
      "Group Name",
      "Guest Name",
      "Max Group Size",
      "RSVP Status",
      "Events",
      "Dietary Requirements",
      "Questions",
      "Last Updated",
      "Side",
    ]

    const csvData = filteredAndSortedGuests.map((guest) => [
      guest.groupName || "",
      guest.guestName || "",
      guest.maxGroupSize || "",
      guest.rsvpStatus,
      guest.events.join(", "),
      guest.dietaryRequirements || "",
      guest.questions || "",
      new Date(guest.lastUpdated).toLocaleString(),
      guest.side || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wedding-guests.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const groupedGuests = useMemo(() => {
    const groups: { [key: string]: Guest[] } = {}
    const ungrouped: Guest[] = []

    filteredAndSortedGuests.forEach((guest) => {
      if (guest.groupName) {
        if (!groups[guest.groupName]) {
          groups[guest.groupName] = []
        }
        groups[guest.groupName].push(guest)
      } else {
        ungrouped.push(guest)
      }
    })

    return { groups, ungrouped }
  }, [filteredAndSortedGuests])

  const getActualGroupSize = (groupName: string): number => {
    const allGuests = getGuests()
    return allGuests.filter((g) => g.groupName === groupName).length
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attending":
        return <Badge className="bg-green-100 text-green-800">Attending</Badge>
      case "not-attending":
        return <Badge className="bg-red-100 text-red-800">Not Attending</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {guests.reduce((total, guest) => {
                  if (guest.type === "group" && guest.rsvpStatus === "pending" && guest.maxGroupSize) {
                    return total + guest.maxGroupSize
                  }
                  return total + 1
                }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total RSVP Count</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {guests.reduce((total, guest) => {
                  if (guest.rsvpStatus === "attending") {
                    if (guest.type === "group" && guest.groupMembers) {
                      return total + guest.groupMembers.filter((member) => member.trim()).length
                    }
                    return total + 1
                  }
                  return total
                }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Attending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {guests.filter((g) => g.rsvpStatus === "not-attending").length}
              </div>
              <div className="text-sm text-muted-foreground">Not Attending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {guests.reduce((total, guest) => {
                  if (guest.rsvpStatus === "pending") {
                    if (guest.type === "group" && guest.maxGroupSize) {
                      return total + guest.maxGroupSize
                    }
                    return total + 1
                  }
                  return total
                }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <Label>Guest Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "individual" | "group") => {
                      setFormData({ ...formData, type: value })
                      if (value === "individual") {
                        setFormData((prev) => ({ ...prev, maxGroupSize: 1, groupMembers: [""] }))
                      }
                    }}
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
                  <Label>Side</Label>
                  <Select
                    value={formData.side}
                    onValueChange={(value: "bride" | "groom") => setFormData({ ...formData, side: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bride">Bride Side</SelectItem>
                      <SelectItem value="groom">Groom Side</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "individual" ? (
                  <div>
                    <Label htmlFor="guestName">Guest Name</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="Enter guest's full name"
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input
                        id="groupName"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                        placeholder="Enter group or family name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxGroupSize">Maximum Group Size</Label>
                      <Input
                        id="maxGroupSize"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.maxGroupSize || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === "") {
                            setFormData({
                              ...formData,
                              maxGroupSize: 0,
                              groupMembers: [],
                            })
                          } else {
                            const size = Number.parseInt(value)
                            setFormData({
                              ...formData,
                              maxGroupSize: size,
                              groupMembers: Array(size).fill(""),
                            })
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            e.currentTarget.selectionStart === 1 &&
                            e.currentTarget.selectionEnd === 1
                          ) {
                            e.preventDefault()
                            setFormData({
                              ...formData,
                              maxGroupSize: 0,
                              groupMembers: [],
                            })
                          }
                        }}
                        placeholder="Enter maximum number of people"
                        required
                      />
                    </div>
                    <div>
                      <Label>Group Member Names (Optional)</Label>
                      <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                        {formData.groupMembers.map((member, index) => (
                          <Input
                            key={index}
                            value={member}
                            onChange={(e) => {
                              const newMembers = [...formData.groupMembers]
                              newMembers[index] = e.target.value
                              setFormData({ ...formData, groupMembers: newMembers })
                            }}
                            placeholder={`Member ${index + 1} full name`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special notes about this guest..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Add Guest</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>RSVP Status</Label>
                <Select
                  value={filters.rsvpStatus}
                  onValueChange={(value) => setFilters({ ...filters, rsvpStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="not-attending">Not Attending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Events</Label>
                <Select value={filters.events} onValueChange={(value) => setFilters({ ...filters, events: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All events</SelectItem>
                    <SelectItem value="ceremony">Ceremony</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Group Name</Label>
                <Input
                  value={filters.groupName}
                  onChange={(e) => setFilters({ ...filters, groupName: e.target.value })}
                  placeholder="Search group names..."
                />
              </div>
              <div>
                <Label>Side</Label>
                <Select value={filters.side} onValueChange={(value) => setFilters({ ...filters, side: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sides" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sides</SelectItem>
                    <SelectItem value="bride">Bride Side</SelectItem>
                    <SelectItem value="groom">Groom Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("groupName")}
                        className="font-semibold"
                      >
                        Group Name
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("guestName")}
                        className="font-semibold"
                      >
                        Guest Name
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">Max Group Size</th>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("rsvpStatus")}
                        className="font-semibold"
                      >
                        RSVP Status
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">Events</th>
                    <th className="p-4 text-left">Dietary Requirements</th>
                    <th className="p-4 text-left">Questions</th>
                    <th className="p-4 text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("lastUpdated")}
                        className="font-semibold"
                      >
                        Last Updated
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">Side</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedGuests.groups).map(([groupName, guests]) => (
                    <React.Fragment key={groupName}>
                      {/* Group header row */}
                      <tr className="bg-primary/5 border-b-2 border-primary/20">
                        <td colSpan={10} className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span className="font-semibold text-primary">
                              Group: {groupName} ({getActualGroupSize(groupName)} guests)
                            </span>
                          </div>
                        </td>
                      </tr>
                      {/* Group members */}
                      {guests.map((guest, index) => (
                        <tr key={guest.id} className="border-b hover:bg-muted/50 bg-primary/2">
                          <td className="p-4 pl-8">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                              {guest.groupName}
                            </div>
                          </td>
                          <td className="p-4">{guest.guestName || "-"}</td>
                          <td className="p-4">{guest.maxGroupSize || "-"}</td>
                          <td className="p-4">{getStatusBadge(guest.rsvpStatus)}</td>
                          <td className="p-4">
                            {guest.events.length > 0 ? (
                              <div className="flex gap-1">
                                {guest.events.map((event) => (
                                  <Badge key={event} variant="outline" className="text-xs">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="truncate" title={guest.dietaryRequirements}>
                              {guest.dietaryRequirements || "-"}
                            </div>
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="truncate" title={guest.questions}>
                              {guest.questions || "-"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(guest.lastUpdated).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{guest.side || "-"}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditGuest(guest)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {groupedGuests.ungrouped.length > 0 && (
                    <>
                      <tr className="bg-secondary/5 border-b-2 border-secondary/20">
                        <td colSpan={10} className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-secondary rounded-full"></div>
                            <span className="font-semibold text-secondary">
                              Individual ({groupedGuests.ungrouped.length} guests)
                            </span>
                          </div>
                        </td>
                      </tr>
                      {groupedGuests.ungrouped.map((guest) => (
                        <tr key={guest.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">{guest.groupName || "-"}</td>
                          <td className="p-4">{guest.guestName || "-"}</td>
                          <td className="p-4">{guest.maxGroupSize || "-"}</td>
                          <td className="p-4">{getStatusBadge(guest.rsvpStatus)}</td>
                          <td className="p-4">
                            {guest.events.length > 0 ? (
                              <div className="flex gap-1">
                                {guest.events.map((event) => (
                                  <Badge key={event} variant="outline" className="text-xs">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="truncate" title={guest.dietaryRequirements}>
                              {guest.dietaryRequirements || "-"}
                            </div>
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="truncate" title={guest.questions}>
                              {guest.questions || "-"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(guest.lastUpdated).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{guest.side || "-"}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditGuest(guest)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateGuest} className="space-y-4">
              <div>
                <Label>Guest Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "individual" | "group") => {
                    setFormData({ ...formData, type: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    {Object.keys(groupedGuests.groups).map((groupName) => (
                      <SelectItem key={groupName} value={groupName}>
                        {groupName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Side</Label>
                <Select
                  value={formData.side}
                  onValueChange={(value: "bride" | "groom") => setFormData({ ...formData, side: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride Side</SelectItem>
                    <SelectItem value="groom">Groom Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "individual" ? (
                <div>
                  <Label htmlFor="editGuestName">Guest Name</Label>
                  <Input
                    id="editGuestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Enter guest's full name"
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="editGroupName">Group Name</Label>
                    <Input
                      id="editGroupName"
                      value={formData.groupName}
                      onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                      placeholder="Enter group or family name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editMaxGroupSize">Maximum Group Size</Label>
                    <Input
                      id="editMaxGroupSize"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxGroupSize || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "") {
                          setFormData({
                            ...formData,
                            maxGroupSize: 0,
                            groupMembers: [],
                          })
                        } else {
                          const size = Number.parseInt(value)
                          setFormData({
                            ...formData,
                            maxGroupSize: size,
                            groupMembers: Array(size)
                              .fill("")
                              .map((_, i) => formData.groupMembers[i] || ""),
                          })
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          e.currentTarget.selectionStart === 1 &&
                          e.currentTarget.selectionEnd === 1
                        ) {
                          e.preventDefault()
                          setFormData({
                            ...formData,
                            maxGroupSize: 0,
                            groupMembers: [],
                          })
                        }
                      }}
                      placeholder="Enter maximum number of people"
                      required
                    />
                  </div>
                  <div>
                    <Label>Group Member Names (Optional)</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                      {formData.groupMembers.map((member, index) => (
                        <Input
                          key={index}
                          value={member}
                          onChange={(e) => {
                            const newMembers = [...formData.groupMembers]
                            newMembers[index] = e.target.value
                            setFormData({ ...formData, groupMembers: newMembers })
                          }}
                          placeholder={`Member ${index + 1} full name`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label>RSVP Status</Label>
                <Select
                  value={formData.rsvpStatus}
                  onValueChange={(value: "pending" | "attending" | "not-attending") =>
                    setFormData({ ...formData, rsvpStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="not-attending">Not Attending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Events Attending</Label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.events.includes("ceremony")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, events: [...formData.events, "ceremony"] })
                        } else {
                          setFormData({ ...formData, events: formData.events.filter((e) => e !== "ceremony") })
                        }
                      }}
                      className="mr-2"
                    />
                    Ceremony
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.events.includes("reception")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, events: [...formData.events, "reception"] })
                        } else {
                          setFormData({ ...formData, events: formData.events.filter((e) => e !== "reception") })
                        }
                      }}
                      className="mr-2"
                    />
                    Reception
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="editDietary">Dietary Requirements</Label>
                <Textarea
                  id="editDietary"
                  value={formData.dietaryRequirements}
                  onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                  placeholder="Any dietary requirements or allergies..."
                />
              </div>

              <div>
                <Label htmlFor="editQuestions">Questions/Comments</Label>
                <Textarea
                  id="editQuestions"
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  placeholder="Any questions or comments..."
                />
              </div>

              <div>
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special notes about this guest..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update Guest</Button>
                <Button type="button" variant="outline" onClick={() => setEditingGuest(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add to Group Dialog */}
        <Dialog open={showAddToGroupDialog} onOpenChange={setShowAddToGroupDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add to Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Guest to Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddToGroup} className="space-y-4">
              <div>
                <Label htmlFor="selectedGroup">Select Group</Label>
                <Select
                  value={addToGroupData.selectedGroup}
                  onValueChange={(value) => setAddToGroupData({ ...addToGroupData, selectedGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(groupedGuests.groups).map((groupName) => (
                      <SelectItem key={groupName} value={groupName}>
                        {groupName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="newGuestName">New Guest Name</Label>
                <Input
                  id="newGuestName"
                  value={addToGroupData.newGuestName}
                  onChange={(e) => setAddToGroupData({ ...addToGroupData, newGuestName: e.target.value })}
                  placeholder="Enter new guest's full name"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add to Group</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddToGroupDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
