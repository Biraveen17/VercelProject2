"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)

      // If we got an admin token, store it for immediate use
      if (data.adminToken) {
        localStorage.setItem("wedding_admin_token", data.adminToken)
        console.log("[v0] Admin token stored:", data.adminToken)
      }
    } catch (error) {
      setResult({ success: false, error: "Setup failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wedding Website Setup</CardTitle>
          <CardDescription>Initialize the database and create admin access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Setup Database"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              <p className="font-medium">{result.success ? "Success!" : "Error"}</p>
              <p className="text-sm mt-1">{result.message || result.error}</p>
              {result.adminToken && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <p className="text-xs font-mono break-all">Admin token: {result.adminToken}</p>
                  <p className="text-xs mt-1 text-gray-600">
                    Token has been automatically stored. You can now access the admin panel.
                  </p>
                </div>
              )}
            </div>
          )}

          {result?.success && (
            <div className="space-y-2">
              <Button onClick={() => (window.location.href = "/admin")} className="w-full" variant="outline">
                Go to Admin Panel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
