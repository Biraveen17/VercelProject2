"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart, MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { getSettings } from "@/lib/database"

export default function HomePage() {
  const { t } = useLanguage()
  const [proposalPhotos, setProposalPhotos] = useState<{ photo1: string | null; photo2: string | null }>({
    photo1: null,
    photo2: null,
  })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    const settings = getSettings()

    const fetchProposalPhotos = async () => {
      try {
        const response = await fetch("/api/list-blobs")
        const data = await response.json()

        const proposalPhoto1 = data.files?.find(
          (file: any) =>
            file.filename?.toLowerCase().includes("proposalphoto1") ||
            file.pathname?.toLowerCase().includes("proposalphoto1"),
        )

        const proposalPhoto2 = data.files?.find(
          (file: any) =>
            file.filename?.toLowerCase().includes("proposalphoto2") ||
            file.pathname?.toLowerCase().includes("proposalphoto2"),
        )

        setProposalPhotos({
          photo1: proposalPhoto1?.url || null,
          photo2: proposalPhoto2?.url || null,
        })
      } catch (error) {
        console.error("Error fetching proposal photos:", error)
      }
    }

    fetchProposalPhotos()
  }, [])

  useEffect(() => {
    if (proposalPhotos.photo1 || proposalPhotos.photo2) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev === 0 ? 1 : 0))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [proposalPhotos])

  const getCurrentPhoto = () => {
    if (currentPhotoIndex === 0 && proposalPhotos.photo1) {
      return proposalPhotos.photo1
    } else if (currentPhotoIndex === 1 && proposalPhotos.photo2) {
      return proposalPhotos.photo2
    }
    return proposalPhotos.photo1 || proposalPhotos.photo2 || "/wedding-logo.png"
  }

  return (
    <div className="min-h-screen floral-background scroll-smooth" style={{ scrollSnapType: "y mandatory" }}>
      <section className="relative py-20 px-4" style={{ scrollSnapAlign: "start" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative mx-auto mb-6 max-w-4xl">
              {proposalPhotos.photo1 || proposalPhotos.photo2 ? (
                <div className="relative">
                  <img
                    src={getCurrentPhoto() || "/placeholder.svg"}
                    alt="Proposal photos"
                    className="w-full h-auto rounded-lg shadow-lg transition-opacity duration-1000"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center border-2 border-primary/20">
                  <p className="text-muted-foreground font-serif">Loading proposal photos...</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <h1 className="island-moments text-5xl md:text-7xl font-bold text-primary mb-18">Varnie & Biraveen</h1>
            <div className="script text-3xl md:text-4xl text-secondary mb-18">Wedding Invitation</div>
            <p className="text-xl md:text-2xl text-foreground mb-12 spaced-letters font-serif">{t("homeSubtitle")}</p>
          </div>

          <div className="mb-8 p-6 decorative-border rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 relative">
              {/* Wedding Information - Left Side */}
              <div className="text-center">
                <div className="spaced-letters text-lg font-serif text-secondary mb-2">wedding ceremony</div>
                <div className="spaced-letters text-lg font-serif text-secondary mb-2">march 27th 2026</div>
                <div className="text-sm text-muted-foreground mb-2">at 9 am</div>
              </div>

              {/* Vertical Divider Line for desktop */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 transform -translate-x-1/2 hidden md:block"></div>

              {/* Horizontal Divider Line for mobile */}
              <div className="w-full h-px bg-primary/30 md:hidden"></div>

              {/* Reception Information - Right Side */}
              <div className="text-center">
                <div className="spaced-letters text-lg font-serif text-secondary mb-2">reception</div>
                <div className="spaced-letters text-lg font-serif text-secondary mb-2">march 28th 2026</div>
                <div className="text-sm text-muted-foreground mb-2">at 5 pm</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary"
            >
              <Link href="/rsvp">{t("rsvpNow")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              <Link href="/events">{t("viewEvents")}</Link>
            </Button>
          </div>

          <div className="w-full h-px bg-primary/30 mb-8" style={{ scrollSnapAlign: "start" }}></div>

          <div className="mb-8 p-6 decorative-border rounded-lg">
            <div className="text-base font-serif text-center mb-6 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary mx-auto mb-3" />
              <span>{t("welcomeTitle").toUpperCase()}</span>
              <Heart className="w-5 h-5 text-primary mx-auto mb-3" />
            </div>
            <div className="text-center space-y-4">
              <p className="text-lg leading-relaxed font-serif">{t("welcomeDescription1")}</p>
              <p className="text-lg leading-relaxed font-serif">{t("welcomeDescription2")}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-serif text-secondary mb-4 spaced-letters">{t("countdownTitle")}</h3>
            <div className="flex justify-center">
              <div className="gap-6">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ scrollSnapAlign: "start" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center decorative-border">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-serif font-semibold mb-2 spaced-letters text-sm">{t("ceremonyTitle")}</h3>
                <p className="text-sm text-muted-foreground font-serif">{t("ceremonyDate")}</p>
                <p className="text-sm text-muted-foreground font-serif">{t("ceremonyTime")}</p>
              </CardContent>
            </Card>

            <Card className="text-center decorative-border">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-serif font-semibold mb-2 spaced-letters text-sm">{t("receptionTitle")}</h3>
                <p className="text-sm text-muted-foreground font-serif">{t("receptionDate")}</p>
                <p className="text-sm text-muted-foreground font-serif">{t("receptionTime")}</p>
              </CardContent>
            </Card>

            <Card className="text-center decorative-border">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-serif font-semibold mb-2 spaced-letters text-sm">{t("locationTitle")}</h3>
                <p className="text-sm text-muted-foreground font-serif">{t("homeLocation")}</p>
                <p className="text-sm text-muted-foreground font-serif">{t("locationDescription")}</p>
              </CardContent>
            </Card>

            <Card className="text-center decorative-border">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-serif font-semibold mb-2 spaced-letters text-sm">{t("dressCodeTitle")}</h3>
                <p className="text-sm text-muted-foreground font-serif">{t("dressCodeDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30" style={{ scrollSnapAlign: "start" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12 spaced-letters">
            {t("traditionsTitle")}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-secondary">{t("sacredFireTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed font-serif">{t("sacredFireDescription")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-secondary">{t("mangalsutraTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed font-serif">{t("mangalsutraDescription")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-secondary">{t("saptapadiTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed font-serif">{t("saptapadiDescription")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-secondary">{t("ganeshTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed font-serif">{t("ganeshDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
