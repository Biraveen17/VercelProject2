"use client"

import { useEffect } from "react"

interface PageTrackerProps {
  pageName: string
}

export function PageTracker({ pageName }: PageTrackerProps) {
  useEffect(() => {
    console.log("[v0] PageTracker mounted for page:", pageName)

    // Generate or retrieve unique ID for this visitor
    let uniqueId = localStorage.getItem("visitor-id")
    if (!uniqueId) {
      uniqueId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("visitor-id", uniqueId)
      console.log("[v0] Generated new visitor ID:", uniqueId)
    } else {
      console.log("[v0] Using existing visitor ID:", uniqueId)
    }

    // Track the page visit
    const trackVisit = async () => {
      try {
        console.log("[v0] Sending tracking request for page:", pageName)
        const response = await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pageName,
            uniqueId,
            userAgent: navigator.userAgent,
          }),
        })

        if (response.ok) {
          console.log("[v0] Page visit tracked successfully for:", pageName)
        } else {
          console.error("[v0] Failed to track page visit. Status:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error tracking page visit:", error)
      }
    }

    trackVisit()
  }, [pageName])

  return null
}
