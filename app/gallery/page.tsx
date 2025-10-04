"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Camera, Heart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTracker } from "@/components/page-tracker"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function GalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accessible, setAccessible] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          const isAccessible = data.galleryAccessible ?? true
          setAccessible(isAccessible)

          if (!isAccessible) {
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Error checking gallery access:", error)
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!accessible) {
    return null
  }

  // Placeholder images - in real implementation, these would come from a database or CMS
  const engagementPhotos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Engagement Photo ${i + 1}`,
    description: "Beautiful moment captured during our engagement shoot",
  }))

  return (
    <div className="min-h-screen py-12 px-4">
      <PageTracker pageName="gallery" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capturing the beautiful moments of our journey together
          </p>
        </div>

        {/* Engagement Photos Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold text-center">Engagement Shoot</h2>
            <Heart className="w-6 h-6 text-accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {engagementPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary" className="bg-white/90 text-black">
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm">{photo.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pre-Wedding Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pre-Wedding Celebrations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-white mx-auto mb-2" />
                  <p className="text-white font-medium">Mehendi Ceremony</p>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Henna Night</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful henna designs and traditional celebrations with family and friends.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-white mx-auto mb-2" />
                  <p className="text-white font-medium">Sangam Ceremony</p>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Family Gathering</h3>
                <p className="text-sm text-muted-foreground">
                  Traditional ceremony bringing both families together in celebration.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/40 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-white mx-auto mb-2" />
                  <p className="text-white font-medium">Couple Portraits</p>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Romantic Shots</h3>
                <p className="text-sm text-muted-foreground">
                  Intimate portraits capturing our love story in beautiful Cyprus locations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Photo Sharing */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Share Your Photos</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We'd love to see the wedding through your eyes! Share your photos and videos with us using our wedding
              hashtag or email them directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white px-6 py-3 rounded-lg border">
                <span className="font-mono text-primary font-semibold">#VarnieBiraveenWedding</span>
              </div>
              <p className="text-muted-foreground">or email to</p>
              <div className="bg-white px-6 py-3 rounded-lg border">
                <span className="font-mono text-primary">photos@varniebiraveen.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <div className="text-center mt-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Wedding Day Photos</h3>
              <p className="text-muted-foreground text-sm">
                Professional wedding photos will be available here after our special day. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
