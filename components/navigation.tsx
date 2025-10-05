"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ta", name: "Tamil", flag: "🇱🇰" },
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
  const [gallerySettings, setGallerySettings] = useState({ visible: true, accessible: true }) // Added gallery settings state

  useEffect(() => {
    const savedContent = localStorage.getItem("wedding_content")
    if (savedContent) {
      setPageConfig(JSON.parse(savedContent))
    }

    fetchGallerySettings()
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

  const getNavItems = () => {
    const baseNavItems = [
      { href: "/", label: t("home"), key: "home" },
      { href: "/events", label: t("events"), key: "events" },
      { href: "/venue", label: t("venue"), key: "venue" },
      { href: "/travel", label: t("travel"), key: "travel" },
      { href: "/gallery", label: t("gallery"), key: "gallery" },
      { href: "/rsvp", label: t("rsvp"), key: "rsvp" },
    ]

    return baseNavItems
      .filter((item) => {
        if (item.key === "gallery" && !gallerySettings.visible) {
          return false
        }
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
  const currentLanguage = languages.find((l) => l.code === language)

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
                  <span className="text-base">{currentLanguage?.flag}</span>
                  <span className="hidden sm:inline">{currentLanguage?.name}</span>
                </Button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                    {languages.map((lang) => (
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
                        <span>{lang.flag}</span>
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
