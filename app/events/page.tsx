import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Shirt, Camera } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Wedding Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus
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

              <div className="grid md:grid-cols-2 gap-6 relative">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-serif">Friday, March 27, 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-serif">10:00 AM - 1:00 PM</span>
                  </div>
                </div>

                {/* Vertical Divider Line for desktop */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 transform -translate-x-1/2 hidden md:block"></div>

                {/* Horizontal Divider Line for mobile */}
                <div className="w-full h-px bg-primary/30 md:hidden"></div>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-serif">Beachfront Venue, Paphos</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Shirt className="w-5 h-5 text-primary" />
                    <span className="font-serif">Traditional Indian Attire</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/30">
                <h4 className="font-semibold mb-3 text-center font-serif">What to Expect:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground font-serif text-center">
                  <li>• Ganesh Puja (Blessing ceremony)</li>
                  <li>• Mangalsutra (Sacred necklace ceremony)</li>
                  <li>• Saptapadi (Seven sacred steps)</li>
                  <li>• Agni Pradakshina (Fire ceremony)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="decorative-border">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                  <div>
                    <h2 className="text-2xl font-bold text-secondary font-serif">Wedding Reception</h2>
                    <p className="text-primary font-serif">Dinner, Dancing & Celebration</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="font-serif">Saturday, March 28, 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span className="font-serif">6:00 PM - 12:00 AM</span>
                  </div>
                </div>

                {/* Vertical Divider Line for desktop */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-secondary/30 transform -translate-x-1/2 hidden md:block"></div>

                {/* Horizontal Divider Line for mobile */}
                <div className="w-full h-px bg-secondary/30 md:hidden"></div>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <span className="font-serif">Luxury Resort Ballroom, Paphos</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Shirt className="w-5 h-5 text-secondary" />
                    <span className="font-serif">Formal or Traditional Attire</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-secondary/30">
                <h4 className="font-semibold mb-3 text-center font-serif">Evening Program:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground font-serif text-center">
                  <li>• Welcome drinks & canapés</li>
                  <li>• Three-course dinner</li>
                  <li>• Traditional & modern music</li>
                  <li>• Dancing until midnight</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 decorative-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Detailed Schedule</CardTitle>
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

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="decorative-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                Dress Code Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary">Hindu Ceremony</h4>
                <p className="text-sm text-muted-foreground">
                  Traditional Indian attire preferred. Sarees, lehengas, or salwar kameez for women. Kurta pajama or
                  dhoti for men. Bright colors welcome!
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-accent">Reception</h4>
                <p className="text-sm text-muted-foreground">
                  Formal evening wear or traditional Indian attire. Cocktail dresses, suits, or Indian formal wear all
                  appropriate.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="decorative-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photography Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We welcome your photos and videos! Please share them with us using the hashtag #VarnieBiraveenWedding
              </p>
              <div>
                <h4 className="font-semibold">Unplugged Ceremony</h4>
                <p className="text-sm text-muted-foreground">
                  During the sacred rituals, we kindly ask you to put away devices and be present with us in the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/rsvp">RSVP for Our Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
