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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { logout } from "@/lib/auth"
import { Edit, Trash2, LogOut, ArrowLeft, Users, UserPlus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthentication } from "@/lib/auth"

type Guest = {
  id: string
  guest_name?: string
  group_id?: string
  is_group_header: boolean
  group_name?: string
  is_tbc: boolean
  side?: "bride" | "groom"
  is_child: boolean
  child_age_category?: "3_or_below" | "4_to_12" | "above_12"
  rsvp_status: "pending" | "attending" | "not_attending"
  events: string[]
  dietary_requirements?: string
  questions_for_couple?: string
  notes?: string
  rsvp_submitted: boolean
  rsvp_submitted_at?: string
  created_at: string
  updated_at: string
}

type Group = {
  id: string
  group_name: string
  total_guests: number
  defined_guests: number
  tbc_guests: number
  rsvp_submitted: boolean
  rsvp_submitted_at?: string
  created_at: string
  updated_at: string
}

const loadGuestsAndGroups = async (
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>,
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    console.log("[v0] Loading guests and groups from API...")
    const [guestsResponse, groupsResponse] = await Promise.all([fetch("/api/guests"), fetch("/api/groups")])

    if (!guestsResponse.ok || !groupsResponse.ok) {
      throw new Error("Failed to fetch data")
    }

    const guestsResult = await guestsResponse.json()
    const groupsResult = await groupsResponse.json()

    console.log("[v0] Loaded guests:", guestsResult.data?.length || 0)
    console.log("[v0] Loaded groups:", groupsResult.data?.length || 0)

    setGuests(guestsResult.data || [])
    setGroups(groupsResult.data || [])
  } catch (error) {
    console.error("[v0] Error loading data:", error)
    setGuests([])
    setGroups([])
  } finally {
    setLoading(false)
  }
}

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showAddIndividualDialog, setShowAddIndividualDialog] = useState(false)
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSide, setFilterSide] = useState<string>("all")
  const [filterRSVP, setFilterRSVP] = useState<string>("all")
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Checking authentication...")
      const isAuth = await checkAuthentication()
      console.log("[v0] Authentication result:", isAuth)
      setAuthenticated(isAuth)
      if (isAuth) {
        await loadGuestsAndGroups(setGuests, setGroups, setLoading)
      } else {
        setLoading(false)
        router.push("/admin")
      }
    }
    checkAuth()
  }, [router])

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const individualGuests = guests.filter((g) => !g.is_group_header && !g.group_id)
    const groupGuests = guests.filter((g) => !g.is_group_header && g.group_id)
    const tbcGuests = guests.filter((g) => g.is_tbc)

    const totalGuests = individualGuests.length + groupGuests.length
    const attending = guests.filter((g) => !g.is_group_header && g.rsvp_status === "attending").length
    const notAttending = guests.filter((g) => !g.is_group_header && g.rsvp_status === "not_attending").length
    const pending = guests.filter((g) => !g.is_group_header && g.rsvp_status === "pending").length

    const brideGuests = guests.filter((g) => !g.is_group_header && g.side === "bride").length
    const groomGuests = guests.filter((g) => !g.is_group_header && g.side === "groom").length

    const children = guests.filter((g) => !g.is_group_header && g.is_child)
    const children3OrBelow = children.filter((g) => g.child_age_category === "3_or_below").length
    const children4To12 = children.filter((g) => g.child_age_category === "4_to_12").length
    const childrenAbove12 = children.filter((g) => g.child_age_category === "above_12").length

    return {
      totalGuests,
      attending,
      notAttending,
      pending,
      brideGuests,
      groomGuests,
      totalGroups: groups.length,
      tbcGuests: tbcGuests.length,
      children: children.length,
      children3OrBelow,
      children4To12,
      childrenAbove12,
    }
  }, [guests, groups])

  // Create table data structure
  const tableData = useMemo(() => {
    const data: any[] = []

    // Add individual guests under "Individual" group
    const individualGuests = guests.filter((g) => !g.is_group_header && !g.group_id)
    if (individualGuests.length > 0) {
      data.push({
        type: "group_header",
        id: "individual",
        group_name: "Individual",
        total_guests: individualGuests.length,
        updated_at: new Date().toISOString(),
      })

      individualGuests.forEach((guest) => {
        data.push({
          type: "guest",
          ...guest,
        })
      })
    }

    // Add groups and their guests
    groups.forEach((group) => {
      data.push({
        type: "group_header",
        ...group,
      })

      const groupGuests = guests.filter((g) => g.group_id === group.id && !g.is_group_header)
      groupGuests.forEach((guest) => {
        data.push({
          type: "guest",
          ...guest,
        })
      })
    })

    return data
  }, [guests, groups])

  // Filter and sort table data
  const filteredData = useMemo(() => {
    const filtered = tableData.filter((item) => {
      if (item.type === "group_header") return true

      const matchesSearch =
        !searchTerm || (item.guest_name && item.guest_name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesSide = filterSide === "all" || item.side === filterSide
      const matchesRSVP = filterRSVP === "all" || item.rsvp_status === filterRSVP

      return matchesSearch && matchesSide && matchesRSVP
    })

    // Sort logic would go here if needed
    return filtered
  }, [tableData, searchTerm, filterSide, filterRSVP])

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to delete this guest? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete guest")
      }

      await loadGuestsAndGroups(setGuests, setGroups, setLoading)
    } catch (error) {
      console.error("Error deleting guest:", error)
      alert("Failed to delete guest. Please try again.")
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this group? All guests in this group will also be deleted. This action cannot be undone.",
      )
    )
      return

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete group")
      }

      await loadGuestsAndGroups(setGuests, setGroups, setLoading)
    } catch (error) {
      console.error("Error deleting group:", error)
      alert("Failed to delete group. Please try again.")
    }
  }

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

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Bride: {stats.brideGuests} • Groom: {stats.groomGuests}
              </div>
              <div className="text-xs text-muted-foreground">
                Children: {stats.children} (&lt;=3: {stats.children3OrBelow}, 4-12: {stats.children4To12}, &gt;12:{" "}
                {stats.childrenAbove12})
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">RSVP Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Attending:</span>
                  <span className="font-semibold">{stats.attending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Not Attending:</span>
                  <span className="font-semibold">{stats.notAttending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Pending:</span>
                  <span className="font-semibold">{stats.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGroups}</div>
              <div className="text-xs text-muted-foreground mt-1">TBC Guests: {stats.tbcGuests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Bride Side:</span>
                  <span>{stats.brideGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Groom Side:</span>
                  <span>{stats.groomGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Children:</span>
                  <span>{stats.children}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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

            <Button onClick={() => setShowAddIndividualDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Individual
            </Button>

            <Button onClick={() => setShowAddGroupDialog(true)} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </div>
        </div>

        {/* Guest Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Age</th>
                    <th className="text-left p-4 font-medium">Side</th>
                    <th className="text-left p-4 font-medium">RSVP</th>
                    <th className="text-left p-4 font-medium">Events</th>
                    <th className="text-left p-4 font-medium">Dietary</th>
                    <th className="text-left p-4 font-medium">Questions</th>
                    <th className="text-left p-4 font-medium">Notes</th>
                    <th className="text-left p-4 font-medium">Updated</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center p-8 text-muted-foreground">
                        No guests found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className={
                          item.type === "group_header" ? "bg-muted/30 font-medium" : "border-b hover:bg-muted/20"
                        }
                      >
                        {item.type === "group_header" ? (
                          <>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {item.group_name}
                              </div>
                            </td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4">-</td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {new Date(item.updated_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              {item.id !== "individual" && (
                                <div className="flex gap-1">
                                  <Button variant="outline" size="sm" onClick={() => setEditingGroup(item)}>
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteGroup(item.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4">
                              <div className="pl-6">
                                {item.is_tbc ? (
                                  <Badge variant="secondary">TBC Guest</Badge>
                                ) : (
                                  item.guest_name || "Unnamed"
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {item.is_child && item.child_age_category && (
                                <Badge variant="outline">
                                  {item.child_age_category === "3_or_below"
                                    ? "&lt;=3"
                                    : item.child_age_category === "4_to_12"
                                      ? "4-12"
                                      : "&gt;12"}
                                </Badge>
                              )}
                            </td>
                            <td className="p-4">
                              {item.side && (
                                <Badge variant={item.side === "bride" ? "default" : "secondary"}>{item.side}</Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  item.rsvp_status === "attending"
                                    ? "default"
                                    : item.rsvp_status === "not_attending"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {item.rsvp_status.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="p-4 text-xs">{item.events?.join(", ") || "-"}</td>
                            <td className="p-4 text-xs max-w-32 truncate">{item.dietary_requirements || "-"}</td>
                            <td className="p-4 text-xs max-w-32 truncate">{item.questions_for_couple || "-"}</td>
                            <td className="p-4 text-xs max-w-32 truncate">{item.notes || "-"}</td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {new Date(item.updated_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" onClick={() => setEditingGuest(item)}>
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteGuest(item.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Individual Guest Dialog */}
        <AddIndividualDialog
          open={showAddIndividualDialog}
          onOpenChange={setShowAddIndividualDialog}
          onSuccess={() => loadGuestsAndGroups(setGuests, setGroups, setLoading)}
        />

        {/* Add Group Dialog */}
        <AddGroupDialog
          open={showAddGroupDialog}
          onOpenChange={setShowAddGroupDialog}
          onSuccess={() => loadGuestsAndGroups(setGuests, setGroups, setLoading)}
        />

        {/* Edit Guest Dialog */}
        {editingGuest && (
          <EditGuestDialog
            guest={editingGuest}
            open={!!editingGuest}
            onOpenChange={(open) => !open && setEditingGuest(null)}
            onSuccess={() => loadGuestsAndGroups(setGuests, setGroups, setLoading)}
          />
        )}

        {/* Edit Group Dialog */}
        {editingGroup && (
          <EditGroupDialog
            group={editingGroup}
            open={!!editingGroup}
            onOpenChange={(open) => !open && setEditingGroup(null)}
            onSuccess={() => loadGuestsAndGroups(setGuests, setGroups, setLoading)}
          />
        )}
      </div>
    </div>
  )
}

// Individual Guest Dialog Component
function AddIndividualDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    guest_name: "",
    side: "bride" as "bride" | "groom",
    is_child: false,
    child_age_category: "" as "3_or_below" | "4_to_12" | "above_12" | "",
    rsvp_status: "pending" as "pending" | "attending" | "not_attending",
    events: [] as string[],
    dietary_requirements: "",
    questions_for_couple: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          child_age_category: formData.is_child ? formData.child_age_category : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add guest")
      }

      onSuccess()
      onOpenChange(false)
      setFormData({
        guest_name: "",
        side: "bride",
        is_child: false,
        child_age_category: "",
        rsvp_status: "pending",
        events: [],
        dietary_requirements: "",
        questions_for_couple: "",
        notes: "",
      })
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Individual Guest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="guest_name">Guest Name *</Label>
            <Input
              id="guest_name"
              value={formData.guest_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, guest_name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="side">Side *</Label>
              <Select
                value={formData.side}
                onValueChange={(value: "bride" | "groom") => setFormData((prev) => ({ ...prev, side: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rsvp_status">RSVP Status</Label>
              <Select
                value={formData.rsvp_status}
                onValueChange={(value: "pending" | "attending" | "not_attending") =>
                  setFormData((prev) => ({ ...prev, rsvp_status: value }))
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_child"
              checked={formData.is_child}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_child: !!checked,
                  child_age_category: checked ? "4_to_12" : "",
                }))
              }
            />
            <Label htmlFor="is_child">This guest is a child</Label>
          </div>

          {formData.is_child && (
            <div>
              <Label htmlFor="child_age_category">Age Category *</Label>
              <Select
                value={formData.child_age_category}
                onValueChange={(value: "3_or_below" | "4_to_12" | "above_12") =>
                  setFormData((prev) => ({ ...prev, child_age_category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3_or_below">3 or below</SelectItem>
                  <SelectItem value="4_to_12">4 to 12</SelectItem>
                  <SelectItem value="above_12">Above 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.rsvp_status === "attending" && (
            <div>
              <Label>Events Attending</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wedding"
                    checked={formData.events.includes("wedding")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData((prev) => ({ ...prev, events: [...prev.events, "wedding"] }))
                      } else {
                        setFormData((prev) => ({ ...prev, events: prev.events.filter((e) => e !== "wedding") }))
                      }
                    }}
                  />
                  <Label htmlFor="wedding">Wedding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reception"
                    checked={formData.events.includes("reception")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData((prev) => ({ ...prev, events: [...prev.events, "reception"] }))
                      } else {
                        setFormData((prev) => ({ ...prev, events: prev.events.filter((e) => e !== "reception") }))
                      }
                    }}
                  />
                  <Label htmlFor="reception">Reception</Label>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="dietary_requirements">Dietary Requirements</Label>
            <Input
              id="dietary_requirements"
              value={formData.dietary_requirements}
              onChange={(e) => setFormData((prev) => ({ ...prev, dietary_requirements: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="questions_for_couple">Questions for the Couple</Label>
            <Textarea
              id="questions_for_couple"
              value={formData.questions_for_couple}
              onChange={(e) => setFormData((prev) => ({ ...prev, questions_for_couple: e.target.value }))}
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
            <Button type="submit">Add Guest</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Placeholder components for other dialogs
function AddGroupDialog({ open, onOpenChange, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <p>Group creation dialog - to be implemented</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}

function EditGuestDialog({ guest, open, onOpenChange, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>
        <p>Guest editing dialog - to be implemented</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}

function EditGroupDialog({ group, open, onOpenChange, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <p>Group editing dialog - to be implemented</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}
