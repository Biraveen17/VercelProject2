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
  const [initializingDb, setInitializingDb] = useState(false)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [guests, setGuests] = useState<any[]>([])
  const [budgetItems, setBudgetItems] = useState<any[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated()
      setAuthenticated(isAuth)
      if (isAuth) {
        const user = await getCurrentUser()
        setCurrentUser(user)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleInitializeDatabase = async () => {
    setInitializingDb(true)
    try {
      const response = await fetch("/api/init-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const result = await response.json()
      if (result.success) {
        setDbInitialized(true)
        setError("")
        console.log("[v0] Database initialized successfully:", result.tables)
      } else {
        setError(`Database initialization failed: ${result.error}`)
      }
    } catch (error) {
      console.error("[v0] Database initialization error:", error)
      setError("Failed to initialize database")
    } finally {
      setInitializingDb(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Starting login process...")
    setError("")

    try {
      const success = await login(username, password)
      console.log("[v0] Login result:", success)

      if (success) {
        console.log("[v0] Login successful, checking token in localStorage...")
        const token = localStorage.getItem("wedding_admin_token")
        console.log("[v0] Token in localStorage:", token ? "found" : "not found")

        setAuthenticated(true)
        setError("")
        const user = await getCurrentUser()
        console.log("[v0] Current user:", user)
        setCurrentUser(user)
      } else {
        console.log("[v0] Login failed")
        setError("Invalid credentials")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("Login failed. Please try again.")
    }
  }

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
    setCurrentUser(null)
  }

  useEffect(() => {
    if (authenticated) {
      const loadData = async () => {
        const guestData = await getGuests()
        const budgetData = await getBudgetItems()
        setGuests(guestData)
        setBudgetItems(budgetData)
      }
      loadData()
    }
  }, [authenticated])

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
            {!dbInitialized && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">First time setup? Initialize the database first:</p>
                <Button
                  onClick={handleInitializeDatabase}
                  disabled={initializingDb}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {initializingDb ? "Initializing Database..." : "Initialize Database"}
                </Button>
              </div>
            )}

            {dbInitialized && (
              <div className="mb-4 p-3 border rounded-lg bg-green-50 text-green-800">
                <p className="text-sm">✅ Database initialized successfully! You can now log in.</p>
              </div>
            )}

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

  const totalRSVPs = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName) {
      return total + guest.maxGroupSize
    } else if (guest.type === "individual" && !guest.groupName) {
      return total + 1
    }
    return total
  }, 0)

  const attendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "attending") {
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "attending").length
    } else if (guest.type === "individual" && !guest.groupName && guest.rsvpStatus === "attending") {
      return total + 1
    }
    return total
  }, 0)

  const notAttendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "not-attending") {
      const groupMembers = guests.filter((g) => g.groupName === guest.groupName && g.guestName)
      return total + groupMembers.filter((g) => g.rsvpStatus === "not-attending").length
    } else if (guest.type === "individual" && !guest.groupName && guest.rsvpStatus === "not-attending") {
      return total + 1
    }
    return total
  }, 0)

  const pendingGuests = guests.reduce((total, guest) => {
    if (guest.type === "group" && guest.maxGroupSize && !guest.guestName && guest.rsvpStatus === "pending") {
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
