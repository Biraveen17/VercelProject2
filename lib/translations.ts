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

    // RSVP
    rsvpTitle: "பதில்",
    rsvpSubtitle: "எங்கள் சிறப்பு கொண்டாட்டத்தில் நீங்கள் சேருவீர்களா என்பதை எங்களுக்குத் தெரியப்படுத்துங்கள்",
    enterName: "உங்கள் பெயரை உள்ளிடுங்கள்",
    namePlaceholder: "அழைப்பிதழில் உள்ளது போல் உங்கள் முழு பெயரை உள்ளிடுங்கள்",
    findGuest: "உங்கள் விருந்தினர்களைக் கண்டறியுங்கள்",
    welcomeGuest: "வரவேற்கிறது, {name}!",
    groupBooking: "{size} பேர்க்கு வரையற்ற குழு முன்பதிவு",
    willYouAttend: "நீங்கள் எங்கள் திருமணத்தில் கலந்துகொள்வீர்களா?",
    yesAttending: "ஆம், நான் வருவேன்! 🎉",
    noAttending: "மன்னிக்கவும், என்னால் வர முடியாது",
    whichEvents: "எந்த நிகழ்வுகளில் நீங்கள் கலந்துகொள்வீர்கள்?",
    ceremonyEvent: "இந்து திருமண சடங்கு",
    receptionEvent: "திருமண வரவேற்பு",
    groupMemberNames: "குழு பொருளாளர்களின் பெயர்கள்",
    memberNamePlaceholder: "பொருளாளர் {number} முழு பெயர்",
    dietaryRequirements: "உணவு தேவைகள்",
    dietaryPlaceholder: "ஏதேனும் ஒவ்வாமை, உணவு கட்டுப்பாடுகள் அல்லது சிறப்பு உணவு விருப்பங்கள் பற்றி எங்களுக்குத் தெரியப்படுத்துங்கள்...",
    questionsComments: "கேள்விகள் அல்லது கருத்துக்கள்",
    questionsPlaceholder: "திருமணம், பயணம் அல்லது தங்குமிடம் பற்றி உங்களுக்கு ஏதேனும் கேள்விகள் உள்ளதா? நாங்கள் உதவ இங்கே இருக்கிறோம்!",
    submitRSVP: "பதில் சமர்ப்பி",
    thankYouTitle: "நன்றி!",
    thankYouAttending: "உங்கள் பதில் பெறப்பட்டது. உங்களுடன் கொண்டாட நாங்கள் மகிழ்ச்சியடைகிறோம்!",
    thankYouNotAttending: "உங்கள் பதில் பெறப்பட்டது. நீங்கள் வர முடியாது என்று கேட்டு வருந்துகிறோம்!",
    backToHome: "முகப்புக்கு திறக்கு",
  },
}

export function useTranslation(language = "en"): Translation {
  return translations[language] || translations.en
}
