"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Utensils, Shirt } from "lucide-react"
import Link from "next/link"
import { PageTracker } from "@/components/page-tracker"
import { useLanguage } from "@/lib/language-context"
// </CHANGE>

export default function EventsPage() {
  const { t } = useLanguage()
  // </CHANGE>

  return (
    <div className="min-h-screen py-12 px-4">
      <PageTracker pageName="events" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="display-text mb-6">{t("eventsPageTitle")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("eventsPageSubtitle")}</p>
          {/* </CHANGE> */}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="decorative-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div>
                    <h2 className="caption-text text-primary">{t("weddingCeremonyTitle")}</h2>
                    <p className="body-text">{t("weddingCeremonySubtitle")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("fridayDate")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("weddingTime")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("baseEventVenue")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("dressCode")}</p>
                    <p className="caption-text">{t("traditionalIndianAttire")}</p>
                    <p className="caption-text">{t("vettiDhotiShirt")}</p>
                    <p className="caption-text">{t("saree")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("foodRefreshments")}</p>
                    <p className="caption-text">{t("vegetarianFood")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <p className="caption-text text-center italic">{t("ceremonyOutdoors")}</p>
                {/* </CHANGE> */}
              </div>
            </CardContent>
          </Card>

          <Card className="decorative-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div>
                    <h2 className="caption-text text-primary">{t("receptionEventTitle")}</h2>
                    <p className="body-text">{t("receptionEventSubtitle")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("saturdayDate")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("receptionTimeRange")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("baseEventVenue")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("dressCode")}</p>
                    <p className="caption-text">{t("suitBlackTie")}</p>
                    <p className="caption-text">{t("cocktailDressSareeLehenga")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">{t("foodRefreshments")}</p>
                    <p className="caption-text">{t("nonVegVegFood")}</p>
                    {/* </CHANGE> */}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <p className="caption-text text-center italic">{t("receptionIndoors")}</p>
                {/* </CHANGE> */}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 decorative-border">
          <CardHeader>
            <CardTitle className="caption-text text-primary text-center">{t("detailedScheduleTitle")}</CardTitle>
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mt-4">
              <p className="body-text text-center text-primary">{t("scheduleWarning")}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="caption-text text-primary mb-4">{t("fridayScheduleTitle")}</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1000")}</span>
                    <span className="caption-text">{t("guestArrival")}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1015")}</span>
                    <span className="caption-text">{t("ganeshPuja")}</span>
                  </div>
                  {/*<div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1100")}</span>
                    <span className="caption-text">{t("startersServed")}</span>
                  </div>*/}
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1130")}</span>
                    <span className="caption-text">{t("mainCeremony")}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1400")}</span>
                    <span className="caption-text">{t("blessingPhotography")}</span>
                  </div>
                  {/*<div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1400")}</span>
                    <span className="caption-text">{t("lunchServed")}</span>
                  </div>*/}
                </div>
              </div>
              <div>
                <h3 className="caption-text text-primary mb-4">{t("saturdayScheduleTitle")}</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1700")}</span>
                    <span className="caption-text">{t("guestArrival")}</span>
                  </div>
                  {/*<div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1730")}</span>
                    <span className="caption-text">{t("startersServed")}</span>
                  </div>*/}
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1800")}</span>
                    <span className="caption-text">{t("coupleEntrance")}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1815")}</span>
                    <span className="caption-text">{t("cakeCutting")}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time1900")}</span>
                    <span className="caption-text">{t("barOpens")}</span>
                  </div>
                  {/*<div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time2000")}</span>
                    <span className="caption-text">{t("dinnerService")}</span>
                  </div>*/}
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">{t("time2200")}</span>
                    <span className="caption-text">{t("danceFloor")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/rsvp">{t("rsvpForEvents")}</Link>
            {/* </CHANGE> */}
          </Button>
        </div>
      </div>
    </div>
  )
}
