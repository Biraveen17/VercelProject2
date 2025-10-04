"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Heart, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"

interface Memory {
  url: string
  caption: string
  uploadedAt: string
  pathname: string
}

export default function MemoriesPage() {
  const { t } = useLanguage()
  const [memories, setMemories] = useState<Memory[]>([])
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch("/api/memories/list")
      const data = await response.json()
      setMemories(data.memories || [])
    } catch (error) {
      console.error("Error fetching memories:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      alert("Please select a photo and add a caption")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("caption", caption)

      const response = await fetch("/api/memories/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setCaption("")
        setSelectedFile(null)
        setPreviewUrl(null)
        fetchMemories()
      } else {
        alert("Failed to upload memory")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload memory")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (pathname: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) {
      return
    }

    try {
      const response = await fetch("/api/memories/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pathname }),
      })

      if (response.ok) {
        fetchMemories()
      } else {
        alert("Failed to delete memory")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete memory")
    }
  }

  return (
    <div className="min-h-screen">
      <PageTracker pageName="memories" />

      <section className="section-spacing">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="display-text island-moments">Memories</h1>
            <div className="flex items-center justify-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <p className="subtitle-text">Share your favorite moments with us</p>
              <Heart className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Upload Section */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 max-w-2xl mx-auto mb-16">
            <h3 className="caption-text text-primary text-center mb-8">Upload a Memory</h3>

            <div className="space-y-6">
              {/* File Input */}
              <div>
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="body-text text-center mb-2">Click to upload a photo</p>
                      <p className="caption-text text-center">PNG, JPG, or JPEG (max 4.5MB)</p>
                    </div>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {/* Caption Input */}
              <div>
                <label htmlFor="caption" className="caption-text block mb-2">
                  Caption
                </label>
                <Textarea
                  id="caption"
                  placeholder="Share your memory..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !caption.trim()}
                className="w-full btn-primary"
                size="lg"
              >
                {uploading ? "Uploading..." : "Share Memory"}
              </Button>
            </div>
          </div>

          {/* Memories Grid */}
          <div>
            <h3 className="caption-text text-primary text-center mb-12">Our Memories Together</h3>

            {memories.length === 0 ? (
              <div className="text-center py-16">
                <p className="body-text text-muted-foreground">No memories yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {memories.map((memory, index) => (
                  <Card key={index} className="decorative-border overflow-hidden group">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={memory.url || "/placeholder.svg"}
                        alt={memory.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => handleDelete(memory.pathname)}
                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-6">
                      <p className="body-text leading-relaxed">{memory.caption}</p>
                      <p className="caption-text mt-4">
                        {new Date(memory.uploadedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
