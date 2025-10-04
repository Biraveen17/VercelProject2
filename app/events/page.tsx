import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Utensils, Shirt } from "lucide-react"
import Link from "next/link"
import { PageTracker } from "@/components/page-tracker"

export default function EventsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <PageTracker pageName="events" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Wedding Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for two beautiful days of celebration at Base Event Venue
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="decorative-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">🕉️</div>
                  <div>
                    <h2 className="caption-text text-primary">Hindu Wedding Ceremony</h2>
                    <p className="body-text">Traditional Tamil Hindu Rituals</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Friday, March 27, 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">10:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Base Event Venue</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Dress Code</p>
                    <p className="caption-text">Traditional Indian Attire</p>
                    <p className="caption-text">Vetti/Dhoti and shirt for men</p>
                    <p className="caption-text">Saree for women</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Food & Refreshments</p>
                    <p className="caption-text">Short eats for starters</p>
                    <p className="caption-text">Vegetarian lunch and dessert</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <p className="caption-text text-center italic">The ceremony will be held outdoors weather permitting</p>
              </div>
            </CardContent>
          </Card>

          <Card className="decorative-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h2 className="caption-text text-primary">Wedding Reception</h2>
                    <p className="body-text">Dinner, Dancing & Celebration</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Saturday, March 28, 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">6:00 PM - 2:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Base Event Venue</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Dress Code</p>
                    <p className="caption-text">Black tie optional</p>
                    <p className="caption-text">Cocktail dresses, suits, saree, or lehenga</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="body-text">Food & Refreshments</p>
                    <p className="caption-text">Non-vegetarian and vegetarian options</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <p className="caption-text text-center italic">The reception will be held indoors</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 decorative-border">
          <CardHeader>
            <CardTitle className="caption-text text-primary text-center">Detailed Schedule</CardTitle>
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mt-4">
              <p className="body-text text-center text-primary">
                ⚠️ Please note: The schedule below is a rough estimate and may change
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="caption-text text-primary mb-4">Friday, March 27 - Ceremony Day</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">9:30 AM</span>
                    <span className="caption-text">Guest arrival & welcome</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">10:00 AM</span>
                    <span className="caption-text">Ganesh Puja begins</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">11:00 AM</span>
                    <span className="caption-text">Main ceremony rituals</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">12:30 PM</span>
                    <span className="caption-text">Blessing & photography</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">1:00 PM</span>
                    <span className="caption-text">Light refreshments</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="caption-text text-primary mb-4">Saturday, March 28 - Reception</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">6:00 PM</span>
                    <span className="caption-text">Cocktail hour begins</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">7:30 PM</span>
                    <span className="caption-text">Couple's entrance</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">8:00 PM</span>
                    <span className="caption-text">Dinner service</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">9:30 PM</span>
                    <span className="caption-text">Speeches & toasts</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="body-text text-primary w-20">10:00 PM</span>
                    <span className="caption-text">Dancing begins</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </CHANGE> */}

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/rsvp">RSVP for Our Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
