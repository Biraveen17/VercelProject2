"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Eye,
  Users,
  MapPin,
  Calendar,
  RefreshCw,
  Monitor,
  Download,
  Trash2,
  Plus,
  Pencil,
} from "lucide-react"
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

interface IpExclusion {
  _id: string
  ipAddress: string
  createdAt: string
}

interface IpNameMapping {
  _id: string
  ipAddress: string
  name: string
  createdAt: string
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

  const [ipExclusions, setIpExclusions] = useState<IpExclusion[]>([])
  const [ipMappings, setIpMappings] = useState<IpNameMapping[]>([])
  const [showAddExclusionDialog, setShowAddExclusionDialog] = useState(false)
  const [showAddMappingDialog, setShowAddMappingDialog] = useState(false)
  const [editingExclusion, setEditingExclusion] = useState<IpExclusion | null>(null)
  const [editingMapping, setEditingMapping] = useState<IpNameMapping | null>(null)
  const [newExclusionIp, setNewExclusionIp] = useState("")
  const [newMappingIp, setNewMappingIp] = useState("")
  const [newMappingName, setNewMappingName] = useState("")
  const [ipError, setIpError] = useState("")

  useEffect(() => {
    fetchAnalytics()
    fetchIpExclusions()
    fetchIpMappings()

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAnalytics()
        fetchIpExclusions()
        fetchIpMappings()
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

  const fetchIpExclusions = async () => {
    try {
      const response = await fetch("/api/analytics/ip-exclusions")
      if (response.ok) {
        const exclusions = await response.json()
        setIpExclusions(exclusions)
      }
    } catch (error) {
      console.error("Error fetching IP exclusions:", error)
    }
  }

  const addIpExclusion = async () => {
    if (!newExclusionIp.trim()) {
      setIpError("IP address is required")
      return
    }

    try {
      const response = await fetch("/api/analytics/ip-exclusions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: newExclusionIp }),
      })

      if (response.ok) {
        setShowAddExclusionDialog(false)
        setNewExclusionIp("")
        setIpError("")
        fetchIpExclusions()
        fetchAnalytics() // Refresh stats
      } else {
        const error = await response.json()
        setIpError(error.error || "Failed to add IP exclusion")
      }
    } catch (error) {
      setIpError("Error adding IP exclusion")
    }
  }

  const updateIpExclusion = async () => {
    if (!editingExclusion || !newExclusionIp.trim()) {
      setIpError("IP address is required")
      return
    }

    try {
      const response = await fetch(`/api/analytics/ip-exclusions/${editingExclusion._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: newExclusionIp }),
      })

      if (response.ok) {
        setEditingExclusion(null)
        setNewExclusionIp("")
        setIpError("")
        fetchIpExclusions()
        fetchAnalytics() // Refresh stats
      } else {
        const error = await response.json()
        setIpError(error.error || "Failed to update IP exclusion")
      }
    } catch (error) {
      setIpError("Error updating IP exclusion")
    }
  }

  const deleteIpExclusion = async (id: string) => {
    if (!confirm("Are you sure you want to remove this IP exclusion?")) return

    try {
      const response = await fetch(`/api/analytics/ip-exclusions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchIpExclusions()
        fetchAnalytics() // Refresh stats
      }
    } catch (error) {
      console.error("Error deleting IP exclusion:", error)
    }
  }

  const fetchIpMappings = async () => {
    try {
      const response = await fetch("/api/analytics/ip-mappings")
      if (response.ok) {
        const mappings = await response.json()
        setIpMappings(mappings)
      }
    } catch (error) {
      console.error("Error fetching IP mappings:", error)
    }
  }

  const addIpMapping = async () => {
    if (!newMappingIp.trim()) {
      setIpError("IP address is required")
      return
    }
    if (!newMappingName.trim()) {
      setIpError("Name is required")
      return
    }

    try {
      const response = await fetch("/api/analytics/ip-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: newMappingIp, name: newMappingName }),
      })

      if (response.ok) {
        setShowAddMappingDialog(false)
        setNewMappingIp("")
        setNewMappingName("")
        setIpError("")
        fetchIpMappings()
        fetchAnalytics() // Refresh stats to show names
      } else {
        const error = await response.json()
        setIpError(error.error || "Failed to add IP mapping")
      }
    } catch (error) {
      setIpError("Error adding IP mapping")
    }
  }

