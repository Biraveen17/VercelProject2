"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

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
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("events") },
    { href: "/venue", label: t("venue") },
    { href: "/gallery", label: t("gallery") },
    { href: "/travel", label: t("travel") },
    { href: "/rsvp", label: t("rsvp") },
  ]

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/wedding-logo.png"
                  alt="Varnie & Biraveen Wedding Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="block">
                <span className="font-serif text-lg sm:text-xl font-semibold text-card-foreground tracking-wide">
                  Varnie & Biraveen
                </span>
                <div className="text-xs text-muted-foreground font-sans italic">March 2026 • Cyprus</div>
              </div>
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

          <div className="text-center mb-6 pb-4 border-b border-border">
            <div className="font-serif text-lg font-semibold text-card-foreground tracking-wide">Varnie & Biraveen</div>
            <div className="text-sm text-muted-foreground font-sans italic mt-1">March 2026 • Cyprus</div>
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
