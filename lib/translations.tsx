// ... existing code ...

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

  // <CHANGE> Adding travel page translations
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
  // </CHANGE>

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
    // ... existing code ...

    // <CHANGE> Adding English travel translations
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
    // </CHANGE>

    // ... existing code ...
  },

  da: {
    // ... existing code ...

    // <CHANGE> Adding Danish travel translations
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
    hotel1Description: "Ikonisk luksus resort med fantastisk udsigt over dalen, Michelin-stjernet spisning og verdensklasse spa.",
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
    // </CHANGE>

    // ... existing code ...
  },

  ta: {
    // ... existing code ...

    // <CHANGE> Adding Tamil travel translations
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
    // </CHANGE>

    // ... existing code ...
  },

  fr: {
    // ... existing code ...

    // <CHANGE> Adding French travel translations
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
    hotel1Description: "Resort de luxe emblématique avec vue imprenable sur la vallée, restaurant étoilé Michelin et spa de classe mondiale.",
    hotel1Link: "https://aubergedusoleil.com",
    hotel2Name: "Carneros Resort and Spa",
    hotel2Description: "Cottages et suites élégants avec restauration de la ferme à la table et installations de spa étendues.",
    hotel2Link: "https://carnerosresort.com",
    hotel3Name: "Napa River Inn",
    hotel3Description: "Charmant hôtel boutique au centre-ville de Napa avec accès facile aux restaurants et boutiques.",
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
      "Profitez d'un repas gastronomique à bord d'un train vintage tout en visitant la vallée. Plusieurs expériences culinaires disponibles.",
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
    // </CHANGE>

    // ... existing code ...
  },
}

// ... existing code ...
