"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function PasswordProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip password protection for admin routes
    if (pathname.startsWith("/admin") || pathname === "/password") {
      setIsAuthenticated(true)
      setLoading(false)
      return
    }

    // Check if user has access
    const hasAccess = localStorage.getItem("wedding_site_access") === "true"
    if (!hasAccess) {
      router.push("/password")
      return
    }

    setIsAuthenticated(true)
    setLoading(false)
  }, [pathname, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
