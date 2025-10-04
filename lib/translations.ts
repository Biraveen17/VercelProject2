export interface Translation {
  // Navigation
  home: string
  events: string
  venue: string
  gallery: string
  travel: string
  rsvp: string

  // Common
  loading: string
  save: string
  cancel: string
  edit: string
  delete: string
  back: string
  next: string
  submit: string
  login: string
  logout: string

  // Home page
  homeTitle: string
  homeSubtitle: string
  homeDescription: string
  homeLocation: string
  rsvpNow: string
  viewEvents: string
  countdownTitle: string
  days: string
  hours: string
  minutes: string
  seconds: string
  welcomeTitle: string
  welcomeDescription1: string
  welcomeDescription2: string
  ceremonyTitle: string
  ceremonyDate: string
  ceremonyTime: string
  receptionTitle: string
  receptionDate: string
  receptionTime: string
  locationTitle: string
  locationDescription: string
  dressCodeTitle: string
  dressCodeDescription: string
  loveStoryTitle: string

  // Events page
  eventsPageTitle: string
  eventsPageSubtitle: string
  weddingCeremonyTitle: string
  weddingCeremonySubtitle: string
  receptionEventTitle: string
  receptionEventSubtitle: string
  fridayDate: string
  saturdayDate: string
  weddingTime: string
  receptionTimeRange: string
  baseEventVenue: string
  dressCode: string
  traditionalIndianAttire: string
  vettiDhotiShirt: string
  saree: string
  suitBlackTie: string
  cocktailDressSareeLehenga: string
  foodRefreshments: string
  vegetarianFood: string
  nonVegVegFood: string
  ceremonyOutdoors: string
  receptionIndoors: string
  detailedScheduleTitle: string
  scheduleWarning: string
  fridayScheduleTitle: string
  saturdayScheduleTitle: string
  time1000: string
  time1015: string
  time1100: string
  time1130: string
  time1400: string
  time1700: string
  time1730: string
  time1800: string
  time1815: string
  time1900: string
  time2000: string
  time2200: string
  guestArrival: string
  ganeshPuja: string
  startersServed: string
  mainCeremony: string
  blessingPhotography: string
  lunchServed: string
  coupleEntrance: string
  cakeCutting: string
  barOpens: string
  dinnerService: string
  danceFloor: string
  rsvpForEvents: string

  // Venue page
  venueDescription: string
  venueDescription2: string
  weddingReceptionVenue: string
  facilities: string
  ceremonyReceptionAreas: string
  parkingAvailable: string
  accessibleFacilities: string
  professionalSound: string
  fullCatering: string
  danceFloor: string
  venueLocation: string
  address: string
  mapInstructions: string
  viewTravelInfo: string

  // Travel page
  travelTitle: string
  travelSubtitle: string
  gettingThereTitle: string
  gettingThereDescription: string
  airportsTitle: string
  sfoTitle: string
  sfoDescription: string
  sfoDrive: string
  oakTitle: string
  oakDescription: string
  oakDrive: string
  sjcTitle: string
  sjcDescription: string
  sjcDrive: string
  transportationTitle: string
  transportationDescription: string
  accommodationsTitle: string
  luxuryHotelsTitle: string
  midRangeHotelsTitle: string
  hotel1Name: string
  hotel1Description: string
  hotel1Link: string
  hotel2Name: string
  hotel2Description: string
  hotel2Link: string
  hotel3Name: string
  hotel3Description: string
  hotel3Link: string
  hotel4Name: string
  hotel4Description: string
  hotel4Link: string
  thingsToDoTitle: string
  activity1Title: string
  activity1Description: string
  activity2Title: string
  activity2Description: string
  activity3Title: string
  activity3Description: string
  activity4Title: string
  activity4Description: string
  activity5Title: string
  activity5Description: string
  activity6Title: string
  activity6Description: string
  travelTipsTitle: string
  travelTipsDescription: string
  questionsTitle: string
  questionsDescription: string
  viewWebsite: string

  // RSVP
  rsvpTitle: string
  rsvpSubtitle: string
  enterName: string
  namePlaceholder: string
  findGuest: string
  welcomeGuest: string
  groupBooking: string
  willYouAttend: string
  yesAttending: string
  noAttending: string
  whichEvents: string
  ceremonyEvent: string
  receptionEvent: string
  groupMemberNames: string
  memberNamePlaceholder: string
  dietaryRequirements: string
  dietaryPlaceholder: string
  questionsComments: string
  questionsPlaceholder: string
  submitRSVP: string
  thankYouTitle: string
  thankYouAttending: string
  thankYouNotAttending: string
  backToHome: string
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    home: "Home",
    events: "Events",
    venue: "Venue",
    gallery: "Gallery",
    travel: "Travel",
    rsvp: "RSVP",

    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    next: "Next",
    submit: "Submit",
    login: "Login",
    logout: "Logout",

    // Home page
    homeTitle: "Varnie Tharmalingam & Biraveen Vijayakumar",
    homeSubtitle: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
    homeDescription: "March 27-28, 2026 • Paphos, Cyprus",
    homeLocation: "Paphos, Cyprus",
    rsvpNow: "RSVP Now",
    viewEvents: "View Events",
    countdownTitle: "Countdown to Our Special Day",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    welcomeTitle: "Welcome to Our Wedding Celebration",
    welcomeDescription1:
      "We are thrilled to invite you to join us as we begin our journey together as husband and wife. Our celebration will honor the beautiful traditions of Tamil Hindu culture while creating new memories in the stunning setting of Cyprus.",
    welcomeDescription2:
      "For our non-Indian guests, we've included explanations of our customs and traditions to help you feel part of our special celebration. We can't wait to share this joyous occasion with you!",
    ceremonyTitle: "Hindu Ceremony",
    ceremonyDate: "March 27, 2026",
    ceremonyTime: "10:00 AM",
    receptionTitle: "Reception",
    receptionDate: "March 28, 2026",
    receptionTime: "6:00 PM",
    locationTitle: "Location",
    locationDescription: "Mediterranean Paradise",
    dressCodeTitle: "Dress Code",
    dressCodeDescription: "Traditional Indian or Formal Attire",
    loveStoryTitle: "Our Love Story",

    // Events page
    eventsPageTitle: "Wedding Events",
    eventsPageSubtitle: "Join us for two beautiful days of celebration at Base Event Venue",
    weddingCeremonyTitle: "Wedding Ceremony",
    weddingCeremonySubtitle: "Traditional Tamil Hindu Rituals",
    receptionEventTitle: "Reception",
    receptionEventSubtitle: "Dinner, Dancing & Celebration",
    fridayDate: "Friday, March 27, 2026",
    saturdayDate: "Saturday, March 28, 2026",
    weddingTime: "10:00 - 17:00",
    receptionTimeRange: "17:00 - Past Midnight",
    baseEventVenue: "Base Event Venue",
    dressCode: "Dress Code",
    traditionalIndianAttire: "Traditional Indian Attire",
    vettiDhotiShirt: "Vetti/Dhoti and shirt",
    saree: "Saree",
    suitBlackTie: "Suit, black tie optional",
    cocktailDressSareeLehenga: "Cocktail dress, saree, lehenga",
    foodRefreshments: "Food & Refreshments",
    vegetarianFood: "Vegetarian short eats, lunch and dessert",
    nonVegVegFood: "Non-vegetarian and vegetarian options",
    ceremonyOutdoors: "The ceremony will be held outdoors weather permitting",
    receptionIndoors: "The reception will be held indoors",
    detailedScheduleTitle: "Detailed Schedule",
    scheduleWarning: "⚠️ Please note: The schedule below is a rough estimate and may change",
    fridayScheduleTitle: "Friday, March 27 - Ceremony Day",
    saturdayScheduleTitle: "Saturday, March 28 - Reception",
    time1000: "10:00",
    time1015: "10:15",
    time1100: "11:00",
    time1130: "11:30",
    time1400: "14:00",
    time1700: "17:00",
    time1730: "17:30",
    time1800: "18:00",
    time1815: "18:15",
    time1900: "19:00",
    time2000: "20:00",
    time2200: "22:00",
    guestArrival: "Guest arrival & welcome",
    ganeshPuja: "Ganesh Puja begins",
    startersServed: "Starters served",
    mainCeremony: "Main ceremony rituals",
    blessingPhotography: "Blessing & photography",
    lunchServed: "Lunch served",
    coupleEntrance: "Couple's entrance",
    cakeCutting: "Cake cutting",
    barOpens: "Bar opens",
    dinnerService: "Dinner service",
    danceFloor: "Dance floor opens",
    rsvpForEvents: "RSVP for Our Events",

    // Venue page
    venueDescription: "Discover the beautiful venue in Paphos, Cyprus where we'll celebrate our special day",
    venueDescription2:
      "A stunning venue that will host both our Hindu ceremony and reception celebration. The perfect setting for our special day with beautiful facilities and scenic surroundings.",
    weddingReceptionVenue: "Wedding & Reception Venue",
    facilities: "Facilities",
    ceremonyReceptionAreas: "Ceremony and reception areas",
    parkingAvailable: "Parking available on-site",
    accessibleFacilities: "Accessible facilities",
    professionalSound: "Professional sound system",
    fullCatering: "Full catering facilities",
    venueLocation: "Venue Location",
    address: "Address",
    mapInstructions: "Click and drag to explore the map. Use the fullscreen button to enlarge the view.",
    viewTravelInfo: "View Travel Information",

    // Travel page
    travelTitle: "Travel & Accommodations",
    travelSubtitle: "Everything you need to know about getting to Paphos, Cyprus and where to stay",
    gettingThereTitle: "Getting to Paphos, Cyprus",
    gettingThereDescription:
      "Paphos is located on the southwest coast of Cyprus. The easiest way to reach Paphos is by flying into Paphos International Airport (PFO), which is just 15 minutes from the city center. Alternatively, you can fly into Larnaca International Airport (LCA) and drive approximately 1.5 hours to Paphos.",
    airportsTitle: "Recommended Airports",
    sfoTitle: "Paphos International Airport (PFO)",
    sfoDescription: "The closest and most convenient airport, located just 15 minutes from Paphos city center.",
    sfoDrive: "15 minutes to Paphos",
    oakTitle: "Larnaca International Airport (LCA)",
    oakDescription: "Cyprus's main international airport with more flight options from around the world.",
    oakDrive: "1 hour 30 minutes to Paphos",
    sjcTitle: "Getting from Airport",
    sjcDescription: "Taxis, rental cars, and shuttle services are readily available at both airports.",
    sjcDrive: "Pre-book for best rates",
    transportationTitle: "Transportation",
    transportationDescription:
      "We recommend renting a car for the duration of your stay, as it provides flexibility to explore Paphos and the surrounding areas. Taxis are readily available and reasonably priced. Many hotels also offer shuttle services from the airport.",
    accommodationsTitle: "Where to Stay",
    luxuryHotelsTitle: "Luxury Options",
    midRangeHotelsTitle: "Mid-Range Options",
    hotel1Name: "Coral Beach Hotel & Resort",
    hotel1Description: "Luxury 5-star resort with private beach, multiple restaurants, and world-class spa facilities.",
    hotel1Link: "https://www.coral.com.cy",
    hotel2Name: "Annabelle Hotel",
    hotel2Description: "Elegant 5-star hotel with beautiful gardens, beachfront location, and exceptional service.",
    hotel2Link: "https://www.annabelle.com.cy",
    hotel3Name: "Elysium Hotel",
    hotel3Description: "Stylish hotel with stunning sea views, multiple pools, and excellent dining options.",
    hotel3Link: "https://www.elysium.com.cy",
    hotel4Name: "Alexander The Great Beach Hotel",
    hotel4Description: "Comfortable beachfront hotel with great amenities and easy access to Paphos attractions.",
    hotel4Link: "https://www.alexanderhotel.com.cy",
    thingsToDoTitle: "Things to Do in Paphos",
    activity1Title: "Paphos Archaeological Park",
    activity1Description:
      "Explore ancient Roman villas with stunning mosaics, the Odeon amphitheater, and other historical treasures from Cyprus's rich past.",
    activity2Title: "Tombs of the Kings",
    activity2Description:
      "Visit this impressive UNESCO World Heritage site featuring underground tombs carved from solid rock dating back to the 4th century BC.",
    activity3Title: "Aphrodite's Rock",
    activity3Description:
      "See the legendary birthplace of Aphrodite, the Greek goddess of love and beauty. A stunning coastal landmark perfect for photos.",
    activity4Title: "Paphos Harbor",
    activity4Description:
      "Stroll along the picturesque harbor lined with restaurants and cafes, visit the medieval castle, and enjoy fresh seafood.",
    activity5Title: "Akamas Peninsula",
    activity5Description:
      "Discover pristine nature, hiking trails, and the famous Blue Lagoon. Perfect for adventure seekers and nature lovers.",
    activity6Title: "Local Cuisine",
    activity6Description:
      "Savor traditional Cypriot dishes like halloumi, souvlaki, meze platters, and fresh Mediterranean seafood at local tavernas.",
    travelTipsTitle: "Travel Tips",
    travelTipsDescription:
      "Book accommodations early as March is a popular time to visit Cyprus. The weather in March is typically mild and pleasant with temperatures ranging from 60-70°F (15-21°C). Cyprus uses the Euro (€) as currency. English is widely spoken in tourist areas. Remember to bring your passport and check visa requirements for Cyprus.",
    questionsTitle: "Questions About Travel?",
    questionsDescription:
      "If you have any questions about travel arrangements, accommodations, or things to do in the area, please don't hesitate to reach out through your RSVP.",
    viewWebsite: "View Website",

    // RSVP
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Please let us know if you'll be joining us for our special celebration",
    enterName: "Enter Your Name",
    namePlaceholder: "Enter your full name as it appears on the invitation",
    findGuest: "Find Guest",
    welcomeGuest: "Welcome, {name}!",
    groupBooking: "Group RSVP for up to {size} people",
    willYouAttend: "Will you be attending our wedding?",
    yesAttending: "Yes, I'll be there! 🎉",
    noAttending: "Sorry, I can't make it",
    whichEvents: "Which events will you attend?",
    ceremonyEvent: "Hindu Wedding Ceremony",
    receptionEvent: "Wedding Reception",
    groupMemberNames: "Group Member Names",
    memberNamePlaceholder: "Member {number} full name",
    dietaryRequirements: "Dietary Requirements",
    dietaryPlaceholder: "Please let us know about any allergies, dietary restrictions, or special meal preferences...",
    questionsComments: "Questions or Comments",
    questionsPlaceholder: "Do you have any questions about the wedding, travel, or accommodation? We're here to help!",
    submitRSVP: "Submit RSVP",
    thankYouTitle: "Thank You!",
    thankYouAttending: "Your RSVP has been received. We're excited to celebrate with you!",
    thankYouNotAttending: "Your RSVP has been received. We're sorry to hear you can't make it!",
    backToHome: "Back to Home",
  },

  da: {
    // Navigation
    home: "Hjem",
    events: "Begivenheder",
    venue: "Lokation",
    gallery: "Galleri",
    travel: "Rejse",
    rsvp: "RSVP",

    // Common
    loading: "Indlæser...",
    save: "Gem",
    cancel: "Annuller",
    edit: "Rediger",
    delete: "Slet",
    back: "Tilbage",
    next: "Næste",
    submit: "Send",
    login: "Log ind",
    logout: "Log ud",

    // Home page
    homeTitle: "Varnie Tharmalingam & Biraveen Vijayakumar",
    homeSubtitle: "Sammen med vores familier inviterer vi dig til at fejre vores Tamil Hindu bryllup",
    homeDescription: "27.-28. marts 2026 • Paphos, Cypern",
    homeLocation: "Paphos, Cypern",
    rsvpNow: "RSVP Nu",
    viewEvents: "Se Begivenheder",
    countdownTitle: "Nedtælling til Vores Særlige Dag",
    days: "Dage",
    hours: "Timer",
    minutes: "Minutter",
    seconds: "Sekunder",
    welcomeTitle: "Velkommen til Vores Bryllupsfejring",
    welcomeDescription1:
      "Vi er begejstrede for at invitere dig til at være med os, når vi begynder vores rejse sammen som mand og kone. Vores fejring vil ære de smukke traditioner fra Tamil Hindu-kulturen, mens vi skaber nye minder i Cyperns fantastiske omgivelser.",
    welcomeDescription2:
      "For vores ikke-indiske gæster har vi inkluderet forklaringer på vores skikke og traditioner for at hjælpe dig med at føle dig som en del af vores særlige fejring. Vi kan ikke vente med at dele denne glædelige lejlighed med dig!",
    ceremonyTitle: "Hindu Ceremoni",
    ceremonyDate: "27. marts 2026",
    ceremonyTime: "10:00",
    receptionTitle: "Reception",
    receptionDate: "28. marts 2026",
    receptionTime: "18:00",
    locationTitle: "Lokation",
    locationDescription: "Middelhavets Paradis",
    dressCodeTitle: "Påklædningskode",
    dressCodeDescription: "Traditionelt Indisk eller Formelt Tøj",
    loveStoryTitle: "Vores Kærlighedshistorie",

    // Events page
    eventsPageTitle: "Bryllupsbegivenheder",
    eventsPageSubtitle: "Deltag i to smukke dages fejring på Base Event Venue",
    weddingCeremonyTitle: "Bryllupsceremonien",
    weddingCeremonySubtitle: "Traditionelle Tamil Hindu Ritualer",
    receptionEventTitle: "Reception",
    receptionEventSubtitle: "Middag, Dans & Fejring",
    fridayDate: "Fredag, 27. marts 2026",
    saturdayDate: "Lørdag, 28. marts 2026",
    weddingTime: "10:00 - 17:00",
    receptionTimeRange: "17:00 - Efter Midnat",
    baseEventVenue: "Base Event Venue",
    dressCode: "Påklædningskode",
    traditionalIndianAttire: "Traditionelt Indisk Tøj",
    vettiDhotiShirt: "Vetti/Dhoti og skjorte",
    saree: "Saree",
    suitBlackTie: "Jakkesæt, sort slips valgfrit",
    cocktailDressSareeLehenga: "Cocktailkjole, saree, lehenga",
    foodRefreshments: "Mad & Forfriskninger",
    vegetarianFood: "Vegetariske snacks, frokost og dessert",
    nonVegVegFood: "Ikke-vegetariske og vegetariske muligheder",
    ceremonyOutdoors: "Ceremonien vil blive afholdt udendørs vejret tillader det",
    receptionIndoors: "Receptionen vil blive afholdt indendørs",
    detailedScheduleTitle: "Detaljeret Tidsplan",
    scheduleWarning: "⚠️ Bemærk venligst: Tidsplanen nedenfor er et groft skøn og kan ændre sig",
    fridayScheduleTitle: "Fredag, 27. marts - Ceremonidag",
    saturdayScheduleTitle: "Lørdag, 28. marts - Reception",
    time1000: "10:00",
    time1015: "10:15",
    time1100: "11:00",
    time1130: "11:30",
    time1400: "14:00",
    time1700: "17:00",
    time1730: "17:30",
    time1800: "18:00",
    time1815: "18:15",
    time1900: "19:00",
    time2000: "20:00",
    time2200: "22:00",
    guestArrival: "Gæsteankomst & velkomst",
    ganeshPuja: "Ganesh Puja begynder",
    startersServed: "Forretter serveres",
    mainCeremony: "Hovedceremoniens ritualer",
    blessingPhotography: "Velsignelse & fotografering",
    lunchServed: "Frokost serveres",
    coupleEntrance: "Parrets indtog",
    cakeCutting: "Kageskæring",
    barOpens: "Baren åbner",
    dinnerService: "Middag serveres",
    danceFloor: "Dansegulvet åbner",
    rsvpForEvents: "RSVP til Vores Begivenheder",

    // Venue page
    venueDescription: "Oplev den smukke lokation i Paphos, Cypern, hvor vi vil fejre vores særlige dag",
    venueDescription2:
      "En fantastisk lokation der vil vælge både vores hindu ceremoni og reception ceremoni. Det perfekte sted til vores særlige dag med smukke faciliteter og skønne omgivelser.",
    weddingReceptionVenue: "Bryllups- og Reception Lokation",
    facilities: "Faciliteter",
    ceremonyReceptionAreas: "Ceremoni- og reception områder",
    parkingAvailable: "Parkering tilgængelig på stedet",
    accessibleFacilities: "Tilgængelige faciliteter",
    professionalSound: "Professionel lydsystem",
    fullCatering: "Fulde udstilling af mad",
    venueLocation: "Lokation",
    address: "Adresse",
    mapInstructions: "Klik og træk for at udforske kortet. Brug fuldskærm-knappen til at forstør visningen.",
    viewTravelInfo: "Se Rejseinformationer",

    // Travel page
    travelTitle: "Rejse & Indkvartering",
    travelSubtitle: "Alt du behøver at vide om at komme til Paphos, Cypern og hvor du skal bo",
    gettingThereTitle: "Sådan kommer du til Paphos, Cypern",
    gettingThereDescription:
      "Paphos ligger på sydvestkysten af Cypern. Den nemmeste måde at nå Paphos på er ved at flyve til Paphos International Airport (PFO), som kun er 15 minutter fra byens centrum. Alternativt kan du flyve til Larnaca International Airport (LCA) og køre cirka 1,5 time til Paphos.",
    airportsTitle: "Anbefalede Lufthavne",
    sfoTitle: "Paphos International Airport (PFO)",
    sfoDescription: "Den tætteste og mest bekvemme lufthavn, beliggende kun 15 minutter fra Paphos bycentrum.",
    sfoDrive: "15 minutter til Paphos",
    oakTitle: "Larnaca International Airport (LCA)",
    oakDescription: "Cyperns vigtigste internationale lufthavn med flere flymuligheder fra hele verden.",
    oakDrive: "1 time 30 minutter til Paphos",
    sjcTitle: "Transport fra Lufthavn",
    sjcDescription: "Taxaer, lejebiler og shuttle-tjenester er let tilgængelige på begge lufthavne.",
    sjcDrive: "Forudbestil for bedste priser",
    transportationTitle: "Transport",
    transportationDescription:
      "Vi anbefaler at leje en bil i hele dit ophold, da det giver fleksibilitet til at udforske Paphos og de omkringliggende områder. Taxaer er let tilgængelige og rimelige i pris. Mange hoteller tilbyder også shuttle-tjenester fra lufthavnen.",
    accommodationsTitle: "Hvor skal man bo",
    luxuryHotelsTitle: "Luksus Muligheder",
    midRangeHotelsTitle: "Mellem Muligheder",
    hotel1Name: "Coral Beach Hotel & Resort",
    hotel1Description:
      "Luksus 5-stjernet resort med privat strand, flere restauranter og verdensklasse spa faciliteter.",
    hotel1Link: "https://www.coral.com.cy",
    hotel2Name: "Annabelle Hotel",
    hotel2Description: "Elegant 5-stjernet hotel med smukke haver, strandfront placering og exceptionel service.",
    hotel2Link: "https://www.annabelle.com.cy",
    hotel3Name: "Elysium Hotel",
    hotel3Description: "Stilfuldt hotel med fantastisk havudsigt, flere pools og fremragende spisemuligheder.",
    hotel3Link: "https://www.elysium.com.cy",
    hotel4Name: "Alexander The Great Beach Hotel",
    hotel4Description: "Komfortabelt strandfront hotel med gode faciliteter og let adgang til Paphos attraktioner.",
    hotel4Link: "https://www.alexanderhotel.com.cy",
    thingsToDoTitle: "Ting at lave i Paphos",
    activity1Title: "Paphos Arkæologisk Park",
    activity1Description:
      "Udforsk gamle romerske villaer med fantastiske mosaikker, Odeon amfiteatret og andre historiske skatte fra Cyperns rige fortid.",
    activity2Title: "Kongernes Grave",
    activity2Description:
      "Besøg dette imponerende UNESCO Verdensarvssted med underjordiske grave hugget ud af fast klippe fra det 4. århundrede f.Kr.",
    activity3Title: "Afrodites Klippe",
    activity3Description:
      "Se det legendariske fødested for Afrodite, den græske kærlighedsgudinde. Et fantastisk kystlandskab perfekt til fotos.",
    activity4Title: "Paphos Havn",
    activity4Description:
      "Gå en tur langs den maleriske havn med restauranter og caféer, besøg det middelalderlige slot og nyd frisk fisk og skaldyr.",
    activity5Title: "Akamas Halvøen",
    activity5Description:
      "Oplev uberørt natur, vandrestier og den berømte Blå Lagune. Perfekt for eventyrere og naturelskere.",
    activity6Title: "Lokal Madkultur",
    activity6Description:
      "Smag traditionelle cypriotiske retter som halloumi, souvlaki, meze tallerkener og frisk middelhavs fisk og skaldyr på lokale tavernaer.",
    travelTipsTitle: "Rejsetips",
    travelTipsDescription:
      "Book indkvartering tidligt, da marts er en populær tid at besøge Cypern. Vejret i marts er typisk mildt og behageligt med temperaturer fra 60-70°F (15-21°C). Cypern bruger Euro (€) som valuta. Engelsk tales bredt i turistområder. Husk at medbringe dit pas og tjek visumkrav for Cypern.",
    questionsTitle: "Spørgsmål om rejse?",
    questionsDescription:
      "Hvis du har spørgsmål om rejsearrangementer, indkvartering eller ting at lave i området, så tøv ikke med at kontakte os gennem din RSVP.",
    viewWebsite: "Se Hjemmeside",

    // RSVP
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Lad os venligst vide, om du vil være med til vores særlige fejring",
    enterName: "Indtast Dit Navn",
    namePlaceholder: "Indtast dit fulde navn, som det står på invitationen",
    findGuest: "Find Gæst",
    welcomeGuest: "Velkommen, {name}!",
    groupBooking: "Gruppetilmelding til op til {size} personer",
    willYouAttend: "Vil du deltage i vores bryllup?",
    yesAttending: "Ja, jeg kommer! 🎉",
    noAttending: "Beklager, jeg kan ikke komme",
    whichEvents: "Hvilke begivenheder vil du deltage i?",
    ceremonyEvent: "Hindu Bryllupsceremonien",
    receptionEvent: "Bryllupsreception",
    groupMemberNames: "Gruppemedlemmerens Navne",
    memberNamePlaceholder: "Medlem {number} fulde navn",
    dietaryRequirements: "Diætkrav",
    dietaryPlaceholder: "Lad os venligst vide om allergier, diætbegrænsninger eller særlige måltidspræferencer...",
    questionsComments: "Spørgsmål eller Kommentarer",
    questionsPlaceholder: "Har du spørgsmål om brylluppet, rejse eller indkvartering? Vi er her for at hjælpe!",
    submitRSVP: "Send RSVP",
    thankYouTitle: "Tak!",
    thankYouAttending: "Dit RSVP er modtaget. Vi glæder os til at fejre med dig!",
    thankYouNotAttending: "Dit RSVP er modtaget. Vi er kede af at høre, at du ikke kan komme!",
    backToHome: "Tilbage til Hjem",
  },

  ta: {
    // Navigation
    home: "முகப்பு",
    events: "நிகழ்வுகள்",
    venue: "இடம்",
    gallery: "படத்தொகுப்பு",
    travel: "பயணம்",
    rsvp: "பதில்",

    // Common
    loading: "ஏற்றுகிறது...",
    save: "சேமி",
    cancel: "ரத்து",
    edit: "திருத்து",
    delete: "நீக்கு",
    back: "பின்",
    next: "அடுத்து",
    submit: "சமர்ப்பி",
    login: "உள்நுழை",
    logout: "வெளியேறு",

    // Home page
    homeTitle: "வர்ணி & பிரவீன்",
    homeSubtitle: "எங்கள் குடும்பங்களுடன் சேர்ந்து, எங்கள் தமிழ் இந்து திருமணத்தை கொண்டாட உங்களை அழைக்கிறோம்",
    homeDescription: "மார்ச் 27-28, 2026 • பாஃபோஸ், சைப்ரஸ்",
    homeLocation: "பாஃபோஸ், சைப்ரஸ்",
    rsvpNow: "இப்போது பதிலளி",
    viewEvents: "நிகழ்வுகளைப் பார்",
    countdownTitle: "எங்கள் சிறப்பு நாளுக்கான எண்ணிக்கை",
    days: "நாட்கள்",
    hours: "மணிகள்",
    minutes: "நிமிடங்கள்",
    seconds: "விநாடிகள்",
    welcomeTitle: "எங்கள் திருமண கொண்டாட்டத்திற்கு வரவேற்கிறோம்",
    welcomeDescription1:
      "கணவன் மனைவியாக எங்கள் பயணத்தைத் தொடங்கும்போது எங்களுடன் சேர உங்களை அழைப்பதில் நாங்கள் மகிழ்ச்சியடைகிறோம். எங்கள் கொண்டாட்டம் தமிழ் இந்து கலாச்சாரத்தின் அழகான பாரம்பரியங்களை மதிக்கும் அதே வேளையில் சைப்ரஸின் அற்புதமான சூழலில் புதிய நினைவுகளை உருவாக்கும்.",
    welcomeDescription2:
      "எங்கள் இந்திய அல்லாத விருந்தினர்களுக்கு, எங்கள் சிறப்பு கொண்டாட்டத்தின் ஒரு பகுதியாக உணர உதவும் வகையில் எங்கள் பழக்கவழக்கங்கள் மற்றும் பாரம்பரியங்களின் விளக்கங்களை சேர்த்துள்ளோம். இந்த மகிழ்ச்சியான சந்தர்ப்பத்தை உங்களுடன் பகிர்ந்து கொள்ள நாங்கள் காத்திருக்க முடியாது!",
    ceremonyTitle: "இந்து சடங்கு",
    ceremonyDate: "மார்ச் 27, 2026",
    ceremonyTime: "காலை 10:00",
    receptionTitle: "வரவேற்பு",
    receptionDate: "மார்ச் 28, 2026",
    receptionTime: "மாலை 6:00",
    locationTitle: "இடம்",
    locationDescription: "மத்திய தரைக்கடல் சொர்க்கம்",
    dressCodeTitle: "உடை விதி",
    dressCodeDescription: "பாரம்பரிய இந்திய அல்லது முறையான உடை",
    loveStoryTitle: "எங்கள் காதல் கதை",

    // Events page
    eventsPageTitle: "திருமண நிகழ்வுகள்",
    eventsPageSubtitle: "பேஸ் இவென்ட் வெனுவில் இரண்டு அழகான நாட்கள் கொண்டாட்டத்தில் எங்களுடன் சேருங்கள்",
    weddingCeremonyTitle: "திருமண சடங்கு",
    weddingCeremonySubtitle: "பாரம்பரிய தமிழ் இந்து சடங்குகள்",
    receptionEventTitle: "வரவேற்பு",
    receptionEventSubtitle: "இரவு உணவு, நடனம் & கொண்டாட்டம்",
    fridayDate: "வெள்ளி, மார்ச் 27, 2026",
    saturdayDate: "சனி, மார்ச் 28, 2026",
    weddingTime: "10:00 - 17:00",
    receptionTimeRange: "17:00 - நள்ளிரவுக்கு பிறகு",
    baseEventVenue: "பேஸ் இவென்ட் வெனு",
    dressCode: "உடை விதி",
    traditionalIndianAttire: "பாரம்பரிய இந்திய உடை",
    vettiDhotiShirt: "வேட்டி/தோத்தி மற்றும் சட்டை",
    saree: "புடவை",
    suitBlackTie: "சூட், கருப்பு டை விருப்பமானது",
    cocktailDressSareeLehenga: "காக்டெய்ல் ஆடை, புடவை, லெஹங்கா",
    foodRefreshments: "உணவு & பானங்கள்",
    vegetarianFood: "சைவ சிற்றுண்டி, மதிய உணவு மற்றும் இனிப்பு",
    nonVegVegFood: "அசைவ மற்றும் சைவ விருப்பங்கள்",
    ceremonyOutdoors: "வானிலை அனுமதித்தால் சடங்கு வெளியில் நடைபெறும்",
    receptionIndoors: "வரவேற்பு உட்புறத்தில் நடைபெறும்",
    detailedScheduleTitle: "விரிவான அட்டவணை",
    scheduleWarning: "⚠️ தயவுசெய்து கவனிக்கவும்: கீழே உள்ள அட்டவணை தோராயமான மதிப்பீடு மற்றும் மாறலாம்",
    fridayScheduleTitle: "வெள்ளி, மார்ச் 27 - சடங்கு நாள்",
    saturdayScheduleTitle: "சனி, மார்ச் 28 - வரவேற்பு",
    time1000: "10:00",
    time1015: "10:15",
    time1100: "11:00",
    time1130: "11:30",
    time1400: "14:00",
    time1700: "17:00",
    time1730: "17:30",
    time1800: "18:00",
    time1815: "18:15",
    time1900: "19:00",
    time2000: "20:00",
    time2200: "22:00",
    guestArrival: "விருந்தினர் வருகை & வரவேற்பு",
    ganeshPuja: "கணேஷ் பூஜை தொடங்குகிறது",
    startersServed: "சிற்றுண்டி வழங்கப்படுகிறது",
    mainCeremony: "முக்கிய சடங்கு சடங்குகள்",
    blessingPhotography: "ஆசீர்வாதம் & புகைப்படம்",
    lunchServed: "மதிய உணவு வழங்கப்படுகிறது",
    coupleEntrance: "தம்பதியின் நுழைவு",
    cakeCutting: "கேக் வெட்டுதல்",
    barOpens: "பார் திறக்கிறது",
    dinnerService: "இரவு உணவு சேவை",
    danceFloor: "நடன தளம் திறக்கிறது",
    rsvpForEvents: "எங்கள் நிகழ்வுகளுக்கு பதிலளிக்கவும்",

    // Venue page
    venueDescription: "பாஃபோஸ், சைப்ரஸில் உள்ள அழகான இடத்தைக் கண்டறியுங்கள், அங்கு நாங்கள் எங்கள் சிறப்பு நாளைக் கொண்டாடுவோம்",
    venueDescription2:
      "எங்கள் இந்து சடங்கு மற்றும் வரவேற்பு கொண்டாட்டம் இரண்டையும் நடத்தும் ஒரு அற்புதமான இடம். அழகான வசதிகள் மற்றும் அழகிய சுற்றுப்புறங்களுடன் எங்கள் சிறப்பு நாளுக்கான சரியான அமைப்பு.",
    weddingReceptionVenue: "திருமணம் & வரவேற்பு இடம்",
    facilities: "வசதிகள்",
    ceremonyReceptionAreas: "சடங்கு மற்றும் வரவேற்பு பகுதிகள்",
    parkingAvailable: "இடத்திலேயே பார்க்கிங் கிடைக்கும்",
    accessibleFacilities: "அணுகக்கூடிய வசதிகள்",
    professionalSound: "தொழில்முறை ஒலி அமைப்பு",
    fullCatering: "முழு உணவு வசதிகள்",
    venueLocation: "இடத்தின் இருப்பிடம்",
    address: "முகவரி",
    mapInstructions: "வரைபடத்தை ஆராய கிளிக் செய்து இழுக்கவும். காட்சியை பெரிதாக்க முழுத்திரை பொத்தானைப் பயன்படுத்தவும்.",
    viewTravelInfo: "பயண தகவலைப் பார்க்கவும்",

    // Travel page
    travelTitle: "பயணம் & தங்குமிடம்",
    travelSubtitle: "பாஃபோஸ், சைப்ரஸுக்கு எப்படி செல்வது மற்றும் எங்கு தங்குவது என்பது பற்றி நீங்கள் தெரிந்து கொள்ள வேண்டிய அனைத்தும்",
    gettingThereTitle: "பாஃபோஸ், சைப்ரஸுக்கு செல்வது",
    gettingThereDescription:
      "பாஃபோஸ் சைப்ரஸின் தென்மேற்கு கடற்கரையில் அமைந்துள்ளது. பாஃபோஸுக்கு செல்ல எளிதான வழி பாஃபோஸ் சர்வதேச விமான நிலையத்திற்கு (PFO) பறப்பதாகும், இது நகர மையத்திலிருந்து வெறும் 15 நிமிடங்கள் தொலைவில் உள்ளது. மாற்றாக, நீங்கள் லார்னாகா சர்வதேச விமான நிலையத்திற்கு (LCA) பறந்து பாஃபோஸுக்கு சுமார் 1.5 மணி நேரம் ஓட்டலாம்.",
    airportsTitle: "பரிந்துரைக்கப்பட்ட விமான நிலையங்கள்",
    sfoTitle: "பாஃபோஸ் சர்வதேச விமான நிலையம் (PFO)",
    sfoDescription:
      "மிக நெருக்கமான மற்றும் மிகவும் வசதியான விமான நிலையம், பாஃபோஸ் நகர மையத்திலிருந்து வெறும் 15 நிமிடங்கள் தொலைவில் அமைந்துள்ளது.",
    sfoDrive: "பாஃபோஸுக்கு 15 நிமிடங்கள்",
    oakTitle: "லார்னாகா சர்வதேச விமான நிலையம் (LCA)",
    oakDescription: "உலகம் முழுவதிலுமிருந்து அதிக விமான விருப்பங்களுடன் சைப்ரஸின் முக்கிய சர்வதேச விமான நிலையம்.",
    oakDrive: "பாஃபோஸுக்கு 1 மணி 30 நிமிடங்கள்",
    sjcTitle: "விமான நிலையத்திலிருந்து போக்குவரத்து",
    sjcDescription: "இரண்டு விமான நிலையங்களிலும் டாக்சிகள், வாடகை கார்கள் மற்றும் ஷட்டில் சேவைகள் எளிதில் கிடைக்கின்றன.",
    sjcDrive: "சிறந்த விலைகளுக்கு முன்பதிவு செய்யுங்கள்",
    transportationTitle: "போக்குவரத்து",
    transportationDescription:
      "உங்கள் தங்குமிடத்தின் காலத்திற்கு ஒரு காரை வாடகைக்கு எடுப்பதை நாங்கள் பரிந்துரைக்கிறோம், ஏனெனில் இது பாஃபோஸ் மற்றும் சுற்றியுள்ள பகுதிகளை ஆராய நெகிழ்வுத்தன்மையை வழங்குகிறது. டாக்சிகள் எளிதில் கிடைக்கின்றன மற்றும் நியாயமான விலையில் உள்ளன. பல ஹோட்டல்கள் விமான நிலையத்திலிருந்து ஷட்டில் சேவைகளையும் வழங்குகின்றன.",
    accommodationsTitle: "எங்கு தங்குவது",
    luxuryHotelsTitle: "ஆடம்பர விருப்பங்கள்",
    midRangeHotelsTitle: "நடுத்தர விருப்பங்கள்",
    hotel1Name: "Coral Beach Hotel & Resort",
    hotel1Description: "தனியார் கடற்கரை, பல உணவகங்கள் மற்றும் உலகத் தரம் வாய்ந்த ஸ்பா வசதிகளுடன் ஆடம்பர 5-நட்சத்திர ரிசார்ட்.",
    hotel1Link: "https://www.coral.com.cy",
    hotel2Name: "Annabelle Hotel",
    hotel2Description: "அழகான தோட்டங்கள், கடற்கரை இருப்பிடம் மற்றும் விதிவிலக்கான சேவையுடன் நேர்த்தியான 5-நட்சத்திர ஹோட்டல்.",
    hotel2Link: "https://www.annabelle.com.cy",
    hotel3Name: "Elysium Hotel",
    hotel3Description: "அற்புதமான கடல் காட்சிகள், பல குளங்கள் மற்றும் சிறந்த உணவு விருப்பங்களுடன் நாகரீகமான ஹோட்டல்.",
    hotel3Link: "https://www.elysium.com.cy",
    hotel4Name: "Alexander The Great Beach Hotel",
    hotel4Description: "சிறந்த வசதிகள் மற்றும் பாஃபோஸ் ஈர்ப்புகளுக்கு எளிதான அணுகலுடன் வசதியான கடற்கரை ஹோட்டல்.",
    hotel4Link: "https://www.alexanderhotel.com.cy",
    thingsToDoTitle: "பாஃபோஸில் செய்ய வேண்டியவை",
    activity1Title: "பாஃபோஸ் தொல்பொருள் பூங்கா",
    activity1Description:
      "அற்புதமான மொசைக்குகளுடன் பழைய ரோமானிய வில்லாக்கள், ஓடியன் ஆம்பிதியேட்டர் மற்றும் சைப்ரஸின் வளமான கடந்த காலத்திலிருந்து பிற வரலாற்று பொக்கிஷங்களை ஆராயுங்கள்.",
    activity2Title: "அரசர்களின் கல்லறைகள்",
    activity2Description:
      "கி.மு. 4 ஆம் நூற்றாண்டிலிருந்து திடமான பாறையிலிருந்து செதுக்கப்பட்ட நிலத்தடி கல்லறைகளைக் கொண்ட இந்த ஈர்க்கக்கூடிய யுனெஸ்கோ உலக பாரம்பரிய தளத்தைப் பார்வையிடுங்கள்.",
    activity3Title: "அஃப்ரோடைட்டின் பாறை",
    activity3Description:
      "காதல் மற்றும் அழகின் கிரேக்க தெய்வமான அஃப்ரோடைட்டின் புகழ்பெற்ற பிறப்பிடத்தைப் பாருங்கள். புகைப்படங்களுக்கு சரியான ஒரு அற்புதமான கடற்கரை அடையாளம்.",
    activity4Title: "பாஃபோஸ் துறைமுகம்",
    activity4Description:
      "உணவகங்கள் மற்றும் கஃபேக்களால் வரிசையாக அமைந்துள்ள அழகிய துறைமுகத்தில் நடக்கவும், இடைக்கால கோட்டையைப் பார்வையிடவும், புதிய கடல் உணவை அனுபவிக்கவும்.",
    activity5Title: "அகாமாஸ் தீபகற்பம்",
    activity5Description:
      "தூய்மையான இயற்கை, நடைபாதைகள் மற்றும் புகழ்பெற்ற நீல குளத்தைக் கண்டறியுங்கள். சாகச தேடுபவர்கள் மற்றும் இயற்கை காதலர்களுக்கு சரியானது.",
    activity6Title: "உள்ளூர் உணவு",
    activity6Description:
      "உள்ளூர் டவர்னாக்களில் ஹலூமி, சௌவ்லாக்கி, மெஸ் தட்டுகள் மற்றும் புதிய மத்திய தரைக்கடல் கடல் உணவு போன்ற பாரம்பரிய சைப்ரியட் உணவுகளை சுவைக்கவும்.",
    travelTipsTitle: "பயண குறிப்புகள்",
    travelTipsDescription:
      "மார்ச் சைப்ரஸைப் பார்வையிட பிரபலமான நேரமாக இருப்பதால் தங்குமிடத்தை முன்கூட்டியே முன்பதிவு செய்யுங்கள். மார்ச் வானிலை பொதுவாக 60-70°F (15-21°C) வெப்பநிலை வரம்புடன் மிதமானதாகவும் இனிமையானதாகவும் இருக்கும். சைப்ரஸ் யூரோ (€) ஐ நாணயமாகப் பயன்படுத்துகிறது. சுற்றுலா பகுதிகளில் ஆங்கிலம் பரவலாகப் பேசப்படுகிறது. உங்கள் பாஸ்போர்ட்டைக் கொண்டு வர நினைவில் கொள்ளுங்கள் மற்றும் சைப்ரஸுக்கான விசா தேவைகளைச் சரிபார்க்கவும்.",
    questionsTitle: "பயணம் பற்றி கேள்விகள்?",
    questionsDescription:
      "பயண ஏற்பாடுகள், தங்குமிடம் அல்லது பகுதியில் செய்ய வேண்டிய விஷயங்கள் பற்றி உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால், உங்கள் RSVP மூலம் தொடர்பு கொள்ள தயங்க வேண்டாம்.",
    viewWebsite: "இணையதளத்தைப் பார்க்கவும்",

    // RSVP
    rsvpTitle: "பதில்",
    rsvpSubtitle: "எங்கள் சிறப்பு கொண்டாட்டத்தில் நீங்கள் சேருவீர்களா என்பதை எங்களுக்குத் தெரியப்படுத்துங்கள்",
    enterName: "உங்கள் பெயரை உள்ளிடுங்கள்",
    namePlaceholder: "அழைப்பிதழில் உள்ளது போல் உங்கள் முழு பெயரை உள்ளிடுங்கள்",
    findGuest: "விருந்தினரைக் கண்டறியுங்கள்",
    welcomeGuest: "வரவேற்கிறோம், {name}!",
    groupBooking: "{size} பேர் வரையிலான குழு வருகை உறுதிப்படுத்தல்",
    willYouAttend: "நீங்கள் எங்கள் திருமணத்தில் கலந்துகொள்வீர்களா?",
    yesAttending: "ஆம், நான் வருவேன்! 🎉",
    noAttending: "மன்னிக்கவும், என்னால் வர முடியாது",
    whichEvents: "எந்த நிகழ்வுகளில் நீங்கள் கலந்துகொள்வீர்கள்?",
    ceremonyEvent: "இந்து திருமண சடங்கு",
    receptionEvent: "திருமண வரவேற்பு",
    groupMemberNames: "குழு உறுப்பினர்களின் பெயர்கள்",
    memberNamePlaceholder: "உறுப்பினர் {number} முழு பெயர்",
    dietaryRequirements: "உணவு தேவைகள்",
    dietaryPlaceholder: "ஏதேனும் ஒவ்வாமை, உணவு கட்டுப்பாடுகள் அல்லது சிறப்பு உணவு விருப்பங்கள் பற்றி எங்களுக்குத் தெரியப்படுத்துங்கள்...",
    questionsComments: "கேள்விகள் அல்லது கருத்துக்கள்",
    questionsPlaceholder: "திருமணம், பயணம் அல்லது தங்குமிடம் பற்றி உங்களுக்கு ஏதேனும் கேள்விகள் உள்ளதா? நாங்கள் உதவ இங்கே இருக்கிறோம்!",
    submitRSVP: "பதில் சமர்ப்பி",
    thankYouTitle: "நன்றி!",
    thankYouAttending: "உங்கள் பதில் பெறப்பட்டது. உங்களுடன் கொண்டாட நாங்கள் மகிழ்ச்சியடைகிறோம்!",
    thankYouNotAttending: "உங்கள் பதில் பெறப்பட்டது. நீங்கள் வர முடியாது என்று கேட்டு வருந்துகிறோம்!",
    backToHome: "முகப்புக்கு திரும்பு",
  },

  fr: {
    // Navigation
    home: "Accueil",
    events: "Événements",
    venue: "Lieu",
    gallery: "Galerie",
    travel: "Voyage",
    rsvp: "RSVP",

    // Common
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    login: "Connexion",
    logout: "Déconnexion",

    // Home page
    homeTitle: "Varnie Tharmalingam & Biraveen Vijayakumar",
    homeSubtitle: "Avec nos familles, nous vous invitons à célébrer notre mariage hindou tamoul",
    homeDescription: "27-28 mars 2026 • Paphos, Chypre",
    homeLocation: "Paphos, Chypre",
    rsvpNow: "RSVP Maintenant",
    viewEvents: "Voir les Événements",
    countdownTitle: "Compte à rebours jusqu'à notre jour spécial",
    days: "Jours",
    hours: "Heures",
    minutes: "Minutes",
    seconds: "Secondes",
    welcomeTitle: "Bienvenue à notre célébration de mariage",
    welcomeDescription1:
      "Nous sommes ravis de vous inviter à nous rejoindre alors que nous commençons notre voyage ensemble en tant que mari et femme. Notre célébration honorera les belles traditions de la culture hindoue tamoule tout en créant de nouveaux souvenirs dans le cadre magnifique de Chypre.",
    welcomeDescription2:
      "Pour nos invités non-indiens, nous avons inclus des explications de nos coutumes et traditions pour vous aider à vous sentir partie prenante de notre célébration spéciale. Nous avons hâte de partager cette occasion joyeuse avec vous !",
    ceremonyTitle: "Cérémonie Hindoue",
    ceremonyDate: "27 mars 2026",
    ceremonyTime: "10h00",
    receptionTitle: "Réception",
    receptionDate: "28 mars 2026",
    receptionTime: "18h00",
    locationTitle: "Lieu",
    locationDescription: "Paradis Méditerranéen",
    dressCodeTitle: "Code Vestimentaire",
    dressCodeDescription: "Tenue Traditionnelle Indienne ou Formelle",
    loveStoryTitle: "Notre Histoire d'Amour",

    // Events page
    eventsPageTitle: "Événements de Mariage",
    eventsPageSubtitle: "Rejoignez-nous pour deux belles journées de célébration au Base Event Venue",
    weddingCeremonyTitle: "Cérémonie de Mariage",
    weddingCeremonySubtitle: "Rituels Hindous Tamouls Traditionnels",
    receptionEventTitle: "Réception",
    receptionEventSubtitle: "Dîner, Danse & Célébration",
    fridayDate: "Vendredi 27 mars 2026",
    saturdayDate: "Samedi 28 mars 2026",
    weddingTime: "10:00 - 17:00",
    receptionTimeRange: "17:00 - Après Minuit",
    baseEventVenue: "Base Event Venue",
    dressCode: "Code Vestimentaire",
    traditionalIndianAttire: "Tenue Traditionnelle Indienne",
    vettiDhotiShirt: "Vetti/Dhoti et chemise",
    saree: "Saree",
    suitBlackTie: "Costume, cravate noire optionnelle",
    cocktailDressSareeLehenga: "Robe cocktail, saree, lehenga",
    foodRefreshments: "Nourriture & Rafraîchissements",
    vegetarianFood: "Amuse-gueules végétariens, déjeuner et dessert",
    nonVegVegFood: "Options non-végétariennes et végétariennes",
    ceremonyOutdoors: "La cérémonie aura lieu en plein air si le temps le permet",
    receptionIndoors: "La réception aura lieu à l'intérieur",
    detailedScheduleTitle: "Programme Détaillé",
    scheduleWarning: "⚠️ Veuillez noter : Le programme ci-dessous est une estimation approximative et peut changer",
    fridayScheduleTitle: "Vendredi 27 mars - Jour de la Cérémonie",
    saturdayScheduleTitle: "Samedi 28 mars - Réception",
    time1000: "10:00",
    time1015: "10:15",
    time1100: "11:00",
    time1130: "11:30",
    time1400: "14:00",
    time1700: "17:00",
    time1730: "17:30",
    time1800: "18:00",
    time1815: "18:15",
    time1900: "19:00",
    time2000: "20:00",
    time2200: "22:00",
    guestArrival: "Arrivée et accueil des invités",
    ganeshPuja: "Ganesh Puja commence",
    startersServed: "Amuse-gueules servis",
    mainCeremony: "Rituels de la cérémonie principale",
    blessingPhotography: "Bénédiction & photographie",
    lunchServed: "Déjeuner servi",
    coupleEntrance: "Entrée du couple",
    cakeCutting: "Découpe du gâteau",
    barOpens: "Le bar ouvre",
    dinnerService: "Service du dîner",
    danceFloor: "La piste de danse ouvre",
    rsvpForEvents: "RSVP pour Nos Événements",

    // Venue page
    venueDescription: "Découvrez le magnifique lieu à Paphos, Chypre où nous célébrerons notre jour spécial",
    venueDescription2:
      "Un lieu magnifique qui accueillera à la fois notre cérémonie hindoue et notre célébration de réception. Le cadre parfait pour notre jour spécial avec de belles installations et un environnement pittoresque.",
    weddingReceptionVenue: "Lieu de Mariage et Réception",
    facilities: "Installations",
    ceremonyReceptionAreas: "Zones de cérémonie et de réception",
    parkingAvailable: "Parking disponible sur place",
    accessibleFacilities: "Installations accessibles",
    professionalSound: "Système audio professionnel",
    fullCatering: "Installations de restauration complètes",
    venueLocation: "Emplacement du Lieu",
    address: "Adresse",
    mapInstructions:
      "Cliquez et faites glisser pour explorer la carte. Utilisez le bouton plein écran pour agrandir la vue.",
    viewTravelInfo: "Voir les Informations de Voyage",

    // Travel page
    travelTitle: "Voyage & Hébergement",
    travelSubtitle: "Tout ce que vous devez savoir pour vous rendre à Paphos, Chypre et où séjourner",
    gettingThereTitle: "Se rendre à Paphos, Chypre",
    gettingThereDescription:
      "Paphos est située sur la côte sud-ouest de Chypre. Le moyen le plus simple d'atteindre Paphos est de prendre l'avion pour l'aéroport international de Paphos (PFO), qui se trouve à seulement 15 minutes du centre-ville. Alternativement, vous pouvez prendre l'avion pour l'aéroport international de Larnaca (LCA) et conduire environ 1,5 heure jusqu'à Paphos.",
    airportsTitle: "Aéroports Recommandés",
    sfoTitle: "Aéroport International de Paphos (PFO)",
    sfoDescription:
      "L'aéroport le plus proche et le plus pratique, situé à seulement 15 minutes du centre-ville de Paphos.",
    sfoDrive: "15 minutes jusqu'à Paphos",
    oakTitle: "Aéroport International de Larnaca (LCA)",
    oakDescription: "Le principal aéroport international de Chypre avec plus d'options de vols du monde entier.",
    oakDrive: "1 heure 30 minutes jusqu'à Paphos",
    sjcTitle: "Transport depuis l'Aéroport",
    sjcDescription:
      "Des taxis, des voitures de location et des services de navette sont facilement disponibles dans les deux aéroports.",
    sjcDrive: "Réservez à l'avance pour les meilleurs tarifs",
    transportationTitle: "Transport",
    transportationDescription:
      "Nous recommandons de louer une voiture pour la durée de votre séjour, car cela offre une flexibilité pour explorer Paphos et les environs. Les taxis sont facilement disponibles et à des prix raisonnables. De nombreux hôtels proposent également des services de navette depuis l'aéroport.",
    accommodationsTitle: "Où Séjourner",
    luxuryHotelsTitle: "Options de Luxe",
    midRangeHotelsTitle: "Options Milieu de Gamme",
    hotel1Name: "Coral Beach Hotel & Resort",
    hotel1Description:
      "Resort de luxe 5 étoiles avec plage privée, plusieurs restaurants et installations de spa de classe mondiale.",
    hotel1Link: "https://www.coral.com.cy",
    hotel2Name: "Annabelle Hotel",
    hotel2Description:
      "Hôtel 5 étoiles élégant avec de beaux jardins, emplacement en bord de mer et service exceptionnel.",
    hotel2Link: "https://www.annabelle.com.cy",
    hotel3Name: "Elysium Hotel",
    hotel3Description:
      "Hôtel élégant avec vue imprenable sur la mer, plusieurs piscines et excellentes options de restauration.",
    hotel3Link: "https://www.elysium.com.cy",
    hotel4Name: "Alexander The Great Beach Hotel",
    hotel4Description:
      "Hôtel confortable en bord de mer avec d'excellentes commodités et un accès facile aux attractions de Paphos.",
    hotel4Link: "https://www.alexanderhotel.com.cy",
    thingsToDoTitle: "Choses à Faire à Paphos",
    activity1Title: "Parc Archéologique de Paphos",
    activity1Description:
      "Explorez d'anciennes villas romaines avec de superbes mosaïques, l'amphithéâtre Odeon et d'autres trésors historiques du riche passé de Chypre.",
    activity2Title: "Tombeaux des Rois",
    activity2Description:
      "Visitez ce site impressionnant du patrimoine mondial de l'UNESCO avec des tombes souterraines taillées dans la roche solide datant du 4ème siècle avant J.-C.",
    activity3Title: "Rocher d'Aphrodite",
    activity3Description:
      "Voyez le lieu de naissance légendaire d'Aphrodite, la déesse grecque de l'amour et de la beauté. Un point de repère côtier magnifique parfait pour les photos.",
    activity4Title: "Port de Paphos",
    activity4Description:
      "Promenez-vous le long du port pittoresque bordé de restaurants et de cafés, visitez le château médiéval et dégustez des fruits de mer frais.",
    activity5Title: "Péninsule d'Akamas",
    activity5Description:
      "Découvrez une nature vierge, des sentiers de randonnée et le célèbre Lagon Bleu. Parfait pour les aventuriers et les amoureux de la nature.",
    activity6Title: "Cuisine Locale",
    activity6Description:
      "Savourez des plats chypriotes traditionnels comme le halloumi, le souvlaki, les plateaux de meze et les fruits de mer méditerranéens frais dans les tavernes locales.",
    travelTipsTitle: "Conseils de Voyage",
    travelTipsDescription:
      "Réservez l'hébergement tôt car mars est une période populaire pour visiter Chypre. Le temps en mars est généralement doux et agréable avec des températures allant de 60 à 70°F (15-21°C). Chypre utilise l'Euro (€) comme monnaie. L'anglais est largement parlé dans les zones touristiques. N'oubliez pas d'apporter votre passeport et de vérifier les exigences de visa pour Chypre.",
    questionsTitle: "Questions sur le Voyage ?",
    questionsDescription:
      "Si vous avez des questions sur les arrangements de voyage, l'hébergement ou les choses à faire dans la région, n'hésitez pas à nous contacter via votre RSVP.",
    viewWebsite: "Voir le Site Web",

    // RSVP
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Veuillez nous faire savoir si vous nous rejoindrez pour notre célébration spéciale",
    enterName: "Entrez Votre Nom",
    namePlaceholder: "Entrez votre nom complet tel qu'il apparaît sur l'invitation",
    findGuest: "Trouver l'Invité",
    welcomeGuest: "Bienvenue, {name} !",
    groupBooking: "Réponse groupée pour jusqu'à {size} personnes",
    willYouAttend: "Assisterez-vous à notre mariage ?",
    yesAttending: "Oui, je serai là ! 🎉",
    noAttending: "Désolé, je ne peux pas venir",
    whichEvents: "À quels événements assisterez-vous ?",
    ceremonyEvent: "Cérémonie de Mariage Hindou",
    receptionEvent: "Réception de Mariage",
    groupMemberNames: "Noms des Membres du Groupe",
    memberNamePlaceholder: "Nom complet du membre {number}",
    dietaryRequirements: "Exigences Alimentaires",
    dietaryPlaceholder:
      "Veuillez nous informer de toute allergie, restriction alimentaire ou préférence de repas spéciale...",
    questionsComments: "Questions ou Commentaires",
    questionsPlaceholder:
      "Avez-vous des questions sur le mariage, le voyage ou l'hébergement ? Nous sommes là pour vous aider !",
    submitRSVP: "Soumettre RSVP",
    thankYouTitle: "Merci !",
    thankYouAttending: "Votre RSVP a été reçu. Nous sommes excités de célébrer avec vous !",
    thankYouNotAttending: "Votre RSVP a été reçu. Nous sommes désolés d'apprendre que vous ne pouvez pas venir !",
    backToHome: "Retour à l'Accueil",
  },
}

export function useTranslation(language = "en"): Translation {
  return translations[language] || translations.en
}
