import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Plane, Hotel, Utensils, Camera } from "lucide-react"

export default function VenuePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Venue & Location</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day
          </p>
        </div>

        {/* Main Venues */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Hindu Ceremony Venue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Beachfront Pavilion</p>
                  <p className="text-sm text-muted-foreground">Coral Bay Beach, Paphos, Cyprus</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A stunning beachfront location with panoramic views of the Mediterranean Sea. The ceremony will take
                place in a beautifully decorated pavilion with the sound of waves as our backdrop.
              </p>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Facilities:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Covered pavilion for ceremony</li>
                  <li>• Parking available on-site</li>
                  <li>• Accessible facilities</li>
                  <li>• Professional sound system</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Reception Venue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium">Luxury Resort Ballroom</p>
                  <p className="text-sm text-muted-foreground">Paphos Luxury Resort, Paphos, Cyprus</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                An elegant ballroom with crystal chandeliers and floor-to-ceiling windows overlooking the resort
                gardens. The perfect setting for an unforgettable evening celebration.
              </p>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Facilities:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Air-conditioned ballroom</li>
                  <li>• Full bar and catering kitchen</li>
                  <li>• Dance floor and stage</li>
                  <li>• Valet parking service</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maps Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Location Maps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Ceremony Location</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> Coral Bay Beach, Coral Bay Avenue, Paphos 8099, Cyprus
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Reception Location</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> Paphos Luxury Resort, Poseidonos Avenue, Paphos 8042, Cyprus
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <li>1. Exit airport and follow signs to Paphos/Coral Bay</li>
                  <li>2. Take B6 road towards Coral Bay (15 minutes)</li>
                  <li>3. Follow signs to Coral Bay Beach for ceremony venue</li>
                  <li>4. Reception venue is 5 minutes from ceremony location</li>
                </ol>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-semibold">Parking Information:</h4>
                <p className="text-sm text-muted-foreground">
                  Free parking available at both venues. Valet service provided at reception venue.
                </p>
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
