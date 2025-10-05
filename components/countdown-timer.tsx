"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const { t } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const weddingDate = new Date("2026-03-27T10:00:00")

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
      <Card className="text-center">
        <CardContent className="p-6 aspect-square flex flex-col justify-center">
          <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.days}</div>
          <div className="text-base md:text-lg text-muted-foreground mt-2">{t("days")}</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-6 aspect-square flex flex-col justify-center">
          <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.hours}</div>
          <div className="text-base md:text-lg text-muted-foreground mt-2">{t("hours")}</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-6 aspect-square flex flex-col justify-center">
          <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.minutes}</div>
          <div className="text-base md:text-lg text-muted-foreground mt-2">{t("minutes")}</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-6 aspect-square flex flex-col justify-center">
          <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.seconds}</div>
          <div className="text-base md:text-lg text-muted-foreground mt-2">{t("seconds")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
