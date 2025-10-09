"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Users, Download, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

interface Group {
  _id?: string
  id?: string
  name: string
  createdAt: string
  lastUpdated: string
}

interface Guest {
  _id?: string
  id?: string
  name: string
  guestType: "defined" | "tbc"
  isChild: boolean
  ageGroup?: "under-4" | "4-12" | "over-12" // Made optional for children
  side: "bride" | "groom"
  groupId?: string | null
  notes?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  events: ("ceremony" | "reception")[]
  dietaryRequirements?: string
  questions?: string
  createdAt: string
  lastUpdated: string
  lockStatus?: "locked" | "unlocked"
  creationStatus?: "Original" | "New" | "Removed"
}

export default function GuestManagementPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [groups, setGroups] = useState<Group[]>([])
  const [guests, setGuests] = useState<Guest[]>([])

  const [showAddGuestDialog, setShowAddGuestDialog] = useState(false)
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; guestId: string; guestName: string }>({
    show: false,
    guestId: "",
    guestName: "",
  })
  const [deleteGroupConfirmation, setDeleteGroupConfirmation] = useState<{
    show: boolean
    groupId: string
    groupName: string
  }>({ show: false, groupId: "", groupName: "" })

  const [guestFormData, setGuestFormData] = useState({
    name: "",
    guestType: "defined" as "defined" | "tbc",
    isChild: false,
    ageGroup: "" as "" | "under-4" | "4-12" | "over-12", // Added age group to form data
    side: "bride" as "bride" | "groom",
    groupId: "",
    notes: "",
  })

  const [groupFormData, setGroupFormData] = useState({
    name: "",
  })

  const [errorMessage, setErrorMessage] = useState("")

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    side: "",
    rsvpStatus: "",
    ageGroup: "",
    hasNotes: "",
    hasQuestions: "",
    hasDietaryRequirements: "",
    lockStatus: "",
    createdDate: "",
    lastUpdatedDate: "",
    removed: "all", // Changed default from "no" to "all" to show removed guests by default
  })

  const loadData = async () => {
    try {
      const [groupsResponse, guestsResponse] = await Promise.all([fetch("/api/groups"), fetch("/api/guests")])

      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json()
        setGroups(Array.isArray(groupsData) ? groupsData.map((g: any) => ({ ...g, id: g._id || g.id })) : [])
      } else {
        console.error("Failed to fetch groups")
        setGroups([])
      }

      if (guestsResponse.ok) {
        const guestsData = await guestsResponse.json()
        setGuests(Array.isArray(guestsData) ? guestsData.map((g: any) => ({ ...g, id: g._id || g.id })) : [])
      } else {
        console.error("Failed to fetch guests")
        setGuests([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setGroups([])
      setGuests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await checkAuthentication()
      setAuthenticated(isAuth)
      if (isAuth) {
        loadData()
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const groupedGuests = useMemo(() => {
    const groupedData: { [key: string]: { group: Group; members: Guest[] } } = {}
    const ungrouped: Guest[] = []

    const filteredGuests = guests.filter((guest) => {
      if (filters.removed === "yes" && guest.creationStatus !== "Removed") return false
      if (filters.removed === "no" && guest.creationStatus === "Removed") return false
      // If filters.removed === "all", show all guests regardless of creation status

      if (filters.name && !guest.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      if (filters.type && filters.type !== "all" && guest.guestType !== filters.type) return false
      if (filters.side && filters.side !== "all" && guest.side !== filters.side) return false
      if (filters.rsvpStatus && filters.rsvpStatus !== "all" && guest.rsvpStatus !== filters.rsvpStatus) return false
      if (filters.ageGroup && filters.ageGroup !== "all" && guest.ageGroup !== filters.ageGroup) return false
      if (filters.hasNotes === "yes" && !guest.notes) return false
      if (filters.hasNotes === "no" && guest.notes) return false
      if (filters.hasQuestions === "yes" && !guest.questions) return false
      if (filters.hasQuestions === "no" && guest.questions) return false
      if (filters.hasDietaryRequirements === "yes" && !guest.dietaryRequirements) return false
      if (filters.hasDietaryRequirements === "no" && guest.dietaryRequirements) return false
      if (filters.lockStatus && filters.lockStatus !== "all") {
        const guestLockStatus = guest.lockStatus || "unlocked"
        if (guestLockStatus !== filters.lockStatus) return false
      }
      if (filters.createdDate) {
        const guestDate = new Date(guest.createdAt).toISOString().split("T")[0]
        if (guestDate !== filters.createdDate) return false
      }
      if (filters.lastUpdatedDate) {
        const guestDate = new Date(guest.lastUpdated).toISOString().split("T")[0]
        if (guestDate !== filters.lastUpdatedDate) return false
      }
      return true
    })

    filteredGuests.forEach((guest) => {
      if (guest.groupId) {
        const group = groups.find((g) => (g._id || g.id) === guest.groupId)
        if (group) {
          const groupKey = group._id || group.id || ""
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = { group, members: [] }
          }
          groupedData[groupKey].members.push(guest)
        } else {
          ungrouped.push(guest)
        }
      } else {
        ungrouped.push(guest)
      }
    })

    // Sort members within each group: defined first, then TBC, both by createdAt
    Object.values(groupedData).forEach((groupData) => {
      groupData.members.sort((a, b) => {
        // First sort by guest type (defined before TBC)
        if (a.guestType !== b.guestType) {
          return a.guestType === "defined" ? -1 : 1
        }
        // Then sort by creation date within the same type
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    })

    // Sort ungrouped guests the same way
    ungrouped.sort((a, b) => {
      if (a.guestType !== b.guestType) {
        return a.guestType === "defined" ? -1 : 1
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    return { groups: groupedData, ungrouped }
  }, [guests, groups, filters])

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Type",
      "Side",
      "Child",
      "Age Group",
      "RSVP Status",
      "Events",
      "Dietary Requirements",
      "Has Notes",
      "Has Questions",
      "Has Dietary Requirements",
      "Created",
      "Last Updated",
      "Group Name", // Added Group Name column header
      "Removed", // Add Removed header
    ]

    const rows = guests.map((guest) => {
      const groupName = guest.groupId ? groups.find((g) => (g._id || g.id) === guest.groupId)?.name || "" : ""

      return [
        guest.name,
        guest.guestType === "defined" ? "Defined" : "TBC",
        guest.side === "bride" ? "Bride" : "Groom",
        guest.isChild ? "Yes" : "No",
        guest.isChild && guest.ageGroup ? guest.ageGroup : "",
        guest.rsvpStatus,
        guest.events.join(", "),
        guest.dietaryRequirements || "",
        guest.notes ? "Yes" : "No",
        guest.questions ? "Yes" : "No",
        guest.dietaryRequirements ? "Yes" : "No",
        new Date(guest.createdAt).toLocaleString(),
        new Date(guest.lastUpdated).toLocaleString(),
        groupName, // Include group name in the row
        guest.removed ? "Yes" : "No", // Add Removed status
      ]
    })

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `wedding-guests-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddIndividualGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (guestFormData.guestType === "tbc") {
      if (!guestFormData.groupId || guestFormData.groupId === "none") {
        setErrorMessage("TBC guests must belong to a group. Please select a group.")
        return
      }
    }

    if (guestFormData.guestType === "defined" && !guestFormData.name.trim()) {
      setErrorMessage("Guest name is required for defined guests.")
      return
    }

    if (guestFormData.guestType === "defined" && guestFormData.name.trim()) {
      const isGuestNameDuplicate = guests.some(
        (g) => g.name.toLowerCase().trim() === guestFormData.name.trim().toLowerCase() && !g.removed,
      )
      const isGroupNameDuplicate = groups.some(
        (g) => g.name.toLowerCase().trim() === guestFormData.name.trim().toLowerCase(),
      )
      if (isGuestNameDuplicate || isGroupNameDuplicate) {
        setErrorMessage("A guest or group with this name already exists. Please use a different name.")
        return
      }
    }

    try {
      let guestName = guestFormData.name.trim()

      if (guestFormData.guestType === "tbc" && guestFormData.groupId) {
        const selectedGroup = groups.find((g) => (g._id || g.id) === guestFormData.groupId)
        if (selectedGroup) {
          const tbcGuestsInGroup = guests.filter(
            (g) => g.groupId === guestFormData.groupId && g.guestType === "tbc" && !g.removed,
          )
          const tbcCount = tbcGuestsInGroup.length + 1
          guestName = `${selectedGroup.name}-TBC-${tbcCount}`
        }
      }

      const guestData = {
        name: guestName,
        guestType: guestFormData.guestType,
        isChild: guestFormData.isChild,
        ageGroup: guestFormData.isChild && guestFormData.ageGroup ? guestFormData.ageGroup : undefined, // Include age group if child
        side: guestFormData.side,
        groupId: guestFormData.groupId && guestFormData.groupId !== "none" ? guestFormData.groupId : null,
        notes: guestFormData.notes || "",
        rsvpStatus: "pending" as const,
        events: [] as ("ceremony" | "reception")[],
        lockStatus: "unlocked" as const, // Default lock status to unlocked
        creationStatus: "Original" as const,
      }

      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      })

      if (response.ok) {
        await loadData()
        setShowAddGuestDialog(false)
        setGuestFormData({
          name: "",
          guestType: "defined",
          isChild: false,
          ageGroup: "", // Reset age group
          side: "bride",
          groupId: "",
          notes: "",
        })
      } else {
        const error = await response.json()
        setErrorMessage(error.error || "Failed to add guest. Please try again.")
      }
    } catch (error) {
      console.error("Error adding guest:", error)
      setErrorMessage("An error occurred while adding the guest.")
    }
  }

  const handleAddNewGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!groupFormData.name.trim()) {
      setErrorMessage("Group name is required.")
      return
    }

    const isGroupNameDuplicate = groups.some(
      (g) => g.name.toLowerCase().trim() === groupFormData.name.trim().toLowerCase(),
    )
    const isGuestNameDuplicate = guests.some(
      (g) => g.name.toLowerCase().trim() === groupFormData.name.trim().toLowerCase() && !g.removed,
    )
    if (isGroupNameDuplicate || isGuestNameDuplicate) {
      setErrorMessage("A guest or group with this name already exists. Please use a different name.")
      return
    }

    try {
      const groupData = {
        name: groupFormData.name.trim(),
      }

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      })

      if (response.ok) {
        await loadData()
        setShowAddGroupDialog(false)
        setGroupFormData({
          name: "",
        })
      } else {
        const error = await response.json()
        setErrorMessage(error.error || "Failed to add group. Please try again.")
      }
    } catch (error) {
      console.error("Error adding group:", error)
      setErrorMessage("An error occurred while adding the group.")
    }
  }

  const handleDeleteGuest = (id: string) => {
    const guest = guests.find((g) => (g._id || g.id) === id)
    if (guest) {
      setDeleteConfirmation({
        show: true,
        guestId: id,
        guestName: guest.name,
      })
    }
  }

  const confirmDeleteGuest = async () => {
    try {
      const response = await fetch(`/api/guests/${deleteConfirmation.guestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadData()
        setDeleteConfirmation({ show: false, guestId: "", guestName: "" })
      } else {
        console.error("Failed to delete guest")
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting guest:", error)
      // Optionally show an error message to the user
    }
  }

  const handleDeleteGroup = (group: Group) => {
    setDeleteGroupConfirmation({
      show: true,
      groupId: group._id || group.id || "",
      groupName: group.name,
    })
  }

  const confirmDeleteGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${deleteGroupConfirmation.groupId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadData()
        setDeleteGroupConfirmation({ show: false, groupId: "", groupName: "" })
      } else {
        console.error("Failed to delete group")
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting group:", error)
      // Optionally show an error message to the user
    }
  }

  const handleToggleLock = async (guest: Guest) => {
    try {
      const newLockStatus = guest.lockStatus === "locked" ? "unlocked" : "locked"
      const response = await fetch(`/api/guests/${guest._id || guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lockStatus: newLockStatus,
        }),
      })
      // </CHANGE>

      if (response.ok) {
        await loadData()
      } else {
        console.error("Failed to toggle lock status")
      }
    } catch (error) {
      console.error("Error toggling lock status:", error)
    }
  }

  const handleRemoveGuest = async (guest: Guest) => {
    try {
      const response = await fetch(`/api/guests/${guest._id || guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          removed: !guest.removed,
        }),
      })

      if (response.ok) {
        await loadData()
      } else {
        console.error("Failed to toggle removed status")
      }
    } catch (error) {
      console.error("Error toggling removed status:", error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  const totalGuests = guests.filter((g) => g.creationStatus !== "Removed").length
  const brideGuests = guests.filter((g) => g.side === "bride" && g.creationStatus !== "Removed").length
  const groomGuests = guests.filter((g) => g.side === "groom" && g.creationStatus !== "Removed").length

  const adults = guests.filter((g) => !g.isChild && g.creationStatus !== "Removed").length
  const children = guests.filter((g) => g.isChild && g.creationStatus !== "Removed").length
  const childrenUnder4 = guests.filter(
    (g) => g.isChild && g.ageGroup === "under-4" && g.creationStatus !== "Removed",
  ).length
  const children4to12 = guests.filter(
    (g) => g.isChild && g.ageGroup === "4-12" && g.creationStatus !== "Removed",
  ).length
  const childrenOver12 = guests.filter(
    (g) => g.isChild && g.ageGroup === "over-12" && g.creationStatus !== "Removed",
  ).length

  const tbcGuests = guests.filter((g) => g.guestType === "tbc" && g.creationStatus !== "Removed").length
  const tbcBride = guests.filter(
    (g) => g.guestType === "tbc" && g.side === "bride" && g.creationStatus !== "Removed",
  ).length
  const tbcGroom = guests.filter(
    (g) => g.guestType === "tbc" && g.side === "groom" && g.creationStatus !== "Removed",
  ).length
  const tbcAdults = guests.filter((g) => g.guestType === "tbc" && !g.isChild && g.creationStatus !== "Removed").length
  const tbcChildren = guests.filter((g) => g.guestType === "tbc" && g.isChild && g.creationStatus !== "Removed").length
  const tbcChildrenUnder4 = guests.filter(
    (g) => g.guestType === "tbc" && g.isChild && g.ageGroup === "under-4" && g.creationStatus !== "Removed",
  ).length
  const tbcChildren4to12 = guests.filter(
    (g) => g.guestType === "tbc" && g.isChild && g.ageGroup === "4-12" && g.creationStatus !== "Removed",
  ).length
  const tbcChildrenOver12 = guests.filter(
    (g) => g.guestType === "tbc" && g.isChild && g.ageGroup === "over-12" && g.creationStatus !== "Removed",
  ).length

  const attending = guests.filter((g) => g.rsvpStatus === "attending" && g.creationStatus !== "Removed").length
  const attendingBride = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.side === "bride" && g.creationStatus !== "Removed",
  ).length
  const attendingGroom = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.side === "groom" && g.creationStatus !== "Removed",
  ).length
  const attendingAdults = guests.filter(
    (g) => g.rsvpStatus === "attending" && !g.isChild && g.creationStatus !== "Removed",
  ).length
  const attendingChildren = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.isChild && g.creationStatus !== "Removed",
  ).length
  const attendingChildrenUnder4 = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.isChild && g.ageGroup === "under-4" && g.creationStatus !== "Removed",
  ).length
  const attendingChildren4to12 = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.isChild && g.ageGroup === "4-12" && g.creationStatus !== "Removed",
  ).length
  const attendingChildrenOver12 = guests.filter(
    (g) => g.rsvpStatus === "attending" && g.isChild && g.ageGroup === "over-12" && g.creationStatus !== "Removed",
  ).length

  const notAttending = guests.filter((g) => g.rsvpStatus === "not-attending" && g.creationStatus !== "Removed").length
  const notAttendingBride = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.side === "bride" && g.creationStatus !== "Removed",
  ).length
  const notAttendingGroom = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.side === "groom" && g.creationStatus !== "Removed",
  ).length
  const notAttendingAdults = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && !g.isChild && g.creationStatus !== "Removed",
  ).length
  const notAttendingChildren = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.isChild && g.creationStatus !== "Removed",
  ).length
  const notAttendingChildrenUnder4 = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.isChild && g.ageGroup === "under-4" && g.creationStatus !== "Removed",
  ).length
  const notAttendingChildren4to12 = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.isChild && g.ageGroup === "4-12" && g.creationStatus !== "Removed",
  ).length
  const notAttendingChildrenOver12 = guests.filter(
    (g) => g.rsvpStatus === "not-attending" && g.isChild && g.ageGroup === "over-12" && g.creationStatus !== "Removed",
  ).length

  const pending = guests.filter((g) => g.rsvpStatus === "pending" && g.creationStatus !== "Removed").length
  const pendingBride = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.side === "bride" && g.creationStatus !== "Removed",
  ).length
  const pendingGroom = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.side === "groom" && g.creationStatus !== "Removed",
  ).length
  const pendingAdults = guests.filter(
    (g) => g.rsvpStatus === "pending" && !g.isChild && g.creationStatus !== "Removed",
  ).length
  const pendingChildren = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.isChild && g.creationStatus !== "Removed",
  ).length
  const pendingChildrenUnder4 = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.isChild && g.ageGroup === "under-4" && g.creationStatus !== "Removed",
  ).length
  const pendingChildren4to12 = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.isChild && g.ageGroup === "4-12" && g.creationStatus !== "Removed",
  ).length
  const pendingChildrenOver12 = guests.filter(
    (g) => g.rsvpStatus === "pending" && g.isChild && g.ageGroup === "over-12" && g.creationStatus !== "Removed",
  ).length

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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Total Guests */}
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalGuests}</div>
              <div className="text-sm text-muted-foreground">Total Guests</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {brideGuests} | Groom: {groomGuests}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Adults: {adults} | Children: {children}
              </div>
              {children > 0 && (
                <div className="text-xs text-muted-foreground">
                  &lt;4: {childrenUnder4} | 4-12: {children4to12} | &gt;12: {childrenOver12}
                </div>
              )}
            </CardContent>
          </Card>

          {/* TBC Guests */}
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{tbcGuests}</div>
              <div className="text-sm text-muted-foreground">TBC Guests</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {tbcBride} | Groom: {tbcGroom}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Adults: {tbcAdults} | Children: {tbcChildren}
              </div>
              {tbcChildren > 0 && (
                <div className="text-xs text-muted-foreground">
                  &lt;4: {tbcChildrenUnder4} | 4-12: {tbcChildren4to12} | &gt;12: {tbcChildrenOver12}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attending */}
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{attending}</div>
              <div className="text-sm text-muted-foreground">Attending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {attendingBride} | Groom: {attendingGroom}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Adults: {attendingAdults} | Children: {attendingChildren}
              </div>
              {attendingChildren > 0 && (
                <div className="text-xs text-muted-foreground">
                  &lt;4: {attendingChildrenUnder4} | 4-12: {attendingChildren4to12} | &gt;12: {attendingChildrenOver12}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Not Attending */}
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{notAttending}</div>
              <div className="text-sm text-muted-foreground">Not Attending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {notAttendingBride} | Groom: {notAttendingGroom}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Adults: {notAttendingAdults} | Children: {notAttendingChildren}
              </div>
              {notAttendingChildren > 0 && (
                <div className="text-xs text-muted-foreground">
                  &lt;4: {notAttendingChildrenUnder4} | 4-12: {notAttendingChildren4to12} | &gt;12:{" "}
                  {notAttendingChildrenOver12}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending */}
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {pendingBride} | Groom: {pendingGroom}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Adults: {pendingAdults} | Children: {pendingChildren}
              </div>
              {pendingChildren > 0 && (
                <div className="text-xs text-muted-foreground">
                  &lt;4: {pendingChildrenUnder4} | 4-12: {pendingChildren4to12} | &gt;12: {pendingChildrenOver12}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={() => setShowAddGuestDialog(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
          <Button onClick={() => setShowAddGroupDialog(true)} variant="outline" className="w-full sm:w-auto">
            <Users className="w-4 h-4 mr-2" />
            Add Group
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Guest List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Name</span>
                        <Input
                          placeholder="Filter..."
                          value={filters.name}
                          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Type</span>
                        <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="defined">Defined</SelectItem>
                            <SelectItem value="tbc">TBC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Side</span>
                        <Select value={filters.side} onValueChange={(value) => setFilters({ ...filters, side: value })}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="bride">Bride</SelectItem>
                            <SelectItem value="groom">Groom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Age Group</span>
                        <Select
                          value={filters.ageGroup}
                          onValueChange={(value) => setFilters({ ...filters, ageGroup: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="under-4">&lt;4</SelectItem>
                            <SelectItem value="4-12">4-12</SelectItem>
                            <SelectItem value="over-12">&gt;12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>RSVP Status</span>
                        <Select
                          value={filters.rsvpStatus}
                          onValueChange={(value) => setFilters({ ...filters, rsvpStatus: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="attending">Attending</SelectItem>
                            <SelectItem value="not-attending">Not Attending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">Events</th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Notes</span>
                        <Select
                          value={filters.hasNotes}
                          onValueChange={(value) => setFilters({ ...filters, hasNotes: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Questions</span>
                        <Select
                          value={filters.hasQuestions}
                          onValueChange={(value) => setFilters({ ...filters, hasQuestions: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Dietary Req.</span>
                        <Select
                          value={filters.hasDietaryRequirements}
                          onValueChange={(value) => setFilters({ ...filters, hasDietaryRequirements: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    {/* Added table headers for Last Updated, Created, and Lock Status */}
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Last Updated UTC</span>
                        <Input
                          type="date"
                          value={filters.lastUpdatedDate}
                          onChange={(e) => setFilters({ ...filters, lastUpdatedDate: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Created UTC</span>
                        <Input
                          type="date"
                          value={filters.createdDate}
                          onChange={(e) => setFilters({ ...filters, createdDate: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Lock Status</span>
                        <Select
                          value={filters.lockStatus}
                          onValueChange={(value) => setFilters({ ...filters, lockStatus: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="locked">Locked</SelectItem>
                            <SelectItem value="unlocked">Unlocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">
                      <div className="flex flex-col gap-2">
                        <span>Creation Status</span>
                        <Select
                          value={filters.removed || "all"}
                          onValueChange={(value) => setFilters({ ...filters, removed: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Original">Original</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Removed">Removed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Individual Guests */}
                  {groupedGuests.ungrouped.length > 0 && (
                    <>
                      <tr className="bg-blue-100 dark:bg-blue-900/20">
                        {/* Adjusted colspan for new columns */}
                        <td colSpan={14} className="p-3 font-semibold text-blue-800 dark:text-blue-200">
                          Individual Guests ({groupedGuests.ungrouped.length})
                        </td>
                      </tr>
                      {groupedGuests.ungrouped.map((guest) => (
                        <tr key={guest.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            {guest.name}{" "}
                            {guest.guestType === "tbc" && (
                              <span className="text-xs text-blue-600 font-semibold">(TBC)</span>
                            )}
                            {guest.isChild && <span className="text-xs text-muted-foreground">(Child)</span>}
                            {guest.creationStatus === "Removed" && (
                              <span className="text-xs text-red-600 font-semibold">(Removed)</span>
                            )}
                          </td>
                          <td className="p-4">{guest.guestType === "defined" ? "Defined" : "TBC"}</td>
                          <td className="p-4">{guest.side === "bride" ? "Bride" : "Groom"}</td>
                          <td className="p-4">
                            {guest.isChild && guest.ageGroup
                              ? guest.ageGroup === "under-4"
                                ? "<4"
                                : guest.ageGroup === "4-12"
                                  ? "4-12"
                                  : ">12"
                              : "-"}
                          </td>
                          <td className="p-4">
                            <span
                              className={
                                guest.rsvpStatus === "attending"
                                  ? "text-green-600 font-medium"
                                  : guest.rsvpStatus === "not-attending"
                                    ? "text-red-600 font-medium"
                                    : "text-orange-600 font-medium"
                              }
                            >
                              {guest.rsvpStatus === "attending"
                                ? "Attending"
                                : guest.rsvpStatus === "not-attending"
                                  ? "Not attending"
                                  : "Pending"}
                            </span>
                          </td>
                          <td className="p-4">
                            {guest.events.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {guest.events.map((event) => (
                                  <span
                                    key={event}
                                    className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                                  >
                                    {event === "ceremony" ? "Wedding" : event === "reception" ? "Reception" : event}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4">{guest.notes ? "Yes" : "No"}</td>
                          <td className="p-4">{guest.questions ? "Yes" : "No"}</td>
                          <td className="p-4">{guest.dietaryRequirements ? "Yes" : "No"}</td>
                          <td className="p-4 text-xs">
                            {new Date(guest.lastUpdated).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-4 text-xs">
                            {new Date(guest.createdAt).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleLock(guest)}
                              className={
                                guest.lockStatus === "locked"
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {guest.lockStatus === "locked" ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                          <td className="p-4">
                            <Select
                              value={guest.creationStatus || "Original"}
                              onValueChange={async (value: "Original" | "New" | "Removed") => {
                                try {
                                  const response = await fetch(`/api/guests/${guest._id || guest.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ creationStatus: value }),
                                  })
                                  if (response.ok) {
                                    // Update local state immediately for better UX
                                    setGuests(
                                      guests.map((g) =>
                                        (g._id || g.id) === (guest._id || guest.id)
                                          ? { ...g, creationStatus: value, lastUpdated: new Date().toISOString() }
                                          : g,
                                      ),
                                    )
                                  }
                                } catch (error) {
                                  console.error("Error updating creation status:", error)
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Original">Original</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Removed">Removed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGuest(guest)}
                                className="hover:text-primary"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteGuest(guest.id as string)}
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

                  {/* Groups */}
                  {Object.entries(groupedGuests.groups).map(([groupId, { group, members }]) => (
                    <React.Fragment key={groupId}>
                      <tr className="bg-red-100 dark:bg-red-900/20">
                        <td className="p-3 font-semibold text-red-800 dark:text-red-200">GROUP: {group.name}</td>
                        <td className="p-3 text-red-800 dark:text-red-200">Group ({members.length})</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3 text-red-800 dark:text-red-200">-</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingGroup(group)
                                setGroupFormData({ name: group.name })
                              }}
                              className="hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteGroup(group)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 pl-8">
                            {member.name}{" "}
                            {member.guestType === "tbc" && (
                              <span className="text-xs text-blue-600 font-semibold">(TBC)</span>
                            )}
                            {member.isChild && <span className="text-xs text-muted-foreground">(Child)</span>}
                            {member.creationStatus === "Removed" && (
                              <span className="text-xs text-red-600 font-semibold">(Removed)</span>
                            )}
                          </td>
                          <td className="p-4">{member.guestType === "defined" ? "Defined" : "TBC"}</td>
                          <td className="p-4">{member.side === "bride" ? "Bride" : "Groom"}</td>
                          <td className="p-4">
                            {member.isChild && member.ageGroup
                              ? member.ageGroup === "under-4"
                                ? "<4"
                                : member.ageGroup === "4-12"
                                  ? "4-12"
                                  : ">12"
                              : "-"}
                          </td>
                          <td className="p-4">
                            <span
                              className={
                                member.rsvpStatus === "attending"
                                  ? "text-green-600 font-medium"
                                  : member.rsvpStatus === "not-attending"
                                    ? "text-red-600 font-medium"
                                    : "text-orange-600 font-medium"
                              }
                            >
                              {member.rsvpStatus === "attending"
                                ? "Attending"
                                : member.rsvpStatus === "not-attending"
                                  ? "Not attending"
                                  : "Pending"}
                            </span>
                          </td>
                          <td className="p-4">
                            {member.events.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {member.events.map((event) => (
                                  <span
                                    key={event}
                                    className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                                  >
                                    {event === "ceremony" ? "Wedding" : event === "reception" ? "Reception" : event}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4">{member.notes ? "Yes" : "No"}</td>
                          <td className="p-4">{member.questions ? "Yes" : "No"}</td>
                          <td className="p-4">{member.dietaryRequirements ? "Yes" : "No"}</td>
                          <td className="p-4 text-xs">
                            {new Date(member.lastUpdated).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-4 text-xs">
                            {new Date(member.createdAt).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleLock(member)}
                              className={
                                member.lockStatus === "locked"
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {member.lockStatus === "locked" ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                          <td className="p-4">
                            <Select
                              value={member.creationStatus || "Original"}
                              onValueChange={async (value: "Original" | "New" | "Removed") => {
                                try {
                                  const response = await fetch(`/api/guests/${member._id || member.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ creationStatus: value }),
                                  })
                                  if (response.ok) {
                                    await loadData()
                                  }
                                } catch (error) {
                                  console.error("Error updating creation status:", error)
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Original">Original</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Removed">Removed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGuest(member)}
                                className="hover:text-primary"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteGuest(member.id as string)}
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
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Guest Dialog */}
        <Dialog open={showAddGuestDialog} onOpenChange={setShowAddGuestDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Individual Guest</DialogTitle>
              <DialogDescription>
                Add a new guest to your wedding list. You can assign them to an existing group or keep them as an
                individual guest.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddIndividualGuest} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
              )}

              <div>
                <Label>Guest Type *</Label>
                <Select
                  value={guestFormData.guestType}
                  onValueChange={(value: "defined" | "tbc") => {
                    setGuestFormData({ ...guestFormData, guestType: value })
                    if (value === "tbc") {
                      setGuestFormData({ ...guestFormData, guestType: value, name: "" })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defined">Defined Guest (Known Name)</SelectItem>
                    <SelectItem value="tbc">TBC Guest (To Be Confirmed)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {guestFormData.guestType === "defined"
                    ? "A guest with a known name that you enter now"
                    : "A guest whose name will be filled in when they RSVP (must belong to a group)"}
                </p>
              </div>

              {guestFormData.guestType === "defined" && (
                <div>
                  <Label htmlFor="guestName">Guest Name *</Label>
                  <Input
                    id="guestName"
                    value={guestFormData.name}
                    onChange={(e) => setGuestFormData({ ...guestFormData, name: e.target.value })}
                    placeholder="Enter guest's full name"
                    required
                  />
                </div>
              )}

              {guestFormData.guestType === "tbc" && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                  <p className="text-sm">
                    TBC guests will have their name filled in when they complete the RSVP form. You must assign them to
                    a group.
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isChild"
                  checked={guestFormData.isChild}
                  onCheckedChange={(checked) =>
                    setGuestFormData({ ...guestFormData, isChild: checked as boolean, ageGroup: "" })
                  }
                />
                <Label htmlFor="isChild" className="cursor-pointer">
                  This guest is a child
                </Label>
              </div>

              {guestFormData.isChild && (
                <div>
                  <Label>Age Group (Optional)</Label>
                  <Select
                    value={guestFormData.ageGroup}
                    onValueChange={(value: "" | "under-4" | "4-12" | "over-12") =>
                      setGuestFormData({ ...guestFormData, ageGroup: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-4">Under 4 years</SelectItem>
                      <SelectItem value="4-12">4-12 years</SelectItem>
                      <SelectItem value="over-12">Over 12 years</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Optional: Select age group for better planning</p>
                </div>
              )}

              <div>
                <Label>Side *</Label>
                <Select
                  value={guestFormData.side}
                  onValueChange={(value: "bride" | "groom") => setGuestFormData({ ...guestFormData, side: value })}
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

              <div>
                <Label>Group {guestFormData.guestType === "tbc" ? "*" : "(Optional)"}</Label>
                <Select
                  value={guestFormData.groupId}
                  onValueChange={(value) => setGuestFormData({ ...guestFormData, groupId: value })}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        guestFormData.guestType === "tbc"
                          ? "Select a group (required)"
                          : "Select a group or leave as individual"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {guestFormData.guestType === "defined" && (
                      <SelectItem value="none">No Group (Individual)</SelectItem>
                    )}
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group._id || group.id || ""}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {guestFormData.guestType === "tbc" && (
                  <p className="text-xs text-red-600 mt-1">TBC guests must belong to a group</p>
                )}
              </div>

              <div>
                <Label htmlFor="guestNotes">Notes</Label>
                <Textarea
                  id="guestNotes"
                  value={guestFormData.notes}
                  onChange={(e) => setGuestFormData({ ...guestFormData, notes: e.target.value })}
                  placeholder="Any notes about this guest..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Guest</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddGuestDialog(false)
                    setErrorMessage("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Group Dialog */}
        <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Group</DialogTitle>
              <DialogDescription>
                Create a new group for families or parties. You can add individual guests to this group later.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNewGroup} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
              )}

              <div>
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  placeholder="Enter group or family name"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Group</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddGroupDialog(false)
                    setErrorMessage("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Guest Confirmation */}
        <Dialog
          open={deleteConfirmation.show}
          onOpenChange={(open) => !open && setDeleteConfirmation({ show: false, guestId: "", guestName: "" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The guest will be permanently removed from your list.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{deleteConfirmation.guestName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ show: false, guestId: "", guestName: "" })}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteGuest}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Group Confirmation */}
        <Dialog
          open={deleteGroupConfirmation.show}
          onOpenChange={(open) => !open && setDeleteGroupConfirmation({ show: false, groupId: "", groupName: "" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Group</DialogTitle>
              <DialogDescription>
                The group will be deleted but members will remain as individual guests.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete the group <strong>{deleteGroupConfirmation.groupName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This will only delete the group. Members will become individual guests.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteGroupConfirmation({ show: false, groupId: "", groupName: "" })}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteGroup}>
                Delete Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Guest Dialog */}
        <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Guest Details</DialogTitle>
              <DialogDescription>Update guest information, RSVP status, and event attendance.</DialogDescription>
            </DialogHeader>
            {editingGuest && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingGuest) return

                  setErrorMessage("")

                  try {
                    const response = await fetch(`/api/guests/${editingGuest._id || editingGuest.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: editingGuest.name,
                        guestType: editingGuest.guestType,
                        isChild: editingGuest.isChild,
                        ageGroup: editingGuest.isChild ? editingGuest.ageGroup : undefined,
                        side: editingGuest.side,
                        groupId: editingGuest.groupId,
                        notes: editingGuest.notes,
                        rsvpStatus: editingGuest.rsvpStatus,
                        events: editingGuest.events,
                        dietaryRequirements: editingGuest.dietaryRequirements,
                        questions: editingGuest.questions,
                        lockStatus: editingGuest.lockStatus,
                        creationStatus: editingGuest.creationStatus, // Include creation status in update
                      }),
                    })

                    if (response.ok) {
                      await loadData()
                      setEditingGuest(null)
                    } else {
                      const error = await response.json()
                      setErrorMessage(error.error || "Failed to update guest")
                    }
                  } catch (error) {
                    console.error("Error updating guest:", error)
                    setErrorMessage("An error occurred while updating the guest.")
                  }
                }}
                className="space-y-4"
              >
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
                )}
                <div>
                  <Label htmlFor="editGuestName">Guest Name</Label>
                  <Input
                    id="editGuestName"
                    value={editingGuest.name}
                    onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                    placeholder="Enter guest's full name"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsChild"
                    checked={editingGuest.isChild}
                    onCheckedChange={(checked) => setEditingGuest({ ...editingGuest, isChild: checked as boolean })}
                  />
                  <Label htmlFor="editIsChild" className="cursor-pointer">
                    This guest is a child
                  </Label>
                </div>

                {editingGuest.isChild && (
                  <div>
                    <Label>Age Group (Optional)</Label>
                    <Select
                      value={editingGuest.ageGroup || ""}
                      onValueChange={(value: "under-4" | "4-12" | "over-12") =>
                        setEditingGuest({ ...editingGuest, ageGroup: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-4">Under 4 years</SelectItem>
                        <SelectItem value="4-12">4-12 years</SelectItem>
                        <SelectItem value="over-12">Over 12 years</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Optional: Select age group for better planning</p>
                  </div>
                )}

                <div>
                  <Label>Side</Label>
                  <Select
                    value={editingGuest.side}
                    onValueChange={(value: "bride" | "groom") => setEditingGuest({ ...editingGuest, side: value })}
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

                <div>
                  <Label>RSVP Status</Label>
                  <Select
                    value={editingGuest.rsvpStatus}
                    onValueChange={(value: "pending" | "attending" | "not-attending") =>
                      setEditingGuest({ ...editingGuest, rsvpStatus: value })
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
                        checked={editingGuest.events.includes("ceremony")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingGuest({ ...editingGuest, events: [...editingGuest.events, "ceremony"] })
                          } else {
                            setEditingGuest({
                              ...editingGuest,
                              events: editingGuest.events.filter((e) => e !== "ceremony"),
                            })
                          }
                        }}
                        className="mr-2"
                      />
                      Wedding
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingGuest.events.includes("reception")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingGuest({ ...editingGuest, events: [...editingGuest.events, "reception"] })
                          } else {
                            setEditingGuest({
                              ...editingGuest,
                              events: editingGuest.events.filter((e) => e !== "reception"),
                            })
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
                    value={editingGuest.dietaryRequirements || ""}
                    onChange={(e) => setEditingGuest({ ...editingGuest, dietaryRequirements: e.target.value })}
                    placeholder="Any dietary requirements or allergies..."
                  />
                </div>

                <div>
                  <Label htmlFor="editQuestions">Questions/Comments</Label>
                  <Textarea
                    id="editQuestions"
                    value={editingGuest.questions || ""}
                    onChange={(e) => setEditingGuest({ ...editingGuest, questions: e.target.value })}
                    placeholder="Any questions or comments..."
                  />
                </div>

                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editingGuest.notes || ""}
                    onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
                    placeholder="Any special notes about this guest..."
                  />
                </div>

                <div>
                  <Label>Group</Label>
                  <Select
                    value={editingGuest.groupId || "none"}
                    onValueChange={(value) =>
                      setEditingGuest({ ...editingGuest, groupId: value === "none" ? null : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Group (Individual)</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group._id || group.id || ""}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Update Guest</Button>
                  <Button type="button" variant="outline" onClick={() => setEditingGuest(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Group Dialog */}
        <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Group Details</DialogTitle>
              <DialogDescription>Update the group name.</DialogDescription>
            </DialogHeader>
            {editingGroup && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingGroup) return

                  setErrorMessage("")

                  try {
                    const response = await fetch(`/api/groups/${editingGroup._id || editingGroup.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: groupFormData.name,
                      }),
                    })

                    if (response.ok) {
                      await loadData()
                      setEditingGroup(null)
                    } else {
                      const error = await response.json()
                      setErrorMessage(error.error || "Failed to update group")
                    }
                  } catch (error) {
                    console.error("Error updating group:", error)
                    setErrorMessage("An error occurred while updating the group.")
                  }
                }}
                className="space-y-4"
              >
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
                )}
                <div>
                  <Label htmlFor="editGroupName">Group Name *</Label>
                  <Input
                    id="editGroupName"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                    placeholder="Enter group or family name"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Update Group</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingGroup(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