  const updateIpMapping = async () => {
    if (!editingMapping || !newMappingIp.trim() || !newMappingName.trim()) {
      setIpError("Both IP address and name are required")
      return
    }

    try {
      const response = await fetch(`/api/analytics/ip-mappings/${editingMapping._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: newMappingIp, name: newMappingName }),
      })

      if (response.ok) {
        setEditingMapping(null)
        setNewMappingIp("")
        setNewMappingName("")
        setIpError("")
        fetchIpMappings()
        fetchAnalytics() // Refresh stats to show updated names
      } else {
        const error = await response.json()
        setIpError(error.error || "Failed to update IP mapping")
      }
    } catch (error) {
      setIpError("Error updating IP mapping")
    }
  }

  const deleteIpMapping = async (id: string) => {
    if (!confirm("Are you sure you want to remove this IP name mapping?")) return

    try {
      const response = await fetch(`/api/analytics/ip-mappings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchIpMappings()
        fetchAnalytics() // Refresh stats to show IPs instead of names
      }
    } catch (error) {
      console.error("Error deleting IP mapping:", error)
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

        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Excluded IP Addresses</CardTitle>
                <Button onClick={() => setShowAddExclusionDialog(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exclusion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                IP addresses in this list will be excluded from all statistics
              </p>
              {ipExclusions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No IP exclusions configured</p>
              ) : (
                <div className="space-y-2">
                  {ipExclusions.map((exclusion) => (
                    <div key={exclusion._id} className="flex items-center justify-between p-3 border rounded-md">
                      {editingExclusion?._id === exclusion._id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={newExclusionIp}
                            onChange={(e) => {
                              setNewExclusionIp(e.target.value)
                              setIpError("")
                            }}
                            placeholder="IP Address"
                            className="flex-1"
                          />
                          <Button onClick={updateIpExclusion} size="sm">
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingExclusion(null)
                              setNewExclusionIp("")
                              setIpError("")
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-mono">{exclusion.ipAddress}</span>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingExclusion(exclusion)
                                setNewExclusionIp(exclusion.ipAddress)
                                setIpError("")
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => deleteIpExclusion(exclusion._id)} variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {ipError && editingExclusion && <p className="text-sm text-red-600 mt-2">{ipError}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Add IP Name Mappings Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>IP Address Name Mappings</CardTitle>
                <Button onClick={() => setShowAddMappingDialog(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Map IP addresses to friendly names for easier identification in statistics
              </p>
              {ipMappings.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No IP name mappings configured</p>
              ) : (
                <div className="space-y-2">
                  {ipMappings.map((mapping) => (
                    <div key={mapping._id} className="flex items-center justify-between p-3 border rounded-md">
                      {editingMapping?._id === mapping._id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={newMappingIp}
                            onChange={(e) => {
                              setNewMappingIp(e.target.value)
                              setIpError("")
                            }}
                            placeholder="IP Address"
                            className="flex-1"
                          />
                          <Input
                            value={newMappingName}
                            onChange={(e) => {
                              setNewMappingName(e.target.value)
                              setIpError("")
                            }}
                            placeholder="Name"
                            className="flex-1"
                          />
                          <Button onClick={updateIpMapping} size="sm">
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingMapping(null)
                              setNewMappingIp("")
                              setNewMappingName("")
                              setIpError("")
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <span className="font-mono">{mapping.ipAddress}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-semibold">{mapping.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingMapping(mapping)
                                setNewMappingIp(mapping.ipAddress)
                                setNewMappingName(mapping.name)
                                setIpError("")
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => deleteIpMapping(mapping._id)} variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {ipError && editingMapping && <p className="text-sm text-red-600 mt-2">{ipError}</p>}
            </CardContent>
          </Card>
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
                      <th className="text-left p-2 font-semibold">IP Address / Name</th>
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

        <Dialog open={showAddExclusionDialog} onOpenChange={setShowAddExclusionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add IP Exclusion</DialogTitle>
              <DialogDescription>Enter an IP address to exclude from all statistics</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exclusion-ip">IP Address</Label>
                <Input
                  id="exclusion-ip"
                  value={newExclusionIp}
                  onChange={(e) => {
                    setNewExclusionIp(e.target.value)
                    setIpError("")
                  }}
                  placeholder="e.g., 192.168.1.1"
                />
                {ipError && <p className="text-sm text-red-600">{ipError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddExclusionDialog(false)
                  setNewExclusionIp("")
                  setIpError("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={addIpExclusion}>Add Exclusion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add IP Mapping Dialog */}
        <Dialog open={showAddMappingDialog} onOpenChange={setShowAddMappingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add IP Name Mapping</DialogTitle>
              <DialogDescription>Map an IP address to a friendly name for easier identification</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mapping-ip">IP Address</Label>
                <Input
                  id="mapping-ip"
                  value={newMappingIp}
                  onChange={(e) => {
                    setNewMappingIp(e.target.value)
                    setIpError("")
                  }}
                  placeholder="e.g., 192.168.1.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapping-name">Name</Label>
                <Input
                  id="mapping-name"
                  value={newMappingName}
                  onChange={(e) => {
                    setNewMappingName(e.target.value)
                    setIpError("")
                  }}
                  placeholder="e.g., John's Computer"
                />
              </div>
              {ipError && <p className="text-sm text-red-600">{ipError}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddMappingDialog(false)
                  setNewMappingIp("")
                  setNewMappingName("")
                  setIpError("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={addIpMapping}>Add Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
