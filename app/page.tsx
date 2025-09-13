"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src="/wedding-logo.png"
                alt="Varnie & Biraveen Wedding Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Sacred Om symbol */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl text-primary-foreground">🕉️</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 text-balance">{t("homeTitle")}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 text-balance">{t("homeSubtitle")}</p>
          <p className="text-lg text-card-foreground mb-8">{t("homeDescription")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/rsvp">{t("rsvpNow")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/events">{t("viewEvents")}</Link>
            </Button>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">{t("countdownTitle")}</h3>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-accent" />
                {t("welcomeTitle")}
                <Heart className="w-6 h-6 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg leading-relaxed">{t("welcomeDescription1")}</p>
              <p className="text-lg leading-relaxed">{t("welcomeDescription2")}</p>
            </CardContent>
          </Card>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("ceremonyTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("ceremonyDate")}</p>
                <p className="text-sm text-muted-foreground">{t("ceremonyTime")}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("receptionTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("receptionDate")}</p>
                <p className="text-sm text-muted-foreground">{t("receptionTime")}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("locationTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("homeLocation")}</p>
                <p className="text-sm text-muted-foreground">{t("locationDescription")}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t("dressCodeTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("dressCodeDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hindu Traditions Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t("traditionsTitle")}</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("sacredFireTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{t("sacredFireDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("mangalsutraTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{t("mangalsutraDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("saptapadiTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{t("saptapadiDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("ganeshTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{t("ganeshDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">{t("loveStoryTitle")}</h2>
          <Card>
            <CardContent className="p-8">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Wedding Video Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
