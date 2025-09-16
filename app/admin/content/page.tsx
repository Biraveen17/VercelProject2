"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { isAuthenticated, logout } from "@/lib/auth"
import { ArrowLeft, LogOut, Save, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PageContent {
  title: string
  description: string
  content: string
  enabled: boolean
  order: number
}

interface ContentData {
  home: PageContent
  events: PageContent
  venue: PageContent
  gallery: PageContent
  travel: PageContent
}

export default function ContentEditorPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [contentData, setContentData] = useState<ContentData>({
    home: {
      title: "Varnie & Biraveen",
      description: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
      content: "We are thrilled to invite you to join us as we begin our journey together as husband and wife...",
      enabled: true,
      order: 1,
    },
    events: {
      title: "Wedding Events",
      description: "Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus",
      content: "Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities...",
      enabled: true,
      order: 2,
    },
    venue: {
      title: "Venue & Location",
      description: "Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day",
      content: "Both our ceremony and reception will take place in stunning beachfront locations...",
      enabled: true,
      order: 3,
    },
    gallery: {
      title: "Our Gallery",
      description: "Capturing the beautiful moments of our journey together",
      content: "Browse through our engagement photos and pre-wedding celebrations...",
      enabled: true,
      order: 5,
    },
    travel: {
      title: "Travel to Cyprus",
      description: "Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus",
      content: "Cyprus is easily accessible from major European cities with direct flights to Paphos...",
      enabled: true,
      order: 4,
    },
  })

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Content editor: Checking authentication...")
      const isAuth = await isAuthenticated()
      console.log("[v0] Content editor: Authentication result:", isAuth)

      if (!isAuth) {
        console.log("[v0] Content editor: Not authenticated, redirecting to admin")
        router.push("/admin")
        return
      }

      setAuthenticated(true)
      await loadContentData()
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const loadContentData = async () => {
    try {
      console.log("[v0] Content editor: Loading content data...")
      const token = localStorage.getItem("wedding_admin_token")
      const response = await fetch("/api/content", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data && Object.keys(result.data).length > 0) {
          setContentData(result.data)
          console.log("[v0] Content editor: Content data loaded successfully")
        }
      } else {
        console.log("[v0] Content editor: Failed to load content data:", response.status)
      }
    } catch (error) {
      console.error("[v0] Content editor: Error loading content data:", error)
      // Keep default data if API fails
    }
  }

  const saveContentData = async () => {
    try {
      console.log("[v0] Content editor: Saving content data...")
      const token = localStorage.getItem("wedding_admin_token")
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentData),
      })

      if (response.ok) {
        console.log("[v0] Content editor: Content saved successfully")
        alert("Content saved successfully!")
      } else {
        console.log("[v0] Content editor: Failed to save content:", response.status)
        throw new Error("Failed to save content")
      }
    } catch (error) {
      console.error("[v0] Content editor: Error saving content:", error)
      alert("Failed to save content. Please try again.")
    }
  }

  const updatePageContent = (page: keyof ContentData, field: keyof PageContent, value: string | boolean | number) => {
    setContentData((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  const pages = [
    { key: "home", label: "Home Page" },
    { key: "events", label: "Events" },
    { key: "venue", label: "Venue" },
    { key: "gallery", label: "Gallery" },
    { key: "travel", label: "Travel" },
  ]

  const currentPage = contentData[activeTab as keyof ContentData]

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
              <h1 className="text-3xl font-bold text-primary">Content Editor</h1>
              <p className="text-muted-foreground">Edit the content of your wedding website pages</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveContentData}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={() => logout()} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Page Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {pages.map((page) => (
                  <button
                    key={page.key}
                    onClick={() => setActiveTab(page.key)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                      activeTab === page.key ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Edit {pages.find((p) => p.key === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Page Management Controls */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={currentPage.enabled}
                    onChange={(e) => updatePageContent(activeTab as keyof ContentData, "enabled", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="enabled">Page Enabled</Label>
                </div>
                <div>
                  <Label htmlFor="order">Navigation Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    max="10"
                    value={currentPage.order}
                    onChange={(e) =>
                      updatePageContent(activeTab as keyof ContentData, "order", Number.parseInt(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={currentPage.title}
                  onChange={(e) => updatePageContent(activeTab as keyof ContentData, "title", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Page Description</Label>
                <Textarea
                  id="description"
                  value={currentPage.description}
                  onChange={(e) => updatePageContent(activeTab as keyof ContentData, "description", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Main Content</Label>
                <Textarea
                  id="content"
                  value={currentPage.content}
                  onChange={(e) => updatePageContent(activeTab as keyof ContentData, "content", e.target.value)}
                  className="mt-2"
                  rows={12}
                />
              </div>

              {/* Preview */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="bg-muted p-6 rounded-lg">
                  <h1 className="text-2xl font-bold text-primary mb-2">{currentPage.title}</h1>
                  <p className="text-muted-foreground mb-4">{currentPage.description}</p>
                  <div className="prose prose-sm max-w-none">
                    <p>{currentPage.content}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Content Editor Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Tips for Writing Content</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep titles concise and descriptive</li>
                  <li>• Use descriptions to summarize the page content</li>
                  <li>• Write in a warm, welcoming tone for guests</li>
                  <li>• Include practical information where relevant</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cultural Considerations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Explain Hindu traditions for non-Indian guests</li>
                  <li>• Include dress code guidance</li>
                  <li>• Mention multilingual support availability</li>
                  <li>• Provide context for cultural ceremonies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
