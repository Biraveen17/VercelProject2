import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, MapPin, Sun, Utensils, Camera, Phone } from "lucide-react"

export default function TravelPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Travel to Cyprus</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus
          </p>
        </div>

        {/* Getting There */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Getting There</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  Flights to Cyprus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Paphos Airport (PFO)</h4>
                  <p className="text-sm text-muted-foreground">
                    Main airport serving Paphos, just 20 minutes from our venues.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Direct Flights From:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• London (3.5 hours)</li>
                    <li>• Manchester (4 hours)</li>
                    <li>• Copenhagen (4 hours)</li>
                    <li>• Other major European cities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Airlines:</h4>
                  <p className="text-sm text-muted-foreground">British Airways, easyJet, Ryanair, SAS, TUI</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Airport Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Taxi Service</h4>
                  <p className="text-sm text-muted-foreground">
                    Available 24/7, approximately €25-30 to Paphos/Coral Bay area.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Car Rental</h4>
                  <p className="text-sm text-muted-foreground">
                    Major companies available at airport. Driving is on the left side.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Shuttle Services</h4>
                  <p className="text-sm text-muted-foreground">Pre-book shared shuttles for budget-friendly option.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Local Transport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Between Venues</h4>
                  <p className="text-sm text-muted-foreground">
                    Free shuttle service provided between ceremony and reception venues.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Local Buses</h4>
                  <p className="text-sm text-muted-foreground">Regular service connecting Paphos and Coral Bay.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Taxis</h4>
                  <p className="text-sm text-muted-foreground">Readily available, or book through hotel concierge.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accommodation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Where to Stay</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Luxury Resorts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary">Coral Beach Hotel & Resort</h4>
                  <p className="text-sm text-muted-foreground">5-star beachfront resort, 5 minutes from venues</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Constantinou Bros Athena Beach</h4>
                  <p className="text-sm text-muted-foreground">Adults-only luxury resort with spa facilities</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Elysium Hotel</h4>
                  <p className="text-sm text-muted-foreground">Elegant 5-star hotel with private beach</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mid-Range Hotels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary">Coral Bay Resort</h4>
                  <p className="text-sm text-muted-foreground">Family-friendly resort with pools and activities</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Corallia Beach Hotel</h4>
                  <p className="text-sm text-muted-foreground">Comfortable accommodation near the beach</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Paphos Gardens Hotel</h4>
                  <p className="text-sm text-muted-foreground">Boutique hotel in Paphos town center</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary">Vacation Rentals</h4>
                  <p className="text-sm text-muted-foreground">Apartments and villas available through Airbnb</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Paphos Youth Hostel</h4>
                  <p className="text-sm text-muted-foreground">Budget-friendly accommodation for younger guests</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Local Guesthouses</h4>
                  <p className="text-sm text-muted-foreground">Authentic Cypriot hospitality at great prices</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Essential Travel Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Travel Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Passport & Visa
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Valid passport required. EU citizens need no visa. UK citizens can stay 90 days visa-free.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Currency</h4>
                  <p className="text-sm text-muted-foreground">
                    Euro (€). Credit cards widely accepted. ATMs available throughout Paphos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Language</h4>
                  <p className="text-sm text-muted-foreground">
                    Greek and Turkish are official languages. English is widely spoken in tourist areas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather & Packing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    March Weather
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pleasant spring weather, 18-22°C (64-72°F). Mostly sunny with occasional light rain.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">What to Pack</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Light layers for varying temperatures</li>
                    <li>• Comfortable walking shoes</li>
                    <li>• Sunscreen and sunglasses</li>
                    <li>• Light jacket for evenings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Things to Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Cyprus</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Archaeological Sites</h3>
                <p className="text-sm text-muted-foreground">
                  Visit the Tombs of the Kings and Paphos Archaeological Park
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Beautiful Beaches</h3>
                <p className="text-sm text-muted-foreground">Coral Bay and Lara Beach offer stunning coastlines</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Local Cuisine</h3>
                <p className="text-sm text-muted-foreground">Try traditional meze, halloumi, and local wines</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Paphos Harbor</h3>
                <p className="text-sm text-muted-foreground">Charming waterfront with restaurants and shops</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Planning Your Trip?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're here to help make your journey to Cyprus as smooth as possible. Don't hesitate to reach out with any
              questions about travel, accommodation, or local recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" size="lg">
                <Hotel className="w-4 h-4 mr-2" />
                Hotel Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
