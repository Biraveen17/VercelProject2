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
  traditionsTitle: string
  sacredFireTitle: string
  sacredFireDescription: string
  mangalsutraTitle: string
  mangalsutraDescription: string
  saptapadiTitle: string
  saptapadiDescription: string
  ganeshTitle: string
  ganeshDescription: string
  loveStoryTitle: string

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
    homeTitle: "Varnie & Biraveen",
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
    traditionsTitle: "Understanding Our Hindu Wedding Traditions",
    sacredFireTitle: "Sacred Fire Ceremony (Agni)",
    sacredFireDescription:
      "The sacred fire represents the divine witness to our vows. We will walk around the fire seven times, each circle representing a vow for our married life together.",
    mangalsutraTitle: "Mangalsutra",
    mangalsutraDescription:
      "The groom will tie a sacred necklace around the bride's neck, symbolizing their eternal bond and the bride's new status as a married woman.",
    saptapadiTitle: "Saptapadi (Seven Steps)",
    saptapadiDescription:
      "We will take seven steps together, each step representing a promise for our future - from nourishment and strength to friendship and devotion.",
    ganeshTitle: "Ganesh Blessings",
    ganeshDescription:
      "Lord Ganesh, the remover of obstacles, will be invoked to bless our union and ensure a smooth beginning to our married life.",
    loveStoryTitle: "Our Love Story",

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
    danceFloor: "Dance floor and entertainment area",
    venueLocation: "Venue Location",
    address: "Address",
    mapInstructions: "Click and drag to explore the map. Use the fullscreen button to enlarge the view.",
    viewTravelInfo: "View Travel Information",

    // Travel page
    travelTitle: "Travel & Accommodations",
    travelSubtitle: "Everything you need to know about getting to Napa Valley and where to stay",
    gettingThereTitle: "Getting to Napa Valley",
    gettingThereDescription:
      "Napa Valley is located in Northern California, about 60 miles north of San Francisco. The region is easily accessible from three major airports, each offering convenient access to wine country.",
    airportsTitle: "Recommended Airports",
    sfoTitle: "San Francisco International (SFO)",
    sfoDescription: "The largest and most convenient airport with the most international flight options.",
    sfoDrive: "1 hour 15 minutes to Napa",
    oakTitle: "Oakland International (OAK)",
    oakDescription: "A smaller, often less crowded alternative with competitive pricing.",
    oakDrive: "1 hour to Napa",
    sjcTitle: "San Jose International (SJC)",
    sjcDescription: "Southern option, ideal if you're planning to explore more of the Bay Area.",
    sjcDrive: "1 hour 30 minutes to Napa",
    transportationTitle: "Transportation",
    transportationDescription:
      "We highly recommend renting a car for the duration of your stay, as it provides the most flexibility to explore Napa Valley's wineries and attractions. Ride-sharing services like Uber and Lyft are also available, though they can be expensive for longer trips. Several shuttle services operate between the airports and Napa Valley hotels.",
    accommodationsTitle: "Where to Stay",
    luxuryHotelsTitle: "Luxury Options",
    midRangeHotelsTitle: "Mid-Range Options",
    hotel1Name: "Auberge du Soleil",
    hotel1Description: "Iconic luxury resort with stunning valley views, Michelin-starred dining, and world-class spa.",
    hotel1Link: "https://aubergedusoleil.com",
    hotel2Name: "Carneros Resort and Spa",
    hotel2Description: "Elegant cottages and suites with farm-to-table dining and extensive spa facilities.",
    hotel2Link: "https://carnerosresort.com",
    hotel3Name: "Napa River Inn",
    hotel3Description: "Charming boutique hotel in downtown Napa with easy access to restaurants and shops.",
    hotel3Link: "https://napariverinn.com",
    hotel4Name: "Andaz Napa",
    hotel4Description: "Modern hotel in the heart of downtown with a rooftop bar and contemporary design.",
    hotel4Link: "https://www.hyatt.com/andaz/napan-andaz-napa",
    thingsToDoTitle: "Things to Do in Napa Valley",
    activity1Title: "Wine Tasting",
    activity1Description:
      "Explore world-renowned wineries and vineyards. Book tastings in advance at estates like Opus One, Domaine Carneros, or Castello di Amorosa.",
    activity2Title: "Hot Air Balloon Rides",
    activity2Description:
      "Experience breathtaking sunrise views of the valley from above. Several companies offer early morning flights with champagne breakfast.",
    activity3Title: "Napa Valley Wine Train",
    activity3Description:
      "Enjoy a gourmet meal aboard a vintage train while touring the valley. Multiple dining experiences available.",
    activity4Title: "Downtown Napa",
    activity4Description:
      "Stroll through the revitalized downtown area with art galleries, boutique shops, and the Oxbow Public Market.",
    activity5Title: "Spa & Wellness",
    activity5Description:
      "Indulge in wine-inspired spa treatments at one of the many luxury spas, including mud baths and grape seed scrubs.",
    activity6Title: "Culinary Experiences",
    activity6Description:
      "Dine at Michelin-starred restaurants like The French Laundry, or take a cooking class at the Culinary Institute of America.",
    travelTipsTitle: "Travel Tips",
    travelTipsDescription:
      "Book accommodations early as Napa Valley is a popular destination year-round. March weather is typically mild with temperatures ranging from 50-70°F (10-21°C), so bring layers. Many wineries require reservations, so plan your tastings in advance. Designated drivers or wine tour services are recommended if you plan to visit multiple wineries.",
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
    groupBooking: "Group booking for up to {size} people",
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
    homeTitle: "Varnie & Biraveen",
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
    traditionsTitle: "Forstå Vores Hindu Bryllupstraditioner",
    sacredFireTitle: "Hellig Ild Ceremoni (Agni)",
    sacredFireDescription:
      "Den hellige ild repræsenterer det guddommelige vidne til vores løfter. Vi vil gå rundt om ilden syv gange, hvor hver cirkel repræsenterer et løfte for vores gifte liv sammen.",
    mangalsutraTitle: "Mangalsutra",
    mangalsutraDescription:
      "Brudgommen vil binde et helligt halskæde omkring brudens hals, som symboliserer deres evige bånd og brudens nye status som gift kvinde.",
    saptapadiTitle: "Saptapadi (Syv Skridt)",
    saptapadiDescription:
      "Vi vil tage syv skridt sammen, hvor hvert skridt repræsenterer et løfte for vores fremtid - fra næring og styrke til venskab og hengivenhed.",
    ganeshTitle: "Ganesh Velsignelser",
    ganeshDescription:
      "Herre Ganesh, fjerneren af forhindringer, vil blive påkaldt for at velsigne vores forening og sikre en jævn begyndelse på vores gifte liv.",
    loveStoryTitle: "Vores Kærlighedshistorie",

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
    danceFloor: "Dansbord og underholdningsområde",
    venueLocation: "Lokation",
    address: "Adresse",
    mapInstructions: "Klik og træk for at udforske kortet. Brug fuldskærm-knappen til at forstør visningen.",
    viewTravelInfo: "Se Rejseinformationer",

    // Travel page
    travelTitle: "Rejse & Indkvartering",
    travelSubtitle: "Alt du behøver at vide om at komme til Napa Valley og hvor du skal bo",
    gettingThereTitle: "Sådan kommer du til Napa Valley",
    gettingThereDescription:
      "Napa Valley ligger i det nordlige Californien, omkring 60 miles nord for San Francisco. Regionen er let tilgængelig fra tre store lufthavne, hver med bekvem adgang til vinlandet.",
    airportsTitle: "Anbefalede Lufthavne",
    sfoTitle: "San Francisco International (SFO)",
    sfoDescription: "Den største og mest bekvemme lufthavn med flest internationale flymuligheder.",
    sfoDrive: "1 time 15 minutter til Napa",
    oakTitle: "Oakland International (OAK)",
    oakDescription: "En mindre, ofte mindre overfyldt alternativ med konkurrencedygtige priser.",
    oakDrive: "1 time til Napa",
    sjcTitle: "San Jose International (SJC)",
    sjcDescription: "Sydlig mulighed, ideel hvis du planlægger at udforske mere af Bay Area.",
    sjcDrive: "1 time 30 minutter til Napa",
    transportationTitle: "Transport",
    transportationDescription:
      "Vi anbefaler stærkt at leje en bil i hele dit ophold, da det giver mest fleksibilitet til at udforske Napa Valleys vingårde og attraktioner. Ride-sharing tjenester som Uber og Lyft er også tilgængelige, selvom de kan være dyre for længere ture. Flere shuttle-tjenester kører mellem lufthavnene og Napa Valley hoteller.",
    accommodationsTitle: "Hvor skal man bo",
    luxuryHotelsTitle: "Luksus Muligheder",
    midRangeHotelsTitle: "Mellem Muligheder",
    hotel1Name: "Auberge du Soleil",
    hotel1Description:
      "Ikonisk luksus resort med fantastisk udsigt over dalen, Michelin-stjernet spisning og verdensklasse spa.",
    hotel1Link: "https://aubergedusoleil.com",
    hotel2Name: "Carneros Resort and Spa",
    hotel2Description: "Elegante hytter og suiter med farm-to-table spisning og omfattende spa faciliteter.",
    hotel2Link: "https://carnerosresort.com",
    hotel3Name: "Napa River Inn",
    hotel3Description: "Charmerende boutique hotel i downtown Napa med let adgang til restauranter og butikker.",
    hotel3Link: "https://napariverinn.com",
    hotel4Name: "Andaz Napa",
    hotel4Description: "Moderne hotel i hjertet af downtown med en tagterrasse bar og moderne design.",
    hotel4Link: "https://www.hyatt.com/andaz/napan-andaz-napa",
    thingsToDoTitle: "Ting at lave i Napa Valley",
    activity1Title: "Vinsmagning",
    activity1Description:
      "Udforsk verdensberømte vingårde og vinmarker. Book smagninger på forhånd på godser som Opus One, Domaine Carneros eller Castello di Amorosa.",
    activity2Title: "Varmluftballonture",
    activity2Description:
      "Oplev betagende solopgangsvisninger af dalen fra oven. Flere virksomheder tilbyder tidlige morgenflyvninger med champagne morgenmad.",
    activity3Title: "Napa Valley Wine Train",
    activity3Description:
      "Nyd et gourmet måltid ombord på et vintage tog mens du turer gennem dalen. Flere spiseoplevelser tilgængelige.",
    activity4Title: "Downtown Napa",
    activity4Description:
      "Gå en tur gennem det revitaliserede downtown område med kunstgallerier, boutique butikker og Oxbow Public Market.",
    activity5Title: "Spa & Wellness",
    activity5Description:
      "Forkæl dig selv med vin-inspirerede spa behandlinger på en af de mange luksus spaer, inklusive mudder bade og druesæd skrub.",
    activity6Title: "Kulinariske Oplevelser",
    activity6Description:
      "Spis på Michelin-stjernede restauranter som The French Laundry, eller tag et madlavningskursus på Culinary Institute of America.",
    travelTipsTitle: "Rejsetips",
    travelTipsDescription:
      "Book indkvartering tidligt, da Napa Valley er en populær destination året rundt. Marts vejret er typisk mildt med temperaturer fra 50-70°F (10-21°C), så tag lag på. Mange vingårde kræver reservationer, så planlæg dine smagninger på forhånd. Udpegede chauffører eller vintur tjenester anbefales, hvis du planlægger at besøge flere vingårde.",
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
    groupBooking: "Gruppebooking til op til {size} personer",
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
    traditionsTitle: "எங்கள் இந்து திருமண பாரம்பரியங்களைப் புரிந்துகொள்ளுதல்",
    sacredFireTitle: "புனித அக்னி சடங்கு",
    sacredFireDescription:
      "புனித அக்னி எங்கள் சபதங்களுக்கு தெய்வீக சாட்சியைக் குறிக்கிறது. நாங்கள் அக்னியைச் சுற்றி ஏழு முறை நடப்போம், ஒவ்வொரு வட்டமும் எங்கள் திருமண வாழ்க்கைக்கான ஒரு சபதத்தைக் குறிக்கிறது.",
    mangalsutraTitle: "மங்கலசூத்ரம்",
    mangalsutraDescription:
      "மணமகன் மணமகளின் கழுத்தில் ஒரு புனித மாலையைக் கட்டுவார், இது அவர்களின் நித்திய பந்தத்தையும் மணமகளின் திருமணமான பெண்ணின் புதிய அந்தஸ்தையும் குறிக்கிறது.",
    saptapadiTitle: "சப்தபதி (ஏழு அடிகள்)",
    saptapadiDescription:
      "நாங்கள் ஒன்றாக ஏழு அடிகள் எடுப்போம், ஒவ்வொரு அடியும் எங்கள் எதிர்காலத்திற்கான ஒரு வாக்குறுதியைக் குறிக்கிறது - ஊட்டச்சத்து மற்றும் வலிமையிலிருந்து நட்பு மற்றும் பக்தி வரை.",
    ganeshTitle: "கணேஷ் ஆசீர்வாதம்",
    ganeshDescription:
      "தடைகளை நீக்குபவரான கணேஷ் பெருமான், எங்கள் இணைப்பை ஆசீர்வதிக்கவும், எங்கள் திருமண வாழ்க்கையின் மென்மையான தொடக்கத்தை உறுதி செய்யவும் அழைக்கப்படுவார்.",
    loveStoryTitle: "எங்கள் காதல் கதை",

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
    danceFloor: "நடன தளம் மற்றும் பொழுதுபோக்கு பகுதி",
    venueLocation: "இடத்தின் இருப்பிடம்",
    address: "முகவரி",
    mapInstructions: "வரைபடத்தை ஆராய கிளிக் செய்து இழுக்கவும். காட்சியை பெரிதாக்க முழுத்திரை பொத்தானைப் பயன்படுத்தவும்.",
    viewTravelInfo: "பயண தகவலைப் பார்க்கவும்",

    // Travel page
    travelTitle: "பயணம் & தங்குமிடம்",
    travelSubtitle: "நாபா பள்ளத்தாக்குக்கு எப்படி செல்வது மற்றும் எங்கு தங்குவது என்பது பற்றி நீங்கள் தெரிந்து கொள்ள வேண்டிய அனைத்தும்",
    gettingThereTitle: "நாபா பள்ளத்தாக்குக்கு செல்வது",
    gettingThereDescription:
      "நாபா பள்ளத்தாக்கு வடக்கு கலிபோர்னியாவில், சான் பிரான்சிஸ்கோவிலிருந்து சுமார் 60 மைல் வடக்கே அமைந்துள்ளது. இப்பகுதி மூன்று பெரிய விமான நிலையங்களிலிருந்து எளிதாக அணுகக்கூடியது, ஒவ்வொன்றும் ஒயின் நாட்டிற்கு வசதியான அணுகலை வழங்குகிறது.",
    airportsTitle: "பரிந்துரைக்கப்பட்ட விமான நிலையங்கள்",
    sfoTitle: "சான் பிரான்சிஸ்கோ சர்வதேச (SFO)",
    sfoDescription: "மிகவும் சர்வதேச விமான விருப்பங்களுடன் மிகப்பெரிய மற்றும் மிகவும் வசதியான விமான நிலையம்.",
    sfoDrive: "நாபாவிற்கு 1 மணி 15 நிமிடங்கள்",
    oakTitle: "ஓக்லாண்ட் சர்வதேச (OAK)",
    oakDescription: "போட்டி விலையுடன் சிறிய, பெரும்பாலும் குறைவான நெரிசலான மாற்று.",
    oakDrive: "நாபாவிற்கு 1 மணி",
    sjcTitle: "சான் ஜோஸ் சர்வதேச (SJC)",
    sjcDescription: "தெற்கு விருப்பம், நீங்கள் பே ஏரியாவை மேலும் ஆராய திட்டமிட்டால் சிறந்தது.",
    sjcDrive: "நாபாவிற்கு 1 மணி 30 நிமிடங்கள்",
    transportationTitle: "போக்குவரத்து",
    transportationDescription:
      "உங்கள் தங்குமிடத்தின் காலத்திற்கு ஒரு காரை வாடகைக்கு எடுப்பதை நாங்கள் மிகவும் பரிந்துரைக்கிறோம், ஏனெனில் இது நாபா பள்ளத்தாக்கின் ஒயின் தோட்டங்கள் மற்றும் ஈர்ப்புகளை ஆராய மிகவும் நெகிழ்வுத்தன்மையை வழங்குகிறது. Uber மற்றும் Lyft போன்ற ரைடு-ஷேரிங் சேவைகளும் கிடைக்கின்றன, இருப்பினும் அவை நீண்ட பயணங்களுக்கு விலை அதிகமாக இருக்கலாம். பல ஷட்டில் சேவைகள் விமான நிலையங்களுக்கும் நாபா பள்ளத்தாக்கு ஹோட்டல்களுக்கும் இடையே இயங்குகின்றன.",
    accommodationsTitle: "எங்கு தங்குவது",
    luxuryHotelsTitle: "ஆடம்பர விருப்பங்கள்",
    midRangeHotelsTitle: "நடுத்தர விருப்பங்கள்",
    hotel1Name: "Auberge du Soleil",
    hotel1Description: "அற்புதமான பள்ளத்தாக்கு காட்சிகள், மிச்செலின்-நட்சத்திர உணவு மற்றும் உலகத் தரம் வாய்ந்த ஸ்பா கொண்ட சின்னமான ஆடம்பர ரிசார்ட்.",
    hotel1Link: "https://aubergedusoleil.com",
    hotel2Name: "Carneros Resort and Spa",
    hotel2Description: "பண்ணை-முதல்-மேசை உணவு மற்றும் விரிவான ஸ்பா வசதிகளுடன் நேர்த்தியான குடிசைகள் மற்றும் அறைகள்.",
    hotel2Link: "https://carnerosresort.com",
    hotel3Name: "Napa River Inn",
    hotel3Description: "உணவகங்கள் மற்றும் கடைகளுக்கு எளிதான அணுகலுடன் டவுன்டவுன் நாபாவில் கவர்ச்சிகரமான பூட்டிக் ஹோட்டல்.",
    hotel3Link: "https://napariverinn.com",
    hotel4Name: "Andaz Napa",
    hotel4Description: "மேல்மாடி பார் மற்றும் சமகால வடிவமைப்புடன் டவுன்டவுன் மையத்தில் நவீன ஹோட்டல்.",
    hotel4Link: "https://www.hyatt.com/andaz/napan-andaz-napa",
    thingsToDoTitle: "நாபா பள்ளத்தாக்கில் செய்ய வேண்டியவை",
    activity1Title: "ஒயின் சுவைத்தல்",
    activity1Description:
      "உலகப் புகழ்பெற்ற ஒயின் தோட்டங்கள் மற்றும் திராட்சைத் தோட்டங்களை ஆராயுங்கள். Opus One, Domaine Carneros அல்லது Castello di Amorosa போன்ற எஸ்டேட்களில் முன்கூட்டியே சுவைப்புகளை முன்பதிவு செய்யுங்கள்.",
    activity2Title: "சூடான காற்று பலூன் சவாரிகள்",
    activity2Description:
      "மேலிருந்து பள்ளத்தாக்கின் மூச்சடைக்கக்கூடிய சூரிய உதய காட்சிகளை அனுபவியுங்கள். பல நிறுவனங்கள் ஷாம்பெயின் காலை உணவுடன் ஆரம்ப காலை விமானங்களை வழங்குகின்றன.",
    activity3Title: "நாபா பள்ளத்தாக்கு ஒயின் ரயில்",
    activity3Description:
      "பள்ளத்தாக்கு வழியாக சுற்றுப்பயணம் செய்யும் போது பழமையான ரயிலில் ஒரு உணவு உணவை அனுபவியுங்கள். பல உணவு அனுபவங்கள் கிடைக்கின்றன.",
    activity4Title: "டவுன்டவுன் நாபா",
    activity4Description:
      "கலை காட்சியகங்கள், பூட்டிக் கடைகள் மற்றும் Oxbow Public Market உடன் புத்துயிர் பெற்ற டவுன்டவுன் பகுதி வழியாக நடக்கவும்.",
    activity5Title: "ஸ்பா & ஆரோக்கியம்",
    activity5Description:
      "மண் குளியல் மற்றும் திராட்சை விதை ஸ்க்ரப் உட்பட பல ஆடம்பர ஸ்பாக்களில் ஒன்றில் ஒயின்-ஊக்கப்படுத்தப்பட்ட ஸ்பா சிகிச்சைகளில் ஈடுபடுங்கள்.",
    activity6Title: "சமையல் அனுபவங்கள்",
    activity6Description:
      "The French Laundry போன்ற மிச்செலின்-நட்சத்திர உணவகங்களில் உணவருந்துங்கள், அல்லது Culinary Institute of America இல் சமையல் வகுப்பை எடுங்கள்.",
    travelTipsTitle: "பயண குறிப்புகள்",
    travelTipsDescription:
      "நாபா பள்ளத்தாக்கு ஆண்டு முழுவதும் பிரபலமான இடமாக இருப்பதால் தங்குமிடத்தை முன்கூட்டியே முன்பதிவு செய்யுங்கள். மார்ச் வானிலை பொதுவாக 50-70°F (10-21°C) வெப்பநிலை வரம்புடன் மிதமானதாக இருக்கும், எனவே அடுக்குகளை கொண்டு வாருங்கள். பல ஒயின் தோட்டங்களுக்கு முன்பதிவு தேவை, எனவே உங்கள் சுவைப்புகளை முன்கூட்டியே திட்டமிடுங்கள். நீங்கள் பல ஒயின் தோட்டங்களை பார்வையிட திட்டமிட்டால் நியமிக்கப்பட்ட ஓட்டுநர்கள் அல்லது ஒயின் சுற்றுப்பயண சேவைகள் பரிந்துரைக்கப்படுகின்றன.",
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
    groupBooking: "{size} பேர் வரையிலான குழு முன்பதிவு",
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
    homeTitle: "Varnie & Biraveen",
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
    traditionsTitle: "Comprendre nos traditions de mariage hindou",
    sacredFireTitle: "Cérémonie du Feu Sacré (Agni)",
    sacredFireDescription:
      "Le feu sacré représente le témoin divin de nos vœux. Nous marcherons autour du feu sept fois, chaque cercle représentant un vœu pour notre vie conjugale ensemble.",
    mangalsutraTitle: "Mangalsutra",
    mangalsutraDescription:
      "Le marié attachera un collier sacré autour du cou de la mariée, symbolisant leur lien éternel et le nouveau statut de la mariée en tant que femme mariée.",
    saptapadiTitle: "Saptapadi (Sept Pas)",
    saptapadiDescription:
      "Nous ferons sept pas ensemble, chaque pas représentant une promesse pour notre avenir - de la nourriture et de la force à l'amitié et à la dévotion.",
    ganeshTitle: "Bénédictions de Ganesh",
    ganeshDescription:
      "Seigneur Ganesh, celui qui supprime les obstacles, sera invoqué pour bénir notre union et assurer un début harmonieux à notre vie conjugale.",
    loveStoryTitle: "Notre Histoire d'Amour",

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
    danceFloor: "Piste de danse et zone de divertissement",
    venueLocation: "Emplacement du Lieu",
    address: "Adresse",
    mapInstructions:
      "Cliquez et faites glisser pour explorer la carte. Utilisez le bouton plein écran pour agrandir la vue.",
    viewTravelInfo: "Voir les Informations de Voyage",

    // Travel page
    travelTitle: "Voyage & Hébergement",
    travelSubtitle: "Tout ce que vous devez savoir pour vous rendre à Napa Valley et où séjourner",
    gettingThereTitle: "Se rendre à Napa Valley",
    gettingThereDescription:
      "Napa Valley est située dans le nord de la Californie, à environ 60 miles au nord de San Francisco. La région est facilement accessible depuis trois grands aéroports, chacun offrant un accès pratique au pays du vin.",
    airportsTitle: "Aéroports Recommandés",
    sfoTitle: "San Francisco International (SFO)",
    sfoDescription: "Le plus grand et le plus pratique aéroport avec le plus d'options de vols internationaux.",
    sfoDrive: "1 heure 15 minutes jusqu'à Napa",
    oakTitle: "Oakland International (OAK)",
    oakDescription: "Une alternative plus petite, souvent moins encombrée avec des prix compétitifs.",
    oakDrive: "1 heure jusqu'à Napa",
    sjcTitle: "San Jose International (SJC)",
    sjcDescription: "Option sud, idéale si vous prévoyez d'explorer davantage la région de la baie.",
    sjcDrive: "1 heure 30 minutes jusqu'à Napa",
    transportationTitle: "Transport",
    transportationDescription:
      "Nous recommandons vivement de louer une voiture pour la durée de votre séjour, car cela offre le plus de flexibilité pour explorer les vignobles et attractions de Napa Valley. Les services de covoiturage comme Uber et Lyft sont également disponibles, bien qu'ils puissent être coûteux pour les trajets plus longs. Plusieurs services de navette fonctionnent entre les aéroports et les hôtels de Napa Valley.",
    accommodationsTitle: "Où Séjourner",
    luxuryHotelsTitle: "Options de Luxe",
    midRangeHotelsTitle: "Options Milieu de Gamme",
    hotel1Name: "Auberge du Soleil",
    hotel1Description:
      "Resort de luxe emblématique avec vue imprenable sur la vallée, restaurant étoilé Michelin et spa de classe mondiale.",
    hotel1Link: "https://aubergedusoleil.com",
    hotel2Name: "Carneros Resort and Spa",
    hotel2Description:
      "Cottages et suites élégants avec restauration de la ferme à la table et installations de spa étendues.",
    hotel2Link: "https://carnerosresort.com",
    hotel3Name: "Napa River Inn",
    hotel3Description:
      "Charmant hôtel boutique au centre-ville de Napa avec accès facile aux restaurants et boutiques.",
    hotel3Link: "https://napariverinn.com",
    hotel4Name: "Andaz Napa",
    hotel4Description: "Hôtel moderne au cœur du centre-ville avec un bar sur le toit et un design contemporain.",
    hotel4Link: "https://www.hyatt.com/andaz/napan-andaz-napa",
    thingsToDoTitle: "Choses à Faire à Napa Valley",
    activity1Title: "Dégustation de Vin",
    activity1Description:
      "Explorez des vignobles et domaines viticoles de renommée mondiale. Réservez des dégustations à l'avance dans des domaines comme Opus One, Domaine Carneros ou Castello di Amorosa.",
    activity2Title: "Vols en Montgolfière",
    activity2Description:
      "Vivez des vues à couper le souffle au lever du soleil sur la vallée depuis les airs. Plusieurs entreprises proposent des vols tôt le matin avec petit-déjeuner au champagne.",
    activity3Title: "Train du Vin de Napa Valley",
    activity3Description:
      "Profitez d'un repas gastronomique à bord d'un train vintage tout en visitant la vallée. Multiple expériences culinaires disponibles.",
    activity4Title: "Centre-ville de Napa",
    activity4Description:
      "Promenez-vous dans le quartier revitalisé du centre-ville avec des galeries d'art, des boutiques et le Oxbow Public Market.",
    activity5Title: "Spa & Bien-être",
    activity5Description:
      "Offrez-vous des soins de spa inspirés du vin dans l'un des nombreux spas de luxe, y compris des bains de boue et des gommages aux pépins de raisin.",
    activity6Title: "Expériences Culinaires",
    activity6Description:
      "Dînez dans des restaurants étoilés Michelin comme The French Laundry, ou suivez un cours de cuisine au Culinary Institute of America.",
    travelTipsTitle: "Conseils de Voyage",
    travelTipsDescription:
      "Réservez l'hébergement tôt car Napa Valley est une destination populaire toute l'année. Le temps de mars est généralement doux avec des températures allant de 50 à 70°F (10-21°C), alors apportez des couches. De nombreux vignobles nécessitent des réservations, alors planifiez vos dégustations à l'avance. Des conducteurs désignés ou des services de visite de vin sont recommandés si vous prévoyez de visiter plusieurs vignobles.",
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
    groupBooking: "Réservation de groupe pour jusqu'à {size} personnes",
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
