import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Plane, Hotel, Utensils, Camera } from "lucide-react"

export default function VenuePage() {
  return (
    <div className="min-h-screen py-12 px-4 floral-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Venue & Location</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the beautiful venue in Paphos, Cyprus where we'll celebrate our special day
          </p>
        </div>

        {/* Main Venue */}
        <div className="flex justify-center mb-12">
          <Card className="w-full">
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-center">Wedding & Reception Venue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Base Event Venue</p>
                  <p className="text-sm text-muted-foreground">Paphos, Cyprus</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A stunning venue that will host both our Hindu ceremony and reception celebration. The perfect setting
                for our special day with beautiful facilities and scenic surroundings.
              </p>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Facilities:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ceremony and reception areas</li>
                  <li>• Parking available on-site</li>
                  <li>• Accessible facilities</li>
                  <li>• Professional sound system</li>
                  <li>• Full catering facilities</li>
                  <li>• Dance floor and entertainment area</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maps Section */}
        <div className="flex justify-center mb-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl text-center">Venue Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.8!2d32.4!3d34.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e7330661110227%3A0x0!2sAirport%20Road%2C%20Paphos%208507%2C%20Cyprus!5e1!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Base Event Venue Location"
                  ></iframe>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Address:</strong> Base Event Venue, Airport Road, Paphos 8507, Cyprus
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Click and drag to explore the map. Use the fullscreen button to enlarge the view.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting There */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Getting to Cyprus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">By Air</h3>
                <p className="text-sm text-muted-foreground">
                  Paphos International Airport (PFO) is just 20 minutes from our venues. Direct flights available from
                  major UK cities.
                </p>
              </div>
              <div className="text-center">
                <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Airport Transfer</h3>
                <p className="text-sm text-muted-foreground">
                  Taxis, rental cars, and shuttle services available. We recommend booking transfers in advance during
                  peak season.
                </p>
              </div>
              <div className="text-center">
                <Hotel className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Local Transport</h3>
                <p className="text-sm text-muted-foreground">
                  Both venues are easily accessible by taxi or rental car. Free shuttle service between ceremony and
                  reception venues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Directions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Driving Directions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary">From Paphos Airport:</h4>
                <ol className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>1. Exit airport and follow signs to Paphos city center</li>
                  <li>2. Follow directions to Base Event Venue</li>
                  <li>3. Venue hosts both ceremony and reception</li>
                </ol>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-semibold">Parking Information:</h4>
                <p className="text-sm text-muted-foreground">Free parking available at the venue for all guests.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Utensils className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Nearby Restaurants</h4>
                  <p className="text-sm text-muted-foreground">
                    Coral Bay has numerous tavernas and restaurants within walking distance of both venues.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hotel className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Accommodation</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple hotels and resorts in the area. See our Travel page for recommended accommodations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Attractions</h4>
                  <p className="text-sm text-muted-foreground">
                    Beautiful beaches, archaeological sites, and the charming Paphos harbor are all nearby.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <a href="/travel">View Travel Information</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
