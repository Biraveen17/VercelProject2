"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ta", name: "Tamil", flag: "🇱🇰" },
]

export function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [showLangMenu, setShowLangMenu] = useState(false)

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("events") },
    { href: "/venue", label: t("venue") },
    { href: "/gallery", label: t("gallery") },
    { href: "/travel", label: t("travel") },
    { href: "/rsvp", label: t("rsvp") },
  ]

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-pink-100 border-2 border-pink-300 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-pink-800 font-serif font-bold text-xl tracking-wider">V&B</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full opacity-80"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-semibold text-card-foreground tracking-wide">
                Varnie & Biraveen
              </span>
              <div className="text-xs text-muted-foreground font-sans italic">March 2026 • Cyprus</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-sans ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-card-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.name}</span>
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
        </div>
      </div>
    </nav>
  )
}
