"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isAuthenticated, login, logout, getCurrentUser } from "@/lib/auth"
import { getGuests, getBudgetItems } from "@/lib/database"
import { Users, DollarSign, Calendar, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      setAuthenticated(true)
      setError("")
    } else {
      setError("Invalid credentials")
    }
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen floral-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const guests = getGuests()
  const budgetItems = getBudgetItems()
  const currentUser = getCurrentUser()

  // For groups, count by maxGroupSize; for individuals, count as 1 each
  const totalRSVPs = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName) {
      // This is a group header - count by max group size
      return total + guest.maxGroupSize
    } else if (guest.type === "individual" && !guest.groupName) {
      // This is an individual not belonging to any group
      return total + 1
    }
    // Skip individual group members as they're already counted in the group header
    return total
  }, 0)

  const attendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "attending") {
      // Group header attending - count actual group members who responded
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "attending").length
    } else if (guest.type === "individual" && !guest.groupName && guest.rsvpStatus === "attending") {
      return total + 1
    }
    return total
  }, 0)

  const notAttendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "not-attending") {
      // Group header not attending - count actual group members who responded
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "not-attending").length
    } else if (guest.type === "individual" && !guest.groupName && guest.rsvpStatus === "not-attending") {
      return total + 1
    }
    return total
  }, 0)

  const pendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "pending") {
      // Group header pending - count by max group size
      return total + guest.maxGroupSize
    } else if (guest.type === "individual" && !guest.groupName && guest.rsvpStatus === "pending") {
      return total + 1
    }
    return total
  }, 0)

  const ceremonyAttendees = guests.reduce((total, guest) => {
    if (
      guest.type === "group" &&
      guest.maxGroupSize &&
      !guest.guestName &&
      guest.rsvpStatus === "attending" &&
      guest.events.includes("ceremony")
    ) {
      // Group attending ceremony - count actual group members
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "attending" && g.events.includes("ceremony")).length
    } else if (
      guest.type === "individual" &&
      !guest.groupName &&
      guest.rsvpStatus === "attending" &&
      guest.events.includes("ceremony")
    ) {
      return total + 1
    }
    return total
  }, 0)

  const receptionAttendees = guests.reduce((total, guest) => {
    if (
      guest.type === "group" &&
      guest.maxGroupSize &&
      !guest.guestName &&
      guest.rsvpStatus === "attending" &&
      guest.events.includes("reception")
    ) {
      // Group attending reception - count actual group members
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "attending" && g.events.includes("reception")).length
    } else if (
      guest.type === "individual" &&
      !guest.groupName &&
      guest.rsvpStatus === "attending" &&
      guest.events.includes("reception")
    ) {
      return total + 1
    }
    return total
  }, 0)

  const plannedTotal = budgetItems.filter((i) => i.status === "planned").reduce((sum, i) => sum + i.cost, 0)
  const bookedTotal = budgetItems.filter((i) => i.status === "booked").reduce((sum, i) => sum + i.cost, 0)
  const paidTotal = budgetItems.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.cost, 0)
  const totalExpense = plannedTotal + bookedTotal + paidTotal

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Wedding Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total RSVPs</p>
                  <p className="text-2xl font-bold">{totalRSVPs}</p>
                  <p className="text-xs text-muted-foreground">
                    {attendingGuests} attending • {notAttendingGuests} not attending • {pendingGuests} pending
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ceremony Attendees</p>
                  <p className="text-2xl font-bold">{ceremonyAttendees}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reception Attendees</p>
                  <p className="text-2xl font-bold">{receptionAttendees}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expense</p>
                  <p className="text-2xl font-bold">£{totalExpense.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Planned: £{plannedTotal.toLocaleString()} • Booked: £{bookedTotal.toLocaleString()} • Paid: £
                    {paidTotal.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/guests">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Guest Management</h3>
                <p className="text-sm text-muted-foreground">Manage guest list and RSVPs</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/budget">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Budget Tracker</h3>
                <p className="text-sm text-muted-foreground">Track expenses and payments</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/content">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Content Editor</h3>
                <p className="text-sm text-muted-foreground">Edit website pages</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/spreadsheet">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 text-primary mx-auto mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Excel Sheets</h3>
                <p className="text-sm text-muted-foreground">Manage spreadsheets and calculations</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/settings">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground">Wedding details and configuration</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
