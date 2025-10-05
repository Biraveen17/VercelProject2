"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"

interface TestResult {
  test: string
  status: "PASS" | "FAIL"
  message: string
}

interface TestSummary {
  total: number
  passed: number
  failed: number
  successRate: string
}

export default function MigrationTestPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [summary, setSummary] = useState<TestSummary | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated()
      setAuthenticated(isAuth)
      setLoading(false)
    }
    checkAuth()
  }, [])

  const runTests = async () => {
    setTesting(true)
    setResults([])
    setSummary(null)

    try {
      const response = await fetch("/api/test-migration")
      const data = await response.json()

      if (data.success !== undefined) {
        setResults(data.results || [])
        setSummary(data.summary || null)
      } else {
        setResults([
          {
            test: "Migration Test API",
            status: "FAIL",
            message: data.error || "Unknown error occurred",
          },
        ])
      }
    } catch (error) {
      setResults([
        {
          test: "Migration Test API",
          status: "FAIL",
          message: `Failed to run tests: ${error}`,
        },
      ])
    } finally {
      setTesting(false)
    }
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

  return (
    <div className="min-h-screen floral-background p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-primary">Migration Test</h1>
              <p className="text-muted-foreground">Validate the localStorage to database migration</p>
            </div>
          </div>
          <Button onClick={runTests} disabled={testing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Running Tests..." : "Run Tests"}
          </Button>
        </div>

        {/* Summary Card */}
        {summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {summary.failed === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{summary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{summary.successRate}</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testing && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mr-3" />
                <span>Running migration tests...</span>
              </div>
            )}

            {!testing && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Click "Run Tests" to validate the migration</div>
            )}

            {!testing && results.length > 0 && (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.status === "PASS" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                    </div>
                    <Badge variant={result.status === "PASS" ? "default" : "destructive"}>{result.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Migration Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Migration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Database Schema</span>
                <Badge variant="default">✅ Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>API Routes</span>
                <Badge variant="default">✅ Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Guest Management</span>
                <Badge variant="default">✅ Migrated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Budget & Settings</span>
                <Badge variant="default">✅ Migrated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Content & Spreadsheets</span>
                <Badge variant="default">✅ Migrated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Authentication System</span>
                <Badge variant="default">✅ Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Migration Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What was migrated:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Guest management from localStorage to database</li>
                  <li>• Budget tracking from localStorage to database</li>
                  <li>• Wedding settings from localStorage to database</li>
                  <li>• Content management from localStorage to database</li>
                  <li>• Spreadsheet data from localStorage to database</li>
                  <li>• Authentication sessions from localStorage to secure cookies + database</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benefits of the migration:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Data persists across devices and browsers</li>
                  <li>• Better security with HTTP-only cookies</li>
                  <li>• Scalable database storage</li>
                  <li>• Backup and recovery capabilities</li>
                  <li>• Multi-user access support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
