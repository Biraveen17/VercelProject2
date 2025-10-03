"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { logout } from "@/lib/auth"
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

interface Group {
  _id?: string
  id?: string
  name: string
  size: number
  side: "bride" | "groom"
  createdAt: string
  lastUpdated: string
}

interface Guest {
  _id?: string
  id?: string
  name: string
  isChild: boolean
  side: "bride" | "groom"
  groupId?: string | null
  notes?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  events: ("ceremony" | "reception")[]
  dietaryRequirements?: string
  questions?: string
  createdAt: string
  lastUpdated: string
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
    isChild: false,
    side: "bride" as "bride" | "groom",
    groupId: "",
    notes: "",
  })

  const [groupFormData, setGroupFormData] = useState({
    name: "",
    size: 1,
    side: "bride" as "bride" | "groom",
  })

  const [errorMessage, setErrorMessage] = useState("")

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

    guests.forEach((guest) => {
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

    return { groups: groupedData, ungrouped }
  }, [guests, groups])

  const handleAddIndividualGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!guestFormData.name.trim()) {
      setErrorMessage("Guest name is required.")
      return
    }

    const isGuestNameDuplicate = guests.some(
      (g) => g.name.toLowerCase().trim() === guestFormData.name.trim().toLowerCase(),
    )
    const isGroupNameDuplicate = groups.some(
      (g) => g.name.toLowerCase().trim() === guestFormData.name.trim().toLowerCase(),
    )
    if (isGuestNameDuplicate || isGroupNameDuplicate) {
      setErrorMessage("A guest or group with this name already exists. Please use a different name.")
      return
    }

    try {
      const guestData = {
        name: guestFormData.name.trim(),
        isChild: guestFormData.isChild,
        side: guestFormData.side,
        groupId: guestFormData.groupId && guestFormData.groupId !== "none" ? guestFormData.groupId : null,
        notes: guestFormData.notes || "",
        rsvpStatus: "pending" as const,
        events: [] as ("ceremony" | "reception")[],
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
          isChild: false,
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
      (g) => g.name.toLowerCase().trim() === groupFormData.name.trim().toLowerCase(),
    )
    if (isGroupNameDuplicate || isGuestNameDuplicate) {
      setErrorMessage("A guest or group with this name already exists. Please use a different name.")
      return
    }

    try {
      const groupData = {
        name: groupFormData.name.trim(),
        size: groupFormData.size,
        side: groupFormData.side,
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
          size: 1,
          side: "bride",
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  const totalGuests = guests.length
  const brideGuests = guests.filter((g) => g.side === "bride").length
  const groomGuests = guests.filter((g) => g.side === "groom").length
  const attending = guests.filter((g) => g.rsvpStatus === "attending").length
  const notAttending = guests.filter((g) => g.rsvpStatus === "not-attending").length
  const pending = guests.filter((g) => g.rsvpStatus === "pending").length

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalGuests}</div>
              <div className="text-sm text-muted-foreground">Total Guests</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {brideGuests} | Groom: {groomGuests}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{attending}</div>
              <div className="text-sm text-muted-foreground">Attending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {guests.filter((g) => g.rsvpStatus === "attending" && g.side === "bride").length} | Groom:{" "}
                {guests.filter((g) => g.rsvpStatus === "attending" && g.side === "groom").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{notAttending}</div>
              <div className="text-sm text-muted-foreground">Not Attending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {guests.filter((g) => g.rsvpStatus === "not-attending" && g.side === "bride").length} | Groom:{" "}
                {guests.filter((g) => g.rsvpStatus === "not-attending" && g.side === "groom").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {guests.filter((g) => g.rsvpStatus === "pending" && g.side === "bride").length} | Groom:{" "}
                {guests.filter((g) => g.rsvpStatus === "pending" && g.side === "groom").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={() => setShowAddGuestDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
          <Button onClick={() => setShowAddGroupDialog(true)} variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Add Group
          </Button>
        </div>

        {/* Guest List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Side</th>
                    <th className="p-4 text-left">RSVP Status</th>
                    <th className="p-4 text-left">Events</th>
                    <th className="p-4 text-left">Notes</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Individual Guests */}
                  {groupedGuests.ungrouped.length > 0 && (
                    <>
                      <tr className="bg-blue-100 dark:bg-blue-900/20">
                        <td colSpan={7} className="p-3 font-semibold text-blue-800 dark:text-blue-200">
                          Individual Guests ({groupedGuests.ungrouped.length})
                        </td>
                      </tr>
                      {groupedGuests.ungrouped.map((guest) => (
                        <tr key={guest.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            {guest.name}{" "}
                            {guest.isChild && <span className="text-xs text-muted-foreground">(Child)</span>}
                          </td>
                          <td className="p-4">Individual</td>
                          <td className="p-4">{guest.side === "bride" ? "Bride" : "Groom"}</td>
                          <td className="p-4">{guest.rsvpStatus}</td>
                          <td className="p-4">{guest.events.length > 0 ? guest.events.join(", ") : "-"}</td>
                          <td className="p-4 max-w-xs truncate">{guest.notes || "-"}</td>
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
                        <td className="p-3 text-red-800 dark:text-red-200">
                          Group ({members.length}/{group.size})
                        </td>
                        <td className="p-3 text-red-800 dark:text-red-200">
                          {group.side === "bride" ? "Bride" : "Groom"}
                        </td>
                        <td className="p-3 text-red-800 dark:text-red-200" colSpan={3}>
                          -
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingGroup(group)
                                setGroupFormData({ name: group.name, size: group.size, side: group.side })
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
                            {member.isChild && <span className="text-xs text-muted-foreground">(Child)</span>}
                          </td>
                          <td className="p-4">Group Member</td>
                          <td className="p-4">{member.side === "bride" ? "Bride" : "Groom"}</td>
                          <td className="p-4">{member.rsvpStatus}</td>
                          <td className="p-4">{member.events.length > 0 ? member.events.join(", ") : "-"}</td>
                          <td className="p-4 max-w-xs truncate">{member.notes || "-"}</td>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Individual Guest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddIndividualGuest} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>
              )}

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isChild"
                  checked={guestFormData.isChild}
                  onCheckedChange={(checked) => setGuestFormData({ ...guestFormData, isChild: checked as boolean })}
                />
                <Label htmlFor="isChild" className="cursor-pointer">
                  This guest is a child
                </Label>
              </div>

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
                <Label>Group (Optional)</Label>
                <Select
                  value={guestFormData.groupId}
                  onValueChange={(value) => setGuestFormData({ ...guestFormData, groupId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group or leave as individual" />
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

              <div>
                <Label htmlFor="guestNotes">Notes</Label>
                <Textarea
                  id="guestNotes"
                  value={guestFormData.notes}
                  onChange={(e) => setGuestFormData({ ...guestFormData, notes: e.target.value })}
                  placeholder="Any special notes about this guest..."
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

              <div>
                <Label htmlFor="groupSize">Group Size *</Label>
                <Input
                  id="groupSize"
                  type="number"
                  min="1"
                  max="20"
                  value={groupFormData.size}
                  onChange={(e) => setGroupFormData({ ...groupFormData, size: Number.parseInt(e.target.value) })}
                  placeholder="Enter maximum number of people in this group"
                  required
                />
              </div>

              <div>
                <Label>Side *</Label>
                <Select
                  value={groupFormData.side}
                  onValueChange={(value: "bride" | "groom") => setGroupFormData({ ...groupFormData, side: value })}
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
            </DialogHeader>
            {editingGuest && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingGuest) return

                  try {
                    const response = await fetch(`/api/guests/${editingGuest._id || editingGuest.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: editingGuest.name,
                        isChild: editingGuest.isChild,
                        side: editingGuest.side,
                        groupId: editingGuest.groupId,
                        notes: editingGuest.notes,
                        rsvpStatus: editingGuest.rsvpStatus,
                        events: editingGuest.events,
                        dietaryRequirements: editingGuest.dietaryRequirements,
                        questions: editingGuest.questions,
                      }),
                    })

                    if (response.ok) {
                      await loadData()
                      setEditingGuest(null)
                    } else {
                      console.error("Failed to update guest")
                      // Handle error
                    }
                  } catch (error) {
                    console.error("Error updating guest:", error)
                    // Handle error
                  }
                }}
                className="space-y-4"
              >
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
                      Ceremony
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
            </DialogHeader>
            {editingGroup && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingGroup) return

                  try {
                    const response = await fetch(`/api/groups/${editingGroup._id || editingGroup.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: groupFormData.name,
                        size: groupFormData.size,
                        side: groupFormData.side,
                      }),
                    })

                    if (response.ok) {
                      await loadData()
                      setEditingGroup(null)
                    } else {
                      console.error("Failed to update group")
                    }
                  } catch (error) {
                    console.error("Error updating group:", error)
                  }
                }}
                className="space-y-4"
              >
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

                <div>
                  <Label htmlFor="editGroupSize">Group Size *</Label>
                  <Input
                    id="editGroupSize"
                    type="number"
                    min="1"
                    max="20"
                    value={groupFormData.size}
                    onChange={(e) => setGroupFormData({ ...groupFormData, size: Number.parseInt(e.target.value) })}
                    placeholder="Enter maximum number of people in this group"
                    required
                  />
                </div>

                <div>
                  <Label>Side *</Label>
                  <Select
                    value={groupFormData.side}
                    onValueChange={(value: "bride" | "groom") => setGroupFormData({ ...groupFormData, side: value })}
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
