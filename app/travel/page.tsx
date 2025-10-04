"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, MapPin, Wine, Utensils, Camera, Sun } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"

export default function TravelPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen section-spacing">
      <PageTracker pageName="travel" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-text mb-6">{t("travelTitle")}</h1>
          <p className="subtitle-text max-w-3xl mx-auto">{t("travelSubtitle")}</p>
        </div>

        {/* Getting There */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("gettingThereTitle")}</h2>
            <p className="body-text max-w-3xl mx-auto text-muted-foreground">{t("gettingThereDescription")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 caption-text text-primary">
                  <Plane className="w-6 h-6" />
                  {t("sfoTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="body-text text-sm">{t("sfoDescription")}</p>
                <div className="pt-2 border-t border-border">
                  <p className="caption-text text-primary">{t("sfoDrive")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 caption-text text-primary">
                  <Plane className="w-6 h-6" />
                  {t("oakTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="body-text text-sm">{t("oakDescription")}</p>
                <div className="pt-2 border-t border-border">
                  <p className="caption-text text-primary">{t("oakDrive")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="decorative-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 caption-text text-primary">
                  <Plane className="w-6 h-6" />
                  {t("sjcTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="body-text text-sm">{t("sjcDescription")}</p>
                <div className="pt-2 border-t border-border">
                  <p className="caption-text text-primary">{t("sjcDrive")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transportation */}
          <Card className="decorative-border mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 caption-text text-primary">
                <Car className="w-6 h-6" />
                {t("transportationTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="body-text leading-relaxed">{t("transportationDescription")}</p>
            </CardContent>
          </Card>
        </section>

        {/* Accommodations */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("accommodationsTitle")}</h2>
          </div>

          {/* Luxury Hotels */}
          <div className="mb-12">
            <h3 className="caption-text text-primary mb-6 text-center">{t("luxuryHotelsTitle")}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="decorative-border">
                <CardHeader>
                  <CardTitle className="caption-text text-primary">{t("hotel1Name")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="body-text text-sm">{t("hotel1Description")}</p>
                  <Button asChild variant="outline" className="w-full btn-secondary bg-transparent">
                    <a href={t("hotel1Link")} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-2" />
                      {t("viewWebsite")}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="decorative-border">
                <CardHeader>
                  <CardTitle className="caption-text text-primary">{t("hotel2Name")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="body-text text-sm">{t("hotel2Description")}</p>
                  <Button asChild variant="outline" className="w-full btn-secondary bg-transparent">
                    <a href={t("hotel2Link")} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-2" />
                      {t("viewWebsite")}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mid-Range Hotels */}
          <div>
            <h3 className="caption-text text-primary mb-6 text-center">{t("midRangeHotelsTitle")}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="decorative-border">
                <CardHeader>
                  <CardTitle className="caption-text text-primary">{t("hotel3Name")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="body-text text-sm">{t("hotel3Description")}</p>
                  <Button asChild variant="outline" className="w-full btn-secondary bg-transparent">
                    <a href={t("hotel3Link")} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-2" />
                      {t("viewWebsite")}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="decorative-border">
                <CardHeader>
                  <CardTitle className="caption-text text-primary">{t("hotel4Name")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="body-text text-sm">{t("hotel4Description")}</p>
                  <Button asChild variant="outline" className="w-full btn-secondary bg-transparent">
                    <a href={t("hotel4Link")} target="_blank" rel="noopener noreferrer">
                      <Hotel className="w-4 h-4 mr-2" />
                      {t("viewWebsite")}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Things to Do */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light mb-4">{t("thingsToDoTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Wine className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity1Title")}</h3>
                <p className="body-text text-sm">{t("activity1Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity2Title")}</h3>
                <p className="body-text text-sm">{t("activity2Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity3Title")}</h3>
                <p className="body-text text-sm">{t("activity3Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity4Title")}</h3>
                <p className="body-text text-sm">{t("activity4Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity5Title")}</h3>
                <p className="body-text text-sm">{t("activity5Description")}</p>
              </CardContent>
            </Card>

            <Card className="decorative-border text-center">
              <CardContent className="p-8">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="caption-text text-primary mb-3">{t("activity6Title")}</h3>
                <p className="body-text text-sm">{t("activity6Description")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mb-20">
          <Card className="decorative-border">
            <CardHeader>
              <CardTitle className="caption-text text-primary text-center">{t("travelTipsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="body-text leading-relaxed text-center max-w-4xl mx-auto">{t("travelTipsDescription")}</p>
            </CardContent>
          </Card>
        </section>

        {/* Questions CTA */}
        <section>
          <Card className="decorative-border bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-serif font-light mb-4">{t("questionsTitle")}</h2>
              <p className="body-text text-muted-foreground mb-8 max-w-2xl mx-auto">{t("questionsDescription")}</p>
              <Button asChild size="lg" className="btn-primary">
                <Link href="/rsvp">{t("rsvpNow")}</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
