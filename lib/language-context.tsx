"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Translation } from "./translations"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: keyof Translation, params?: Record<string, any>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("wedding_language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang)
      localStorage.setItem("wedding_language", lang)
    }
  }

  const t = (key: keyof Translation, params?: Record<string, any>): string => {
    const translation = translations[language] || translations.en
    let text = translation[key] || key

    // Replace parameters in the text if provided
    if (params) {
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, String(params[param]))
      })
    }

    return text
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
