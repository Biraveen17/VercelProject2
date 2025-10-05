"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { PageTracker } from "@/components/page-tracker"

export default function VenuePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-12 px-4">
      <PageTracker pageName="venue" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="display-text mb-6">
            {t("locationTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("venueDescription")}</p>
        </div>

        {/* Main Venue */}
        <div className="flex justify-center mb-12">
          <div className="max-w-2xl mx-auto w-full bg-card rounded-lg shadow-sm border overflow-hidden">
            <div className="aspect-video bg-muted overflow-hidden">
              <img src="/api/blob/baseeventvenue1" alt="Base Event Venue" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-center mb-4">{t("weddingReceptionVenue")}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Base Event Venue</p>
                    <p className="text-sm text-muted-foreground">Paphos, Cyprus</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t("venueDescription2")}</p>
                {/*<div className="pt-4">
                  <h4 className="font-semibold mb-2">{t("facilities")}:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t("ceremonyReceptionAreas")}</li>
                    <li>• {t("parkingAvailable")}</li>
                    <li>• {t("accessibleFacilities")}</li>
                    <li>• {t("professionalSound")}</li>
                    <li>• {t("fullCatering")}</li>
                    <li>• {t("danceFloor")}</li>
                  </ul>
                </div>*/}
              </div>
            </div>
          </div>
        </div>

        {/* Maps Section */}
        <div className="flex justify-center mb-8">
          <Card className="max-w-2xl mx-auto w-full">
            <CardHeader>
              <CardTitle className="text-xl text-center">{t("venueLocation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.8!2d32.4!3d34.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPG43%2BW6%20Paphos%2C%20Cyprus!5e1!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Base Event Venue Location"
                    className="touch-auto"
                  ></iframe>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  <strong>{t("address")}:</strong> Base Event Venue, Airport Road, Paphos 8507, Cyprus
                </p>
                <p className="text-xs text-muted-foreground text-center">{t("mapInstructions")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
