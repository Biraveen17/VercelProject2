"use client"

import { useEffect } from "react"

interface PageTrackerProps {
  pageName: string
}

export function PageTracker({ pageName }: PageTrackerProps) {
  useEffect(() => {
    // Generate or retrieve unique ID for this visitor
    let uniqueId = localStorage.getItem("visitor-id")
    if (!uniqueId) {
      uniqueId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("visitor-id", uniqueId)
    }

    // Track the page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/track", {
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
      } catch (error) {
        console.error("Error tracking page visit:", error)
      }
    }

    trackVisit()
  }, [pageName])

  return null
}
