"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isAuthenticated, login, logout, getCurrentUser } from "@/lib/auth"
import { Users, DollarSign, Calendar, Settings, LogOut, BarChart, Plane } from "lucide-react"
import Link from "next/link"

interface Guest {
  _id: string
  name: string
  guestType: "defined" | "tbc"
  isChild: boolean
  ageGroup?: string
  side: "bride" | "groom" | null
  groupId: string | null
  notes: string
  rsvpStatus: "attending" | "not attending" | "pending"
  events: string[]
  dietaryRequirements: string
  questions: string
  lockStatus: "locked" | "unlocked"
  createdAt: string
  lastUpdated: string
}

interface BudgetItem {
  _id: string
  category: string
  item: string
  cost: number
  status: "planned" | "booked" | "paid"
  notes: string
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [guests, setGuests] = useState<Guest[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchData()
    }
  }, [authenticated])

  const fetchData = async () => {
    try {
      setDataLoading(true)
      const [guestsRes, budgetRes] = await Promise.all([fetch("/api/guests"), fetch("/api/budget")])

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json()
        setGuests(guestsData)
      }

      if (budgetRes.ok) {
        const budgetData = await budgetRes.json()
        setBudgetItems(budgetData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setDataLoading(false)
    }
  }

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

  const currentUser = getCurrentUser()

  const totalRSVPs = guests.filter((g) => g.rsvpStatus !== "pending").length
  const attendingGuests = guests.filter((g) => g.rsvpStatus === "attending").length
  const notAttendingGuests = guests.filter((g) => g.rsvpStatus === "not attending").length
  const pendingGuests = guests.filter((g) => g.rsvpStatus === "pending").length

  const ceremonyAttendees = guests.filter((g) => g.rsvpStatus === "attending" && g.events.includes("wedding")).length

  const receptionAttendees = guests.filter((g) => g.rsvpStatus === "attending" && g.events.includes("reception")).length

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
        {dataLoading ? (
          <div className="text-center py-8">Loading statistics...</div>
        ) : (
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
                    <p className="text-sm text-muted-foreground">Wedding Attendees</p>
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
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/statistics">
              <CardContent className="p-6 text-center">
                <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Page Statistics</h3>
                <p className="text-sm text-muted-foreground">View visitor analytics and insights</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/hotels">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 text-primary mx-auto mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Hotels Management</h3>
                <p className="text-sm text-muted-foreground">Manage hotel listings and details</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/flights">
              <CardContent className="p-6 text-center">
                <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flight Management</h3>
                <p className="text-sm text-muted-foreground">Manage flight information and schedules</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
