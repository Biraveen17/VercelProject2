"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isAuthenticated, logout } from "@/lib/auth"
import { getSettings, saveSettings, type WeddingSettings } from "@/lib/database"
import { ArrowLeft, LogOut, Save, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<WeddingSettings>({
    brideName: "",
    groomName: "",
    weddingDate: "",
    ceremonyDate: "",
    receptionDate: "",
    venue: "",
    location: "",
    allowVideoDownload: true,
    allowVideoFullscreen: true,
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    setAuthenticated(true)
    loadSettings()
    setLoading(false)
  }, [router])

  const loadSettings = () => {
    setSettings(getSettings())
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveSettings(settings)
    alert("Settings saved successfully!")
  }

  const updateSetting = (field: keyof WeddingSettings, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-primary">Wedding Settings</h1>
              <p className="text-muted-foreground">Configure your wedding details and preferences</p>
            </div>
          </div>
          <Button onClick={() => logout()} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brideName">Bride Name</Label>
                  <Input
                    id="brideName"
                    value={settings.brideName}
                    onChange={(e) => updateSetting("brideName", e.target.value)}
                    placeholder="Enter bride's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groomName">Groom Name</Label>
                  <Input
                    id="groomName"
                    value={settings.groomName}
                    onChange={(e) => updateSetting("groomName", e.target.value)}
                    placeholder="Enter groom's name"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wedding Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Wedding Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weddingDate">Main Wedding Date (for countdown)</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={settings.weddingDate}
                  onChange={(e) => updateSetting("weddingDate", e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This date will be used for the countdown timer on the homepage
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ceremonyDate">Ceremony Date</Label>
                  <Input
                    id="ceremonyDate"
                    type="date"
                    value={settings.ceremonyDate}
                    onChange={(e) => updateSetting("ceremonyDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receptionDate">Reception Date</Label>
                  <Input
                    id="receptionDate"
                    type="date"
                    value={settings.receptionDate}
                    onChange={(e) => updateSetting("receptionDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={settings.venue}
                  onChange={(e) => updateSetting("venue", e.target.value)}
                  placeholder="e.g., Beachfront Resort, Paphos"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location/City</Label>
                <Input
                  id="location"
                  value={settings.location}
                  onChange={(e) => updateSetting("location", e.target.value)}
                  placeholder="e.g., Paphos, Cyprus"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowVideoDownload"
                  checked={settings.allowVideoDownload}
                  onChange={(e) => updateSetting("allowVideoDownload", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allowVideoDownload">Allow video download</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, visitors can download the proposal video from the homepage
              </p>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowVideoFullscreen"
                  checked={settings.allowVideoFullscreen}
                  onChange={(e) => updateSetting("allowVideoFullscreen", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allowVideoFullscreen">Allow video fullscreen</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, visitors can play the video in fullscreen mode
              </p>
            </CardContent>
          </Card>

          {/* Website Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Website Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Current Configuration</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Theme Colors:</span>
                    <div className="flex gap-2 mt-1">
                      <div className="w-4 h-4 bg-primary rounded" title="Castleton Green"></div>
                      <div className="w-4 h-4 bg-accent rounded" title="Purple"></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Languages:</span>
                    <p>English, Danish, Tamil</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admin Users:</span>
                    <p>Biraveen (Groom), Varnie (Bride)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cultural Theme:</span>
                    <p>Tamil Hindu Wedding</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </form>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Settings Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Date Configuration</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Main wedding date controls the countdown timer</li>
                  <li>• Ceremony and reception can be on different dates</li>
                  <li>• All dates appear throughout the website</li>
                  <li>• Changes update immediately on the frontend</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location Settings</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Venue name appears on event pages</li>
                  <li>• Location is used for travel information</li>
                  <li>• Both fields support full venue names</li>
                  <li>• Consider including city and country</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
