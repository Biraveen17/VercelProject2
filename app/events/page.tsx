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
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">🕉️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary font-serif">Hindu Wedding Ceremony</h2>
                    <p className="text-secondary font-serif">Traditional Tamil Hindu Rituals</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Friday, March 27, 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">10:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Base Event Venue</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Dress Code</p>
                    <p className="text-sm text-muted-foreground">Traditional Indian Attire</p>
                    <p className="text-sm text-muted-foreground">Vetti/Dhoti and shirt for men</p>
                    <p className="text-sm text-muted-foreground">Saree for women</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Food & Refreshments</p>
                    <p className="text-sm text-muted-foreground">Short eats for starters</p>
                    <p className="text-sm text-muted-foreground">Vegetarian lunch and dessert</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <p className="text-sm text-muted-foreground text-center italic">
                  The ceremony will be held outdoors weather permitting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="decorative-border">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary font-serif">Wedding Reception</h2>
                    <p className="text-primary font-serif">Dinner, Dancing & Celebration</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Saturday, March 28, 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">6:00 PM - 2:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Base Event Venue</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shirt className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Dress Code</p>
                    <p className="text-sm text-muted-foreground">Black tie optional</p>
                    <p className="text-sm text-muted-foreground">Cocktail dresses, suits, saree, or lehenga</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Food & Refreshments</p>
                    <p className="text-sm text-muted-foreground">Non-vegetarian and vegetarian options</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-secondary/30">
                <p className="text-sm text-muted-foreground text-center italic">The reception will be held indoors</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 decorative-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Detailed Schedule</CardTitle>
            <div className="bg-accent/20 border-2 border-accent rounded-lg p-4 mt-4">
              <p className="text-center font-semibold text-accent">
                ⚠️ Please note: The schedule below is a rough estimate and may change
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Friday, March 27 - Ceremony Day</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="font-medium text-primary w-20">9:30 AM</span>
                    <span>Guest arrival & welcome</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-primary w-20">10:00 AM</span>
                    <span>Ganesh Puja begins</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-primary w-20">11:00 AM</span>
                    <span>Main ceremony rituals</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-primary w-20">12:30 PM</span>
                    <span>Blessing & photography</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-primary w-20">1:00 PM</span>
                    <span>Light refreshments</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent mb-4">Saturday, March 28 - Reception</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="font-medium text-accent w-20">6:00 PM</span>
                    <span>Cocktail hour begins</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-accent w-20">7:30 PM</span>
                    <span>Couple's entrance</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-accent w-20">8:00 PM</span>
                    <span>Dinner service</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-accent w-20">9:30 PM</span>
                    <span>Speeches & toasts</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-medium text-accent w-20">10:00 PM</span>
                    <span>Dancing begins</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/rsvp">RSVP for Our Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
