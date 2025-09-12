export interface Guest {
  id: string
  type: "individual" | "group"
  groupName?: string
  guestName?: string
  maxGroupSize?: number
  groupMembers?: string[]
  notes?: string
  rsvpStatus: "pending" | "attending" | "not-attending"
  events: ("ceremony" | "reception")[]
  dietaryRequirements?: string
  questions?: string
  lastUpdated: string
}

export interface BudgetItem {
  id: string
  category1: string
  category2: string
  itemName: string
  vendor: string
  cost: number
  status: "planned" | "booked" | "paid"
  notes?: string
  lastUpdated: string
}

export interface WeddingSettings {
  brideName: string
  groomName: string
  weddingDate: string
  ceremonyDate: string
  receptionDate: string
  venue: string
  location: string
}

// Default settings
const DEFAULT_SETTINGS: WeddingSettings = {
  brideName: "Varnie",
  groomName: "Biraveen",
  weddingDate: "2026-03-27",
  ceremonyDate: "2026-03-27",
  receptionDate: "2026-03-28",
  venue: "Paphos, Cyprus",
  location: "Cyprus",
}

// Guest management
export function getGuests(): Guest[] {
  if (typeof window === "undefined") return []
  const guests = localStorage.getItem("wedding_guests")
  return guests ? JSON.parse(guests) : []
}

export function saveGuests(guests: Guest[]): void {
  localStorage.setItem("wedding_guests", JSON.stringify(guests))
}

export function addGuest(guest: Omit<Guest, "id" | "lastUpdated">): void {
  const guests = getGuests()
  const newGuest: Guest = {
    ...guest,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString(),
  }
  guests.push(newGuest)
  saveGuests(guests)
}

export function updateGuest(id: string, updates: Partial<Guest>): void {
  const guests = getGuests()
  const index = guests.findIndex((g) => g.id === id)
  if (index !== -1) {
    guests[index] = { ...guests[index], ...updates, lastUpdated: new Date().toISOString() }
    saveGuests(guests)
  }
}

export function deleteGuest(id: string): void {
  const guests = getGuests()
  const filtered = guests.filter((g) => g.id !== id)
  saveGuests(filtered)
}

// Budget management
export function getBudgetItems(): BudgetItem[] {
  if (typeof window === "undefined") return []
  const items = localStorage.getItem("wedding_budget")
  return items ? JSON.parse(items) : []
}

export function saveBudgetItems(items: BudgetItem[]): void {
  localStorage.setItem("wedding_budget", JSON.stringify(items))
}

export function addBudgetItem(item: Omit<BudgetItem, "id" | "lastUpdated">): void {
  const items = getBudgetItems()
  const newItem: BudgetItem = {
    ...item,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString(),
  }
  items.push(newItem)
  saveBudgetItems(items)
}

export function updateBudgetItem(id: string, updates: Partial<BudgetItem>): void {
  const items = getBudgetItems()
  const index = items.findIndex((i) => i.id === id)
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, lastUpdated: new Date().toISOString() }
    saveBudgetItems(items)
  }
}

export function deleteBudgetItem(id: string): void {
  const items = getBudgetItems()
  const filtered = items.filter((i) => i.id !== id)
  saveBudgetItems(filtered)
}

// Settings management
export function getSettings(): WeddingSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  const settings = localStorage.getItem("wedding_settings")
  return settings ? JSON.parse(settings) : DEFAULT_SETTINGS
}

export function saveSettings(settings: WeddingSettings): void {
  localStorage.setItem("wedding_settings", JSON.stringify(settings))
}

// RSVP management
export function findGuestForRSVP(name: string): Guest | null {
  const guests = getGuests()
  const normalizedName = name.toLowerCase().trim()

  // First check individual guests
  const individual = guests.find((g) => g.type === "individual" && g.guestName?.toLowerCase().trim() === normalizedName)

  if (individual) return individual

  // Then check group names
  const group = guests.find((g) => g.type === "group" && g.groupName?.toLowerCase().trim() === normalizedName)

  return group || null
}

export function submitGroupRSVP(
  groupGuest: Guest,
  rsvpData: {
    isAttending: boolean
    events: ("ceremony" | "reception")[]
    dietaryRequirements: string
    questions: string
    groupMembers: string[]
  },
): void {
  const guests = getGuests()

  // Remove the original group entry
  const filteredGuests = guests.filter((g) => g.id !== groupGuest.id)

  // Create individual guest entries for each group member
  const filledMembers = rsvpData.groupMembers.filter((member) => member.trim() !== "")

  filledMembers.forEach((memberName, index) => {
    const memberGuest: Guest = {
      id: `${Date.now()}_${index}`,
      type: "individual",
      guestName: memberName.trim(),
      groupName: groupGuest.groupName, // Link to original group
      rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
      events: rsvpData.isAttending ? rsvpData.events : [],
      dietaryRequirements: rsvpData.isAttending ? rsvpData.dietaryRequirements : "",
      questions: rsvpData.questions,
      notes: `Group member ${index + 1} of ${groupGuest.groupName}`,
      lastUpdated: new Date().toISOString(),
    }
    filteredGuests.push(memberGuest)
  })

  saveGuests(filteredGuests)
}
