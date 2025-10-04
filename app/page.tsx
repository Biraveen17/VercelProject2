"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { Heart, MapPin, Calendar, Users, Plane, Hotel, Compass } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { PageTracker } from "@/components/page-tracker"

export default function HomePage() {
  const { t } = useLanguage()
  const [proposalPhotos, setProposalPhotos] = useState<{ photo1: string | null; photo2: string | null }>({
    photo1: null,
    photo2: null,
  })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
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
    <div className="min-h-screen">
      <PageTracker pageName="home" />

      {/* Hero Section */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto">
          {/* Photo Display */}
          <div className="mb-16">
            <div className="relative mx-auto mb-8 max-w-4xl">
              {proposalPhotos.photo1 || proposalPhotos.photo2 ? (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={getCurrentPhoto() || "/placeholder.svg"}
                    alt="Proposal photos"
                    className="w-full transition-opacity duration-1000 object-cover"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-muted/30 rounded-2xl flex items-center justify-center border border-border">
                  <p className="caption-text">Loading photos...</p>
                </div>
              )}
            </div>
          </div>

          {/* Names and Title */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="display-text island-moments">Varnie Tharmalingam<br/>&<br/>Biraveen Vijayakumar</h1>
            <div className="script text-4xl md:text-5xl text-primary">Wedding Invitation</div>
            <p className="subtitle-text max-w-2xl mx-auto">{t("homeSubtitle")}</p>
          </div>

          {/* Wedding Details */}
          <div className="mb-16">
            <div className="decorative-border rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Wedding */}
                <div className="text-center space-y-3">
                  <div className="caption-text text-primary mb-4">Wedding</div>
                  <div className="body-text text-2xl font-light">March 27th 2026</div>
                  <div className="caption-text">9:00</div>
                </div>

                {/* Vertical Divider Line for desktop */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 transform -translate-x-1/2 hidden md:block"></div>

                {/* Horizontal Divider Line for mobile */}
                <div className="w-full h-px bg-primary/30 md:hidden"></div>

                {/* Reception */}
                <div className="text-center space-y-3">
                  <div className="caption-text text-primary mb-4">Reception</div>
                  <div className="body-text text-2xl font-light">March 28th 2026</div>
                  <div className="caption-text">18:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="btn-primary text-lg px-12 py-4 rounded-full">
              <Link href="/rsvp">{t("rsvpNow")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-secondary text-lg px-12 py-4 rounded-full bg-transparent"
            >
              <Link href="/events">{t("viewEvents")}</Link>
            </Button>
          </div>

          {/* Welcome Message */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 max-w-4xl mx-auto mb-16">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-5 h-5 text-primary" />
                <span className="caption-text text-primary">{t("welcomeTitle")}</span>
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="body-text text-lg leading-relaxed">{t("welcomeDescription1")}</p>
                <p className="body-text text-lg leading-relaxed">{t("welcomeDescription2")}</p>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center mb-16">
            <h3 className="caption-text text-primary mb-8">{t("countdownTitle")}</h3>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Event Details Grid */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="decorative-border text-center p-8">
              <CardContent className="space-y-4">
                <Calendar className="w-10 h-10 text-primary mx-auto" />
                <h3 className="caption-text text-primary">{t("ceremonyTitle")}</h3>
                <div className="space-y-1">
                  <p className="body-text font-light">{t("ceremonyDate")}</p>
                  <p className="caption-text">{t("ceremonyTime")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center p-8">
              <CardContent className="space-y-4">
                <Users className="w-10 h-10 text-primary mx-auto" />
                <h3 className="caption-text text-primary">{t("receptionTitle")}</h3>
                <div className="space-y-1">
                  <p className="body-text font-light">{t("receptionDate")}</p>
                  <p className="caption-text">{t("receptionTime")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center p-8">
              <CardContent className="space-y-4">
                <MapPin className="w-10 h-10 text-primary mx-auto" />
                <h3 className="caption-text text-primary">{t("locationTitle")}</h3>
                <div className="space-y-1">
                  <p className="body-text font-light">{t("homeLocation")}</p>
                  <p className="caption-text">{t("locationDescription")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center p-8">
              <CardContent className="space-y-4">
                <Heart className="w-10 h-10 text-primary mx-auto" />
                <h3 className="caption-text text-primary">{t("dressCodeTitle")}</h3>
                <p className="caption-text">{t("dressCodeDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Travel Section */}
      <section className="section-spacing bg-muted/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Plane className="w-5 h-5 text-primary" />
              <span className="caption-text text-primary">{t("travel")}</span>
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <h2 className="display-text text-4xl md:text-5xl mb-4">{t("travelTitle")}</h2>
            <p className="subtitle-text max-w-3xl mx-auto">{t("travelSubtitle")}</p>
          </div>

          {/* Getting There */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Plane className="w-6 h-6 text-primary" />
              <h3 className="caption-text text-primary">{t("gettingThereTitle")}</h3>
            </div>
            <p className="body-text text-lg leading-relaxed mb-8">{t("gettingThereDescription")}</p>

            {/* Airports */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("sfoTitle")}</h4>
                <p className="caption-text">{t("sfoDescription")}</p>
                <p className="caption-text text-primary">{t("sfoDrive")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("oakTitle")}</h4>
                <p className="caption-text">{t("oakDescription")}</p>
                <p className="caption-text text-primary">{t("oakDrive")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("sjcTitle")}</h4>
                <p className="caption-text">{t("sjcDescription")}</p>
                <p className="caption-text text-primary">{t("sjcDrive")}</p>
              </div>
            </div>
          </div>

          {/* Accommodations */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Hotel className="w-6 h-6 text-primary" />
              <h3 className="caption-text text-primary">{t("accommodationsTitle")}</h3>
            </div>

            {/* Luxury Hotels */}
            <div className="mb-8">
              <h4 className="body-text font-semibold text-primary mb-4">{t("luxuryHotelsTitle")}</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="body-text font-semibold">{t("hotel1Name")}</h5>
                  <p className="caption-text">{t("hotel1Description")}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={t("hotel1Link")} target="_blank" rel="noopener noreferrer">
                      {t("viewWebsite")} →
                    </a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h5 className="body-text font-semibold">{t("hotel2Name")}</h5>
                  <p className="caption-text">{t("hotel2Description")}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={t("hotel2Link")} target="_blank" rel="noopener noreferrer">
                      {t("viewWebsite")} →
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mid-Range Hotels */}
            <div>
              <h4 className="body-text font-semibold text-primary mb-4">{t("midRangeHotelsTitle")}</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="body-text font-semibold">{t("hotel3Name")}</h5>
                  <p className="caption-text">{t("hotel3Description")}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={t("hotel3Link")} target="_blank" rel="noopener noreferrer">
                      {t("viewWebsite")} →
                    </a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <h5 className="body-text font-semibold">{t("hotel4Name")}</h5>
                  <p className="caption-text">{t("hotel4Description")}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <a href={t("hotel4Link")} target="_blank" rel="noopener noreferrer">
                      {t("viewWebsite")} →
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Things to Do */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-primary" />
              <h3 className="caption-text text-primary">{t("thingsToDoTitle")}</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity1Title")}</h4>
                <p className="caption-text">{t("activity1Description")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity2Title")}</h4>
                <p className="caption-text">{t("activity2Description")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity3Title")}</h4>
                <p className="caption-text">{t("activity3Description")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity4Title")}</h4>
                <p className="caption-text">{t("activity4Description")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity5Title")}</h4>
                <p className="caption-text">{t("activity5Description")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="body-text font-semibold text-primary">{t("activity6Title")}</h4>
                <p className="caption-text">{t("activity6Description")}</p>
              </div>
            </div>
          </div>

          {/* Transportation & Tips */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="decorative-border rounded-2xl p-8">
              <h3 className="caption-text text-primary mb-4">{t("transportationTitle")}</h3>
              <p className="body-text leading-relaxed">{t("transportationDescription")}</p>
            </div>
            <div className="decorative-border rounded-2xl p-8">
              <h3 className="caption-text text-primary mb-4">{t("travelTipsTitle")}</h3>
              <p className="body-text leading-relaxed">{t("travelTipsDescription")}</p>
            </div>
          </div>

          {/* View Full Travel Page CTA */}
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-secondary text-lg px-12 py-4 rounded-full bg-transparent"
            >
              <Link href="/travel">{t("viewTravelInfo")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
