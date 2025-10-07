"use client"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { PageTracker } from "@/components/page-tracker"
import Image from "next/image"

export default function HomePage() {
  const { t } = useLanguage()
  const [proposalPhotos, setProposalPhotos] = useState<{ photo1: string | null; photo2: string | null }>({
    photo1: null,
    photo2: null,
  })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching proposal photos:", error)
        setIsLoading(false)
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
                  <Image
                    src={getCurrentPhoto() || "/placeholder.svg"}
                    alt="Proposal photos"
                    width={1600}
                    height={900}
                    priority
                    className="w-full transition-opacity duration-1000 object-cover"
                    style={{ aspectRatio: "16 / 9" }}
                    unoptimized={getCurrentPhoto()?.includes("blob.vercel-storage.com")}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-muted/30 rounded-2xl flex items-center justify-center border border-border">
                  <p className="caption-text">{isLoading ? "Loading photos..." : "No photos available"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Names and Title */}
          <div className="text-center mb-16 space-y-6">
            <div className="space-y-0">
              <h1 className="text-6xl md:text-8xl font-light cormorant-names uppercase">{t("groomFirstname")}</h1>
              <h2 className="text-2xl md:text-3xl font-light cormorant-names text-primary/80 -mt-2 uppercase">
                {t("groomSurname")}
              </h2>
            </div>
            <h1 className="display-text island-moments">&</h1>
            <div className="space-y-0">
              <h1 className="text-6xl md:text-8xl font-light cormorant-names uppercase">{t("brideFirstname")}</h1>
              <h2 className="text-2xl md:text-3xl font-light cormorant-names text-primary/80 -mt-2 uppercase">
                {t("brideSurname")}
              </h2>
            </div>
            <div className="script text-4xl md:text-5xl text-primary">Wedding Invitation</div>
            {/*<p className="subtitle-text max-w-2xl mx-auto">{t("homeSubtitle")}</p>*/}
          </div>

          {/* Welcome Message */}
          <div className="decorative-border rounded-2xl p-8 md:p-12 max-w-4xl mx-auto mb-16">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                {/*<Heart className="w-5 h-5 text-primary" />*/}
                <span className="caption-text text-primary">{t("welcomeTitle")}</span>
                {/*<Heart className="w-5 h-5 text-primary" />*/}
              </div>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="body-text text-lg leading-relaxed">{t("welcomeDescription1")}</p>
                <p className="body-text text-lg leading-relaxed">{t("welcomeDescription2")}</p>
                {/*<p className="body-text text-lg leading-relaxed">{t("welcomeDescription3")}</p>*/}
              </div>
            </div>
          </div>

          {/* Wedding Details */}
          <div className="mb-16">
            <div className="decorative-border rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Wedding */}
                <div className="text-center space-y-3">
                  <div className="caption-text text-primary mb-4">Wedding</div>
                  <div className="body-text text-2xl font-light">March 27th 2026</div>
                  <div className="caption-text">10:00</div>
                </div>

                {/* Vertical Divider Line for desktop */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 transform -translate-x-1/2 hidden md:block"></div>

                {/* Horizontal Divider Line for mobile */}
                <div className="w-full h-px bg-primary/30 md:hidden"></div>

                {/* Reception */}
                <div className="text-center space-y-3">
                  <div className="caption-text text-primary mb-4">Reception</div>
                  <div className="body-text text-2xl font-light">March 28th 2026</div>
                  <div className="caption-text">17:00</div>
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

          {/* Countdown */}
          <div className="text-center mb-16">
            <h3 className="caption-text text-primary mb-8">{t("countdownTitle")}</h3>
            <CountdownTimer />
          </div>
        </div>
      </section>
    </div>
  )
}
