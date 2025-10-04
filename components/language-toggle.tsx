"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ta" : "en")}
      className="caption-text"
    >
      {language === "en" ? "தமிழ்" : "EN"}
    </Button>
  )
}
