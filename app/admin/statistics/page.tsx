"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Users, MapPin, Calendar, RefreshCw, Monitor, Download, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PageStat {
  page: string
  uniqueVisitors: number
  totalViews: number
  timestamps: string[]
}

interface HomeVisit {
  timestamp: string
  country: string
  city: string
  ip: string
  device: string // Add device field
}

interface RsvpSubmission {
  name: string
  timestamp: string
  status: string
  events: string[] // Add events field
}

interface AnalyticsData {
  pageStats: PageStat[]
  homeVisitsWithLocation: HomeVisit[]
  rsvpSubmissions: RsvpSubmission[]
}

export default function StatisticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetPassword, setResetPassword] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchAnalytics()

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAnalytics()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analytics/stats", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        console.error("Failed to fetch analytics. Status:", response.status)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!data) return

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Page Statistics
    csvContent += "PAGE STATISTICS\n"
    csvContent += "Page,Unique Visitors,Total Views\n"
    data.pageStats.forEach((stat) => {
      csvContent += `${getPageDisplayName(stat.page)},${stat.uniqueVisitors},${stat.totalViews}\n`
    })

    csvContent += "\n"

    // Home Page Visits
    csvContent += "HOME PAGE VISITS WITH LOCATION\n"
    csvContent += "Timestamp (UTC),Country,City,Device,IP Address\n"
    data.homeVisitsWithLocation.forEach((visit) => {
      csvContent += `${formatTimestamp(visit.timestamp)},${visit.country},${visit.city},"${visit.device}",${visit.ip}\n`
    })

    csvContent += "\n"

    // RSVP Submissions
    csvContent += "RSVP SUBMISSION TIMELINE\n"
    csvContent += "Guest Name,Submission Time (UTC),Status,Events\n"
    data.rsvpSubmissions.forEach((submission) => {
      const events =
        submission.events && submission.events.length > 0
          ? submission.events.map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("; ")
          : "None"
      csvContent += `${submission.name},${formatTimestamp(submission.timestamp)},${submission.status},${events}\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `wedding-statistics-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleResetStatistics = async () => {
    if (resetPassword !== "Pa55w0rd") {
      setResetError("Incorrect password")
      return
    }

    setResetting(true)
    setResetError("")

    try {
      const response = await fetch("/api/analytics/reset", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: resetPassword }),
      })

      if (response.ok) {
        setShowResetDialog(false)
        setResetPassword("")
        fetchAnalytics() // Refresh data
      } else {
        const error = await response.json()
        setResetError(error.error || "Failed to reset statistics")
      }
    } catch (error) {
      setResetError("Error resetting statistics")
    } finally {
      setResetting(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const getPageDisplayName = (page: string) => {
    return page.charAt(0).toUpperCase() + page.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen floral-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">Loading statistics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Page Statistics</h1>
              <p className="text-muted-foreground">Track visitor analytics and RSVP submissions</p>
            </div>
          </div>
          {/* Refresh Button */}
          <div className="flex items-center gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowResetDialog(true)} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Statistics
            </Button>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
            </Button>
            <Button onClick={fetchAnalytics} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Page Statistics Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Page Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.pageStats.map((stat) => (
              <Card key={stat.page}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {getPageDisplayName(stat.page)} Page
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Unique Visitors:</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {stat.uniqueVisitors}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Views:</span>
                      <span className="font-semibold">{stat.totalViews}</span>
                    </div>
                    {stat.timestamps.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Recent Visits (UTC):</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {stat.timestamps.slice(0, 5).map((timestamp, idx) => (
                            <p key={idx} className="text-xs font-mono">
                              {formatTimestamp(timestamp)}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Home Page Visits with Location */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Home Page Visits with Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Timestamp (UTC)</th>
                      <th className="text-left p-2 font-semibold">Country</th>
                      <th className="text-left p-2 font-semibold">City</th>
                      <th className="text-left p-2 font-semibold">Device</th>
                      <th className="text-left p-2 font-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.homeVisitsWithLocation.map((visit, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{formatTimestamp(visit.timestamp)}</td>
                        <td className="p-2">{visit.country}</td>
                        <td className="p-2">{visit.city}</td>
                        <td className="p-2 flex items-center gap-1">
                          <Monitor className="w-4 h-4" />
                          {visit.device}
                        </td>
                        <td className="p-2 font-mono text-sm">{visit.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.homeVisitsWithLocation.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No home page visits recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP Submissions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                RSVP Submission Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Guest Name</th>
                      <th className="text-left p-2 font-semibold">Submission Time (UTC)</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                      <th className="text-left p-2 font-semibold">Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.rsvpSubmissions.map((submission, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2">{submission.name}</td>
                        <td className="p-2 font-mono text-sm">{formatTimestamp(submission.timestamp)}</td>
                        <td className="p-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              submission.status === "attending"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-2">
                          {submission.events && submission.events.length > 0
                            ? submission.events.map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(", ")
                            : "None"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.rsvpSubmissions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No RSVP submissions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reset Statistics Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset All Statistics</DialogTitle>
              <DialogDescription>
                This will permanently delete all page visit data and RSVP submission history. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password to Confirm</Label>
                <Input
                  id="password"
                  type="password"
                  value={resetPassword}
                  onChange={(e) => {
                    setResetPassword(e.target.value)
                    setResetError("")
                  }}
                  placeholder="Enter password"
                />
                {resetError && <p className="text-sm text-red-600">{resetError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResetDialog(false)
                  setResetPassword("")
                  setResetError("")
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetStatistics} disabled={resetting}>
                {resetting ? "Resetting..." : "Reset Statistics"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
