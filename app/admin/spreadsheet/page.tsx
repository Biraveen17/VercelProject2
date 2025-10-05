"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, X, Save, Download } from "lucide-react"
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"

interface Cell {
  value: string
  formula?: string
  computed?: number | string
}

interface Spreadsheet {
  id: string
  name: string
  cells: { [key: string]: Cell }
  lastModified: Date
}

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
const ROWS = Array.from({ length: 20 }, (_, i) => i + 1)

const FORMULA_SUGGESTIONS = [
  { formula: "=SUM(", description: "Sum a range of cells" },
  { formula: "=AVERAGE(", description: "Calculate average of cells" },
  { formula: "=A1+B1", description: "Add two cells" },
  { formula: "=A1*B1", description: "Multiply two cells" },
  { formula: "=A1-B1", description: "Subtract cells" },
  { formula: "=A1/B1", description: "Divide cells" },
]

export default function SpreadsheetPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([])
  const [activeSheet, setActiveSheet] = useState<string>("")
  const [selectedCell, setSelectedCell] = useState<string>("")
  const [formulaInput, setFormulaInput] = useState<string>("")
  const [newSheetName, setNewSheetName] = useState<string>("")
  const [showNewSheetDialog, setShowNewSheetDialog] = useState(false)
  const [showFormulaSuggestions, setShowFormulaSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(FORMULA_SUGGESTIONS)
  const cellRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setLoading(false)
    loadSpreadsheets()
  }, [])

  useEffect(() => {
    if (formulaInput.startsWith("=")) {
      const filtered = FORMULA_SUGGESTIONS.filter(
        (suggestion) =>
          suggestion.formula.toLowerCase().includes(formulaInput.toLowerCase()) ||
          suggestion.description.toLowerCase().includes(formulaInput.toLowerCase()),
      )
      setFilteredSuggestions(filtered)
      setShowFormulaSuggestions(filtered.length > 0)
    } else {
      setShowFormulaSuggestions(false)
    }
  }, [formulaInput])

  const loadSpreadsheets = async () => {
    try {
      const response = await fetch("/api/spreadsheets")
      if (response.ok) {
        const result = await response.json()
        const sheets = result.data || []

        // Convert lastModified strings back to Date objects
        const processedSheets = sheets.map((sheet: any) => ({
          ...sheet,
          lastModified: new Date(sheet.lastModified),
        }))

        setSpreadsheets(processedSheets)
        if (processedSheets.length > 0 && !activeSheet) {
          setActiveSheet(processedSheets[0].id)
        }
      } else {
        // Create default sheet if none exist
        await createDefaultSheet()
      }
    } catch (error) {
      console.error("Error loading spreadsheets:", error)
      // Create default sheet on error
      await createDefaultSheet()
    }
  }

  const createDefaultSheet = async () => {
    const defaultSheet: Spreadsheet = {
      id: "sheet-1",
      name: "Wedding Planning",
      cells: {},
      lastModified: new Date(),
    }

    try {
      const response = await fetch("/api/spreadsheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultSheet),
      })

      if (response.ok) {
        setSpreadsheets([defaultSheet])
        setActiveSheet(defaultSheet.id)
      }
    } catch (error) {
      console.error("Error creating default sheet:", error)
      // Fallback to local state
      setSpreadsheets([defaultSheet])
      setActiveSheet(defaultSheet.id)
    }
  }

  const saveSpreadsheets = useCallback(async (sheets: Spreadsheet[]) => {
    setSpreadsheets(sheets)

    // Save each sheet to database
    for (const sheet of sheets) {
      try {
        await fetch(`/api/spreadsheets/${sheet.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sheet),
        })
      } catch (error) {
        console.error("Error saving spreadsheet:", error)
      }
    }
  }, [])

  const getCurrentSheet = () => {
    return spreadsheets.find((s) => s.id === activeSheet)
  }

  const getCellId = (col: string, row: number) => `${col}${row}`

  const getCellCoordinates = (cellId: string) => {
    const col = cellId.match(/[A-P]/)?.[0] || "A"
    const row = Number.parseInt(cellId.match(/\d+/)?.[0] || "1")
    return { col, row, colIndex: COLUMNS.indexOf(col), rowIndex: row - 1 }
  }

  const navigateToCell = (direction: "up" | "down" | "left" | "right" | "tab" | "enter") => {
    if (!selectedCell) return

    const { colIndex, rowIndex } = getCellCoordinates(selectedCell)
    let newColIndex = colIndex
    let newRowIndex = rowIndex

    switch (direction) {
      case "up":
        newRowIndex = Math.max(0, rowIndex - 1)
        break
      case "down":
      case "enter":
        newRowIndex = Math.min(ROWS.length - 1, rowIndex + 1)
        break
      case "left":
        newColIndex = Math.max(0, colIndex - 1)
        break
      case "right":
      case "tab":
        newColIndex = Math.min(COLUMNS.length - 1, colIndex + 1)
        break
    }

    const newCellId = getCellId(COLUMNS[newColIndex], newRowIndex + 1)
    setSelectedCell(newCellId)

    setTimeout(() => {
      const cellInput = cellRefs.current[newCellId]
      if (cellInput) {
        cellInput.focus()
        cellInput.select() // Select all text for easier editing
        const sheet = getCurrentSheet()
        const cell = sheet?.cells[newCellId]
        setFormulaInput(cell?.value || "")
      }
    }, 0)
  }

  const getCellValue = (cellId: string) => {
    const sheet = getCurrentSheet()
    if (!sheet) return ""
    const cell = sheet.cells[cellId]
    return cell?.computed !== undefined ? cell.computed.toString() : cell?.value || ""
  }

  const setCellValue = (cellId: string, value: string) => {
    const sheet = getCurrentSheet()
    if (!sheet) return

    const updatedSheets = spreadsheets.map((s) => {
      if (s.id === activeSheet) {
        const newCells = { ...s.cells }

        if (value.startsWith("=")) {
          // Handle formula
          const formula = value.substring(1)
          const computed = evaluateFormula(formula, s.cells)
          newCells[cellId] = { value, formula, computed }
        } else {
          // Handle regular value
          const numValue = Number.parseFloat(value)
          newCells[cellId] = {
            value,
            computed: !isNaN(numValue) && value !== "" ? numValue : value,
          }
        }

        return { ...s, cells: newCells, lastModified: new Date() }
      }
      return s
    })

    saveSpreadsheets(updatedSheets)
    recalculateFormulas(updatedSheets.find((s) => s.id === activeSheet)!)
  }

  const evaluateFormula = (formula: string, cells: { [key: string]: Cell }): number | string => {
    try {
      if (!formula || formula.trim() === "") {
        return ""
      }

      // Handle SUM function
      if (formula.toUpperCase().startsWith("SUM(")) {
        const range = formula.substring(4, formula.length - 1)
        return evaluateSum(range, cells)
      }

      // Handle AVERAGE function
      if (formula.toUpperCase().startsWith("AVERAGE(")) {
        const range = formula.substring(8, formula.length - 1)
        return evaluateAverage(range, cells)
      }

      // Handle simple arithmetic with cell references
      let expression = formula
      const cellPattern = /[A-P]\d+/g
      const cellRefs = formula.match(cellPattern) || []

      for (const cellRef of cellRefs) {
        const cell = cells[cellRef]
        const value = cell?.computed !== undefined ? cell.computed : Number.parseFloat(cell?.value || "0") || 0
        expression = expression.replace(new RegExp(cellRef, "g"), value.toString())
      }

      // Evaluate simple arithmetic
      const result = Function(`"use strict"; return (${expression})`)()
      return typeof result === "number" ? Math.round(result * 100) / 100 : result
    } catch (error) {
      return "#ERROR"
    }
  }

  const evaluateSum = (range: string, cells: { [key: string]: Cell }): number => {
    const cellRefs = expandRange(range)
    let sum = 0

    for (const cellRef of cellRefs) {
      const cell = cells[cellRef]
      const value = cell?.computed !== undefined ? cell.computed : Number.parseFloat(cell?.value || "0")
      if (typeof value === "number" && !isNaN(value)) {
        sum += value
      }
    }

    return Math.round(sum * 100) / 100
  }

  const evaluateAverage = (range: string, cells: { [key: string]: Cell }): number => {
    const cellRefs = expandRange(range)
    let sum = 0
    let count = 0

    for (const cellRef of cellRefs) {
      const cell = cells[cellRef]
      const value = cell?.computed !== undefined ? cell.computed : Number.parseFloat(cell?.value || "0")
      if (typeof value === "number" && !isNaN(value)) {
        sum += value
        count++
      }
    }

    return count > 0 ? Math.round((sum / count) * 100) / 100 : 0
  }

  const expandRange = (range: string): string[] => {
    if (range.includes(":")) {
      const [start, end] = range.split(":")
      const startCol = start.match(/[A-P]/)?.[0] || "A"
      const startRow = Number.parseInt(start.match(/\d+/)?.[0] || "1")
      const endCol = end.match(/[A-P]/)?.[0] || "A"
      const endRow = Number.parseInt(end.match(/\d+/)?.[0] || "1")

      const startColIndex = COLUMNS.indexOf(startCol)
      const endColIndex = COLUMNS.indexOf(endCol)

      const cells: string[] = []
      for (let col = startColIndex; col <= endColIndex; col++) {
        for (let row = startRow; row <= endRow; row++) {
          cells.push(`${COLUMNS[col]}${row}`)
        }
      }
      return cells
    }
    return [range]
  }

  const recalculateFormulas = (sheet: Spreadsheet) => {
    const updatedCells = { ...sheet.cells }

    // Recalculate all formulas
    Object.keys(updatedCells).forEach((cellId) => {
      const cell = updatedCells[cellId]
      if (cell.formula) {
        cell.computed = evaluateFormula(cell.formula, updatedCells)
      }
    })

    const updatedSheets = spreadsheets.map((s) => (s.id === sheet.id ? { ...s, cells: updatedCells } : s))
    saveSpreadsheets(updatedSheets)
  }

  const createNewSheet = async () => {
    if (!newSheetName.trim()) return

    const newSheet: Spreadsheet = {
      id: `sheet-${Date.now()}`,
      name: newSheetName,
      cells: {},
      lastModified: new Date(),
    }

    try {
      const response = await fetch("/api/spreadsheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSheet),
      })

      if (response.ok) {
        const updatedSheets = [...spreadsheets, newSheet]
        setSpreadsheets(updatedSheets)
        setActiveSheet(newSheet.id)
        setNewSheetName("")
        setShowNewSheetDialog(false)
      }
    } catch (error) {
      console.error("Error creating new sheet:", error)
    }
  }

  const deleteSheet = async (sheetId: string) => {
    if (spreadsheets.length <= 1) return // Don't delete the last sheet

    try {
      const response = await fetch(`/api/spreadsheets/${sheetId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedSheets = spreadsheets.filter((s) => s.id !== sheetId)
        setSpreadsheets(updatedSheets)

        if (activeSheet === sheetId) {
          setActiveSheet(updatedSheets[0].id)
        }
      }
    } catch (error) {
      console.error("Error deleting sheet:", error)
    }
  }

  const exportToCSV = () => {
    const sheet = getCurrentSheet()
    if (!sheet) return

    let csv = ""
    for (let row = 1; row <= ROWS.length; row++) {
      const rowData: string[] = []
      for (const col of COLUMNS) {
        const cellId = getCellId(col, row)
        const value = getCellValue(cellId)
        rowData.push(`"${value.toString().replace(/"/g, '""')}"`)
      }
      csv += rowData.join(",") + "\n"
    }

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${sheet.name}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to access the admin panel.</p>
            <Link href="/admin">
              <Button className="mt-4">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentSheet = getCurrentSheet()

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Excel Spreadsheets</h1>
              <p className="text-muted-foreground">Manage your wedding planning data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => recalculateFormulas(currentSheet!)} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Recalculate
            </Button>
          </div>
        </div>

        {/* Sheet Tabs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Tabs value={activeSheet} onValueChange={setActiveSheet}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  {spreadsheets.map((sheet) => (
                    <div key={sheet.id} className="flex items-center">
                      <TabsTrigger value={sheet.id} className="relative">
                        {sheet.name}
                        {spreadsheets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSheet(sheet.id)
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </TabsTrigger>
                    </div>
                  ))}
                </TabsList>

                <Dialog open={showNewSheetDialog} onOpenChange={setShowNewSheetDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Sheet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Sheet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sheetName">Sheet Name</Label>
                        <Input
                          id="sheetName"
                          value={newSheetName}
                          onChange={(e) => setNewSheetName(e.target.value)}
                          placeholder="Enter sheet name..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNewSheetDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createNewSheet}>Create Sheet</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Formula Bar */}
              {selectedCell && (
                <div className="mb-4 p-3 bg-muted rounded-lg relative">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-medium">{selectedCell}:</span>
                    <Input
                      value={formulaInput}
                      onChange={(e) => setFormulaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setCellValue(selectedCell, formulaInput)
                          navigateToCell("enter")
                          e.preventDefault()
                        }
                        if (e.key === "Tab") {
                          setCellValue(selectedCell, formulaInput)
                          navigateToCell("tab")
                          e.preventDefault()
                        }
                        if (e.key === "Escape") {
                          setSelectedCell("")
                          setFormulaInput("")
                          setShowFormulaSuggestions(false)
                        }
                        if (e.key === "ArrowUp" && !showFormulaSuggestions) {
                          setCellValue(selectedCell, formulaInput)
                          navigateToCell("up")
                          e.preventDefault()
                        }
                        if (e.key === "ArrowDown" && !showFormulaSuggestions) {
                          setCellValue(selectedCell, formulaInput)
                          navigateToCell("down")
                          e.preventDefault()
                        }
                      }}
                      placeholder="Enter value or formula (e.g., =SUM(A1:A5), =B2+C2)"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setCellValue(selectedCell, formulaInput)
                        setSelectedCell("")
                        setFormulaInput("")
                      }}
                    >
                      Apply
                    </Button>
                  </div>

                  {showFormulaSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setFormulaInput(suggestion.formula)
                            setShowFormulaSuggestions(false)
                          }}
                        >
                          <div className="font-mono text-sm text-primary">{suggestion.formula}</div>
                          <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Supported functions: SUM(A1:A5), AVERAGE(A1:A5), or simple arithmetic like =A1+B1*2. Use arrow keys
                    to navigate cells.
                  </p>
                </div>
              )}

              {/* Spreadsheet Grid */}
              {spreadsheets.map((sheet) => (
                <TabsContent key={sheet.id} value={sheet.id} className="mt-0">
                  <div className="border rounded-lg overflow-auto max-h-[600px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="w-12 h-8 border bg-muted text-xs font-medium"></th>
                          {COLUMNS.map((col) => (
                            <th key={col} className="w-24 h-8 border bg-muted text-xs font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ROWS.map((row) => (
                          <tr key={row}>
                            <td className="w-12 h-8 border bg-muted text-xs font-medium text-center">{row}</td>
                            {COLUMNS.map((col) => {
                              const cellId = getCellId(col, row)
                              const isSelected = selectedCell === cellId
                              return (
                                <td key={cellId} className="w-24 h-8 border p-0">
                                  <Input
                                    ref={(el) => (cellRefs.current[cellId] = el)}
                                    value={getCellValue(cellId)}
                                    onChange={(e) => {
                                      setCellValue(cellId, e.target.value)
                                      if (selectedCell === cellId) {
                                        setFormulaInput(e.target.value)
                                      }
                                    }}
                                    onFocus={() => {
                                      setSelectedCell(cellId)
                                      const sheet = getCurrentSheet()
                                      const cell = sheet?.cells[cellId]
                                      setFormulaInput(cell?.value || "")
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        navigateToCell("enter")
                                        e.preventDefault()
                                      }
                                      if (e.key === "Tab") {
                                        navigateToCell("tab")
                                        e.preventDefault()
                                      }
                                      if (e.key === "ArrowUp") {
                                        navigateToCell("up")
                                        e.preventDefault()
                                      }
                                      if (e.key === "ArrowDown") {
                                        navigateToCell("down")
                                        e.preventDefault()
                                      }
                                      if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
                                        navigateToCell("left")
                                        e.preventDefault()
                                      }
                                      if (
                                        e.key === "ArrowRight" &&
                                        e.currentTarget.selectionStart === e.currentTarget.value.length
                                      ) {
                                        navigateToCell("right")
                                        e.preventDefault()
                                      }
                                    }}
                                    className={`w-full h-8 border-0 rounded-none text-xs ${
                                      isSelected ? "ring-2 ring-primary" : ""
                                    }`}
                                    placeholder=""
                                  />
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
