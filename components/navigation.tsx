"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { FlagIcon } from "@/components/flag-icon"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ta", name: "Tamil", flag: "🇱🇰", imageUrl: "/api/blob/TamilFlagIcon.png" },
]

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

export function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [pageConfig, setPageConfig] = useState<ContentData | null>(null)
  const [gallerySettings, setGallerySettings] = useState({ visible: false, accessible: true })
  const [availableLanguages, setAvailableLanguages] = useState(languages)
  const [autoLanguageDetected, setAutoLanguageDetected] = useState(false)

  useEffect(() => {
    const savedContent = localStorage.getItem("wedding_content")
    if (savedContent) {
      setPageConfig(JSON.parse(savedContent))
    }

    fetchGallerySettings()
    fetchLanguageSettings()
    detectAndSetLanguage()
  }, [])

  const fetchGallerySettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setGallerySettings({
          visible: data.galleryVisible ?? true,
          accessible: data.galleryAccessible ?? true,
        })
      }
    } catch (error) {
      console.error("Error fetching gallery settings:", error)
    }
  }

  const fetchLanguageSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        const enabledLanguages = languages.filter((lang) => {
          if (lang.code === "en") return true
          if (lang.code === "da") return data.enableDanish ?? true
          if (lang.code === "fr") return data.enableFrench ?? true
          if (lang.code === "ta") return data.enableTamil ?? true
          return true
        })
        setAvailableLanguages(enabledLanguages)
      }
    } catch (error) {
      console.error("Error fetching language settings:", error)
    }
  }

  const detectAndSetLanguage = async () => {
    // Check if language has already been manually set by user
    const hasManualLanguage = localStorage.getItem("wedding_language")
    if (hasManualLanguage) {
      setAutoLanguageDetected(true)
      return
    }

    try {
      // Fetch settings to check if auto detection is enabled
      const settingsResponse = await fetch("/api/settings")
      if (!settingsResponse.ok) return

      const settings = await settingsResponse.json()
      if (!settings.enableAutoLanguageDetection) {
        setAutoLanguageDetected(true)
        return
      }

      // Get user's country from geolocation API
      const geoResponse = await fetch("/api/geo")
      if (!geoResponse.ok) {
        setAutoLanguageDetected(true)
        return
      }

      const { country } = await geoResponse.json()

      // Map country to language
      let detectedLanguage = "en" // Default to English
      if (country === "DK" && settings.enableDanish) {
        detectedLanguage = "da"
      } else if (country === "FR" && settings.enableFrench) {
        detectedLanguage = "fr"
      } else if (country === "LK" && settings.enableTamil) {
        detectedLanguage = "ta"
      }

      // Set the detected language
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage)
      }

      setAutoLanguageDetected(true)
    } catch (error) {
      console.error("Error detecting language:", error)
      setAutoLanguageDetected(true)
    }
  }

  const getNavItems = () => {
    const baseNavItems = [
      { href: "/", label: t("home"), key: "home" },
      { href: "/events", label: t("events"), key: "events" },
      { href: "/venue", label: t("venue"), key: "venue" },
      { href: "/travel", label: t("travel"), key: "travel" },
      { href: "/rsvp", label: t("rsvp"), key: "rsvp" },
    ]

    // Only add gallery if settings say it's visible
    if (gallerySettings.visible) {
      baseNavItems.splice(4, 0, { href: "/gallery", label: t("gallery"), key: "gallery" })
    }

    return baseNavItems
      .filter((item) => {
        if (item.key === "rsvp") return true
        if (!pageConfig) return true
        const pageData = pageConfig[item.key as keyof ContentData]
        return pageData?.enabled !== false
      })
      .sort((a, b) => {
        if (a.key === "rsvp") return 1
        if (b.key === "rsvp") return -1
        if (!pageConfig) return 0
        const aOrder = pageConfig[a.key as keyof ContentData]?.order || 999
        const bOrder = pageConfig[b.key as keyof ContentData]?.order || 999
        return aOrder - bOrder
      })
  }

  const navItems = getNavItems()
  const currentLanguage = availableLanguages.find((l) => l.code === language)

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="script text-2xl">
              B & V
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-sans ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-card-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2"
                >
                  <FlagIcon
                    flag={currentLanguage?.flag || ""}
                    imageUrl={currentLanguage?.imageUrl}
                    alt={`${currentLanguage?.name} flag`}
                    className="text-base"
                  />
                  <span className="hidden sm:inline">{currentLanguage?.name}</span>
                </Button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setShowLangMenu(false)
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-2 ${
                          language === lang.code ? "bg-muted" : ""
                        }`}
                      >
                        <FlagIcon flag={lang.flag} imageUrl={lang.imageUrl} alt={`${lang.name} flag`} />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-serif text-lg font-semibold text-card-foreground">Menu</span>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors font-sans ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-card-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
