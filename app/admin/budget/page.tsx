"use client"

import type React from "react"

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
import { getBudgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem, type BudgetItem } from "@/lib/database"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  ArrowUpDown,
  LogOut,
  ArrowLeft,
  BarChart3,
  Table,
  GripVertical,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type GroupingField = "category1" | "category2" | "itemName" | "vendor"

interface GroupingConfig {
  id: string
  field: GroupingField
  label: string
}

export default function BudgetTrackerPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "pivot">("table")
  const [sortField, setSortField] = useState<keyof BudgetItem>("lastUpdated")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const [groupingOrder, setGroupingOrder] = useState<GroupingConfig[]>([
    { id: "1", field: "category1", label: "Category 1" },
    { id: "2", field: "category2", label: "Category 2" },
    { id: "3", field: "itemName", label: "Item Name" },
    { id: "4", field: "vendor", label: "Vendor" },
  ])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    category1: "",
    category2: "",
    status: "",
    vendor: "",
  })

  // Form state
  const [formData, setFormData] = useState({
    category1: "",
    category2: "",
    itemName: "",
    vendor: "",
    cost: 0,
    status: "planned" as "planned" | "booked" | "paid",
    notes: "",
  })

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; itemId: string; itemName: string }>({
    show: false,
    itemId: "",
    itemName: "",
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    setAuthenticated(true)
    loadBudgetItems()
    setLoading(false)
  }, [router])

  const loadBudgetItems = () => {
    setBudgetItems(getBudgetItems())
  }

  const handleSort = (field: keyof BudgetItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = groupingOrder.findIndex((item) => item.id === draggedItem)
    const targetIndex = groupingOrder.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newOrder = [...groupingOrder]
    const [draggedConfig] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedConfig)

    setGroupingOrder(newOrder)
    setDraggedItem(null)
    // Reset expanded groups when order changes
    setExpandedGroups(new Set())
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const pivotData = useMemo(() => {
    const createNestedGroups = (items: BudgetItem[], groupFields: GroupingField[], level = 0): any => {
      if (level >= groupFields.length) {
        // Base case: return aggregated values
        return items.reduce(
          (acc, item) => {
            acc.planned += item.status === "planned" ? item.cost : 0
            acc.booked += item.status === "booked" ? item.cost : 0
            acc.paid += item.status === "paid" ? item.cost : 0
            acc.items = items
            return acc
          },
          { planned: 0, booked: 0, paid: 0, items: [] },
        )
      }

      const currentField = groupFields[level]
      const grouped: Record<string, any> = {}

      items.forEach((item) => {
        const key = item[currentField]
        if (!grouped[key]) {
          grouped[key] = []
        }
        grouped[key].push(item)
      })

      // Recursively group by next level
      Object.keys(grouped).forEach((key) => {
        grouped[key] = createNestedGroups(grouped[key], groupFields, level + 1)
      })

      return grouped
    }

    return createNestedGroups(
      budgetItems,
      groupingOrder.map((g) => g.field),
    )
  }, [budgetItems, groupingOrder])

  const renderPivotRows = (data: any, groupFields: GroupingField[], level = 0, parentKey = ""): React.ReactNode[] => {
    const rows: React.ReactNode[] = []

    if (level >= groupFields.length) {
      // This shouldn't happen in normal flow
      return rows
    }

    Object.entries(data).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}-${key}` : key
      const isExpanded = expandedGroups.has(fullKey)
      const indent = level * 24 // 24px per level

      if (level === groupFields.length - 1 || (typeof value === "object" && "planned" in value)) {
        // Leaf node - show aggregated data
        const totals = typeof value === "object" && "planned" in value ? value : { planned: 0, booked: 0, paid: 0 }
        const totalAmount = totals.planned + totals.booked + totals.paid

        rows.push(
          <tr key={fullKey} className="border-b hover:bg-muted/25">
            <td className="p-4" style={{ paddingLeft: `${16 + indent}px` }}>
              <div className="flex items-center gap-2">
                {level > 0 && <span className="text-muted-foreground">{"└─".repeat(level)}</span>}
                {key}
              </div>
            </td>
            <td className="p-4 text-red-600">£{totals.planned.toLocaleString()}</td>
            <td className="p-4 text-yellow-600">£{totals.booked.toLocaleString()}</td>
            <td className="p-4 text-green-600">£{totals.paid.toLocaleString()}</td>
            <td className="p-4 font-medium">£{totalAmount.toLocaleString()}</td>
          </tr>,
        )
      } else {
        // Group node - calculate totals and show expand/collapse
        const calculateGroupTotals = (groupData: any): { planned: number; booked: number; paid: number } => {
          const totals = { planned: 0, booked: 0, paid: 0 }

          const traverse = (obj: any) => {
            if (typeof obj === "object" && "planned" in obj) {
              totals.planned += obj.planned
              totals.booked += obj.booked
              totals.paid += obj.paid
            } else if (typeof obj === "object") {
              Object.values(obj).forEach(traverse)
            }
          }

          traverse(groupData)
          return totals
        }

        const groupTotals = calculateGroupTotals(value)
        const totalAmount = groupTotals.planned + groupTotals.booked + groupTotals.paid
        const childCount = Object.keys(value).length

        rows.push(
          <tr
            key={fullKey}
            className="border-b hover:bg-muted/50 cursor-pointer bg-muted/30"
            onClick={() => {
              const newExpanded = new Set(expandedGroups)
              if (newExpanded.has(fullKey)) {
                newExpanded.delete(fullKey)
              } else {
                newExpanded.add(fullKey)
              }
              setExpandedGroups(newExpanded)
            }}
          >
            <td className="p-4" style={{ paddingLeft: `${16 + indent}px` }}>
              <div className="flex items-center gap-2">
                {level > 0 && <span className="text-muted-foreground">{"└─".repeat(level)}</span>}
                <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
                <span className="font-bold">{key}</span>
                <span className="text-sm text-muted-foreground">
                  ({childCount} {groupFields[level + 1] ? groupingOrder[level + 1].label.toLowerCase() + "s" : "items"})
                </span>
              </div>
            </td>
            <td className="p-4 text-red-600 font-semibold">£{groupTotals.planned.toLocaleString()}</td>
            <td className="p-4 text-yellow-600 font-semibold">£{groupTotals.booked.toLocaleString()}</td>
            <td className="p-4 text-green-600 font-semibold">£{groupTotals.paid.toLocaleString()}</td>
            <td className="p-4 font-bold">£{totalAmount.toLocaleString()}</td>
          </tr>,
        )

        // Render children if expanded
        if (isExpanded) {
          rows.push(...renderPivotRows(value, groupFields, level + 1, fullKey))
        }
      }
    })

    return rows
  }

  const filteredAndSortedItems = useMemo(() => {
    const filtered = budgetItems.filter((item) => {
      if (filters.category1 && !item.category1.toLowerCase().includes(filters.category1.toLowerCase())) return false
      if (filters.category2 && !item.category2.toLowerCase().includes(filters.category2.toLowerCase())) return false
      if (filters.status && item.status !== filters.status) return false
      if (filters.vendor && !item.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) return false
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
  }, [budgetItems, filters, sortField, sortDirection])

  const budgetSummary = useMemo(() => {
    const planned = budgetItems.filter((item) => item.status === "planned").reduce((sum, item) => sum + item.cost, 0)
    const booked = budgetItems.filter((item) => item.status === "booked").reduce((sum, item) => sum + item.cost, 0)
    const paid = budgetItems.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.cost, 0)
    return { planned, booked, paid, total: planned + booked + paid }
  }, [budgetItems])

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    addBudgetItem(formData)
    loadBudgetItems()
    setShowAddDialog(false)
    resetForm()
  }

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item)
    setFormData({
      category1: item.category1,
      category2: item.category2,
      itemName: item.itemName,
      vendor: item.vendor,
      cost: item.cost,
      status: item.status,
      notes: item.notes || "",
    })
  }

  const handleDeleteItem = (id: string) => {
    const item = budgetItems.find((i) => i.id === id)
    if (item) {
      setDeleteConfirmation({
        show: true,
        itemId: id,
        itemName: item.itemName,
      })
    }
  }

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    updateBudgetItem(editingItem.id, formData)
    loadBudgetItems()
    setEditingItem(null)
    resetForm()
  }

  const confirmDeleteItem = () => {
    deleteBudgetItem(deleteConfirmation.itemId)
    loadBudgetItems()
    setDeleteConfirmation({ show: false, itemId: "", itemName: "" })
  }

  const resetForm = () => {
    setFormData({
      category1: "",
      category2: "",
      itemName: "",
      vendor: "",
      cost: 0,
      status: "planned",
      notes: "",
    })
  }

  const exportToCSV = () => {
    const headers = ["Category 1", "Category 2", "Item Name", "Vendor", "Cost", "Status", "Notes", "Last Updated"]

    const csvData = filteredAndSortedItems.map((item) => [
      item.category1,
      item.category2,
      item.itemName,
      item.vendor,
      item.cost.toString(),
      item.status,
      item.notes || "",
      new Date(item.lastUpdated).toLocaleString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wedding-budget.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "booked":
        return <Badge className="bg-yellow-100 text-yellow-800">Booked</Badge>
      default:
        return <Badge className="bg-red-100 text-red-800">Planned</Badge>
    }
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
              <h1 className="text-3xl font-bold text-primary">Budget Tracker</h1>
              <p className="text-muted-foreground">Manage your wedding expenses and payments</p>
            </div>
          </div>
          <Button onClick={() => logout()} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">£{budgetSummary.total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">£{budgetSummary.planned.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">£{budgetSummary.booked.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Booked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">£{budgetSummary.paid.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Budget Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Budget Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category1">Category 1</Label>
                    <Input
                      id="category1"
                      value={formData.category1}
                      onChange={(e) => setFormData({ ...formData, category1: e.target.value })}
                      placeholder="e.g., Venue, Catering, Photography"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category2">Category 2</Label>
                    <Input
                      id="category2"
                      value={formData.category2}
                      onChange={(e) => setFormData({ ...formData, category2: e.target.value })}
                      placeholder="e.g., Ceremony, Reception, Equipment"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="Specific item or service"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      placeholder="Vendor or supplier name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost (£)</Label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "planned" | "booked" | "paid") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or details..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Add Item</Button>
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

          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              size="sm"
            >
              <Table className="w-4 h-4 mr-2" />
              Table View
            </Button>
            <Button
              variant={viewMode === "pivot" ? "default" : "outline"}
              onClick={() => setViewMode("pivot")}
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Pivot View
            </Button>
          </div>
        </div>

        {viewMode === "pivot" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Pivot Grouping Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag and drop to reorder grouping levels. Data will be grouped in the order shown below.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupingOrder.map((config, index) => (
                  <div
                    key={config.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, config.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, config.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-2 border-dashed cursor-move hover:bg-muted transition-colors ${
                      draggedItem === config.id ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-auto">Group Level {index + 1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Category 1</Label>
                <Input
                  value={filters.category1}
                  onChange={(e) => setFilters({ ...filters, category1: e.target.value })}
                  placeholder="Filter by category 1..."
                />
              </div>
              <div>
                <Label>Category 2</Label>
                <Input
                  value={filters.category2}
                  onChange={(e) => setFilters({ ...filters, category2: e.target.value })}
                  placeholder="Filter by category 2..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendor</Label>
                <Input
                  value={filters.vendor}
                  onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                  placeholder="Filter by vendor..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table View */}
        {viewMode === "table" && (
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
                          onClick={() => handleSort("category1")}
                          className="font-semibold"
                        >
                          Category 1
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="p-4 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("category2")}
                          className="font-semibold"
                        >
                          Category 2
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="p-4 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("itemName")}
                          className="font-semibold"
                        >
                          Item Name
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="p-4 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("vendor")}
                          className="font-semibold"
                        >
                          Vendor
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="p-4 text-left">
                        <Button variant="ghost" size="sm" onClick={() => handleSort("cost")} className="font-semibold">
                          Cost
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </th>
                      <th className="p-4 text-left">
                        <div className="font-semibold text-red-600">
                          Planned
                          <div className="text-xs font-normal">
                            £{budgetItems.filter((i) => i.status === "planned").reduce((s, i) => s + i.cost, 0)}
                          </div>
                        </div>
                      </th>
                      <th className="p-4 text-left">
                        <div className="font-semibold text-yellow-600">
                          Booked
                          <div className="text-xs font-normal">
                            £{budgetItems.filter((i) => i.status === "booked").reduce((s, i) => s + i.cost, 0)}
                          </div>
                        </div>
                      </th>
                      <th className="p-4 text-left">
                        <div className="font-semibold text-green-600">
                          Paid
                          <div className="text-xs font-normal">
                            £{budgetItems.filter((i) => i.status === "paid").reduce((s, i) => s + i.cost, 0)}
                          </div>
                        </div>
                      </th>
                      <th className="p-4 text-left">Notes</th>
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
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">{item.category1}</td>
                        <td className="p-4">{item.category2}</td>
                        <td className="p-4">{item.itemName}</td>
                        <td className="p-4">{item.vendor}</td>
                        <td className="p-4">£{item.cost.toLocaleString()}</td>
                        <td className="p-4">{item.status === "planned" ? `£${item.cost}` : "-"}</td>
                        <td className="p-4">{item.status === "booked" ? `£${item.cost}` : "-"}</td>
                        <td className="p-4">{item.status === "paid" ? `£${item.cost}` : "-"}</td>
                        <td className="p-4 max-w-xs">
                          <div className="truncate" title={item.notes}>
                            {item.notes || "-"}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "pivot" && (
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Budget Pivot Table</CardTitle>
              <p className="text-sm text-muted-foreground">
                Data grouped by: {groupingOrder.map((g) => g.label).join(" → ")}. Click on group rows to
                expand/collapse.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left">Group</th>
                      <th className="p-4 text-left text-red-600">Planned</th>
                      <th className="p-4 text-left text-yellow-600">Booked</th>
                      <th className="p-4 text-left text-green-600">Paid</th>
                      <th className="p-4 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderPivotRows(
                      pivotData,
                      groupingOrder.map((g) => g.field),
                    )}

                    <tr className="border-t-2 border-primary bg-primary/10">
                      <td className="p-4 font-bold text-lg">Grand Total</td>
                      <td className="p-4 text-red-600 font-bold text-lg">£{budgetSummary.planned.toLocaleString()}</td>
                      <td className="p-4 text-yellow-600 font-bold text-lg">
                        £{budgetSummary.booked.toLocaleString()}
                      </td>
                      <td className="p-4 text-green-600 font-bold text-lg">£{budgetSummary.paid.toLocaleString()}</td>
                      <td className="p-4 font-bold text-lg">£{budgetSummary.total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCategory1">Category 1</Label>
                  <Input
                    id="editCategory1"
                    value={formData.category1}
                    onChange={(e) => setFormData({ ...formData, category1: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory2">Category 2</Label>
                  <Input
                    id="editCategory2"
                    value={formData.category2}
                    onChange={(e) => setFormData({ ...formData, category2: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editItemName">Item Name</Label>
                <Input
                  id="editItemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editVendor">Vendor</Label>
                  <Input
                    id="editVendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCost">Cost (£)</Label>
                  <Input
                    id="editCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "planned" | "booked" | "paid") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or details..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update Item</Button>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteConfirmation.show}
          onOpenChange={(open) => !open && setDeleteConfirmation({ show: false, itemId: "", itemName: "" })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{deleteConfirmation.itemName}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ show: false, itemId: "", itemName: "" })}
              >
                No, Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteItem}>
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
