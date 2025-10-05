"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { PageTracker } from "@/components/page-tracker"

interface Memory {
  url: string
  pathname: string
  filename: string
  uploadedAt: string
}

export default function MemoriesPage() {
  const { t } = useLanguage()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch("/api/list-blobs")
      const data = await response.json()

      // Filter only memories (exclude proposal photos)
      const memoryPhotos =
        data.files?.filter(
          (file: Memory) =>
            file.pathname?.toLowerCase().includes("memories/") && !file.pathname?.toLowerCase().includes("proposal"),
        ) || []

      setMemories(memoryPhotos)
    } catch (error) {
      console.error("[v0] Error fetching memories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-memory", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      // Refresh memories list
      await fetchMemories()

      // Reset file input
      event.target.value = ""
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
      alert("Failed to upload photo. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const openLightbox = (url: string, index: number) => {
    setSelectedPhoto(url)
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next"
        ? (selectedIndex + 1) % memories.length
        : (selectedIndex - 1 + memories.length) % memories.length

    setSelectedIndex(newIndex)
    setSelectedPhoto(memories[newIndex].url)
  }

  return (
    <div className="min-h-screen">
      <PageTracker pageName="memories" />

      <section className="section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Camera className="w-5 h-5 text-primary" />
              <span className="caption-text text-primary">Our Journey</span>
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <h1 className="display-text text-5xl md:text-7xl mb-6">Memories</h1>
            <p className="subtitle-text max-w-2xl mx-auto mb-8">Share your favorite moments from our special day</p>

            {/* Upload Button */}
            <div className="flex justify-center">
              <label htmlFor="photo-upload">
                <Button
                  disabled={uploading}
                  className="btn-primary rounded-full px-8 py-6 text-lg cursor-pointer"
                  asChild
                >
                  <span>
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="caption-text">Loading memories...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && memories.length === 0 && (
            <Card className="decorative-border p-12 text-center max-w-2xl mx-auto">
              <Camera className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
              <h3 className="caption-text text-primary mb-4">No Memories Yet</h3>
              <p className="body-text text-muted-foreground mb-6">
                Be the first to share a special moment from our celebration!
              </p>
              <label htmlFor="photo-upload-empty">
                <Button className="btn-primary rounded-full" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Photo
                  </span>
                </Button>
              </label>
              <input
                id="photo-upload-empty"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </Card>
          )}

          {/* Photo Grid */}
          {!loading && memories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memories.map((memory, index) => (
                <Card
                  key={memory.pathname}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  onClick={() => openLightbox(memory.url, index)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={memory.url || "/placeholder.svg"}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-white">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-light">{new Date(memory.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto && (
        <PhotoLightbox
          photoUrl={selectedPhoto}
          onClose={closeLightbox}
          onNext={() => navigatePhoto("next")}
          onPrev={() => navigatePhoto("prev")}
          currentIndex={selectedIndex}
          totalPhotos={memories.length}
        />
      )}
    </div>
  )
}
