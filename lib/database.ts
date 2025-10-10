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
  side?: "bride" | "groom" // Added side field
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
  allowVideoDownload: boolean
  allowVideoFullscreen: boolean
}

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departureAirport: string
  departureAirportName: string
  arrivalAirport: string
  arrivalAirportName: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  notes?: string
  lastUpdated: string
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
  allowVideoDownload: true,
  allowVideoFullscreen: true,
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

  if (guest.type === "group" && guest.maxGroupSize) {
    guests.push(newGuest)
  } else {
    guests.push(newGuest)
  }

  saveGuests(guests)
}

export function updateGuest(id: string, updates: Partial<Guest>): void {
  const guests = getGuests()
  const index = guests.findIndex((g) => g.id === id)
  if (index !== -1) {
    const currentGuest = guests[index]

    if (updates.groupName && updates.groupName !== currentGuest.groupName) {
      // Remove from current group if any
      if (currentGuest.groupName) {
        // Update the guest to be individual or move to new group
        guests[index] = {
          ...currentGuest,
          ...updates,
          groupName: updates.groupName === "Individual" ? undefined : updates.groupName,
          lastUpdated: new Date().toISOString(),
        }
      } else {
        // Moving individual to a group
        guests[index] = {
          ...currentGuest,
          ...updates,
          groupName: updates.groupName === "Individual" ? undefined : updates.groupName,
          lastUpdated: new Date().toISOString(),
        }
      }
    } else {
      guests[index] = { ...currentGuest, ...updates, lastUpdated: new Date().toISOString() }
    }

    saveGuests(guests)
  }
}

export function deleteGuest(id: string): void {
  const guests = getGuests()
  const filtered = guests.filter((g) => g.id !== id)
  saveGuests(filtered)
}

export function checkDuplicateGuest(name: string, groupName?: string, excludeId?: string): boolean {
  const guests = getGuests()
  const normalizedName = name.toLowerCase().trim()
  const normalizedGroupName = groupName?.toLowerCase().trim()

  return guests.some((guest) => {
    // Skip the guest being edited
    if (excludeId && guest.id === excludeId) return false

    // Check individual guest names
    if (guest.guestName && guest.guestName.toLowerCase().trim() === normalizedName) return true

    // Check group names
    if (guest.groupName && guest.groupName.toLowerCase().trim() === normalizedName) return true

    // Check if the new name matches any existing group name when adding individual
    if (!groupName && guest.groupName && guest.groupName.toLowerCase().trim() === normalizedName) return true

    // Check if the new group name matches any existing individual guest name
    if (normalizedGroupName && guest.guestName && guest.guestName.toLowerCase().trim() === normalizedGroupName)
      return true

    // Check group members
    if (guest.groupMembers) {
      return guest.groupMembers.some((member) => member.toLowerCase().trim() === normalizedName)
    }

    return false
  })
}

export function addGuestToGroup(groupName: string, guestName: string): boolean {
  const guests = getGuests()
  const group = guests.find(
    (g) => g.type === "group" && g.groupName?.toLowerCase().trim() === groupName.toLowerCase().trim(),
  )

  if (!group || !group.maxGroupSize) return false

  const currentMembers = group.groupMembers?.filter((m) => m.trim()) || []
  if (currentMembers.length >= group.maxGroupSize) return false

  const updatedMembers = [...(group.groupMembers || [])]
  const emptyIndex = updatedMembers.findIndex((m) => !m.trim())

  if (emptyIndex !== -1) {
    updatedMembers[emptyIndex] = guestName.trim()
  } else {
    updatedMembers.push(guestName.trim())
  }

  updateGuest(group.id, { groupMembers: updatedMembers })
  return true
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

  const group = guests.find((g) => g.type === "group" && g.groupName?.toLowerCase().trim() === normalizedName)
  if (group) return group

  const groupWithMember = guests.find(
    (g) => g.type === "group" && g.groupMembers?.some((member) => member.toLowerCase().trim() === normalizedName),
  )
  if (groupWithMember) return groupWithMember

  const individual = guests.find(
    (g) => g.type === "individual" && !g.groupName && g.guestName?.toLowerCase().trim() === normalizedName,
  )

  return individual || null
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

  const updatedGroupHeader: Guest = {
    ...groupGuest,
    rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
    events: rsvpData.isAttending ? rsvpData.events : [],
    questions: rsvpData.questions,
    lastUpdated: new Date().toISOString(),
  }

  // Remove the old group header and any existing group members
  const filteredGuests = guests.filter((g) => g.id !== groupGuest.id && g.groupName !== groupGuest.groupName)

  // Add the updated group header
  filteredGuests.push(updatedGroupHeader)

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
      side: groupGuest.side, // Preserve the side from the original group
      notes: `Group member ${index + 1} of ${groupGuest.groupName}`,
      lastUpdated: new Date().toISOString(),
    }
    filteredGuests.push(memberGuest)
  })

  saveGuests(filteredGuests)
}

export function submitIndividualRSVP(
  guest: Guest,
  rsvpData: {
    isAttending: boolean
    events: ("ceremony" | "reception")[]
    dietaryRequirements: string
    questions: string
  },
): void {
  updateGuest(guest.id, {
    rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
    events: rsvpData.isAttending ? rsvpData.events : [],
    dietaryRequirements: rsvpData.isAttending ? rsvpData.dietaryRequirements : "",
    questions: rsvpData.questions,
  })
}

// Admin login history management
export function getAdminLoginHistory(): { lastLogin: string; changes: string[] } {
  if (typeof window === "undefined") return { lastLogin: "", changes: [] }
  const history = localStorage.getItem("admin_login_history")
  return history ? JSON.parse(history) : { lastLogin: "", changes: [] }
}

export function updateAdminLoginHistory(): void {
  const currentTime = new Date().toISOString()
  const history = getAdminLoginHistory()

  // Get changes since last login
  const changes: string[] = []
  const guests = getGuests()
  const budgetItems = getBudgetItems()

  if (history.lastLogin) {
    const lastLoginTime = new Date(history.lastLogin)

    // Check for guest changes
    const recentGuestChanges = guests.filter((g) => new Date(g.lastUpdated) > lastLoginTime)
    if (recentGuestChanges.length > 0) {
      changes.push(`${recentGuestChanges.length} guest(s) updated`)
    }

    // Check for budget changes
    const recentBudgetChanges = budgetItems.filter((b) => new Date(b.lastUpdated) > lastLoginTime)
    if (recentBudgetChanges.length > 0) {
      changes.push(`${recentBudgetChanges.length} budget item(s) updated`)
    }
  }

  localStorage.setItem(
    "admin_login_history",
    JSON.stringify({
      lastLogin: currentTime,
      changes: changes,
    }),
  )
}

// Additional functions for group management
export function isGroupHeader(guest: Guest): boolean {
  return guest.type === "group" && !guest.guestName && !!guest.groupName && !!guest.maxGroupSize
}

export function getGroupHeader(groupName: string): Guest | null {
  const guests = getGuests()
  return guests.find((g) => g.type === "group" && g.groupName === groupName && !g.guestName) || null
}

// Flight management
