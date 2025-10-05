"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem("wedding_site_access") === "true"
    if (isAuthenticated) {
      router.push("/")
      return
    }
    setLoading(false)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simple password protection - in production, this would be more secure
    if (password.toLowerCase() === "kalyanam2026" || password.toLowerCase() === "varniebiraveen") {
      localStorage.setItem("wedding_site_access", "true")
      router.push("/")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-card to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-primary">Varnie & Biraveen</CardTitle>
          <p className="text-muted-foreground">Private Wedding Website</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Enter Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wedding password"
                required
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This website is private. Please enter the password provided in your invitation.
              </p>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Enter Wedding Site
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have the password? Contact Varnie or Biraveen for access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
