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
export async function getGuests(): Promise<Guest[]> {
  try {
    const response = await fetch("/api/guests")
    if (!response.ok) {
      throw new Error("Failed to fetch guests")
    }
    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching guests:", error)
    return []
  }
}

export function saveGuests(guests: Guest[]): void {
  // This function is now deprecated - individual operations should use API calls
  console.warn("saveGuests is deprecated - use individual API operations instead")
}

export async function addGuest(guest: Omit<Guest, "id" | "lastUpdated">): Promise<Guest | null> {
  try {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    }

    const response = await fetch("/api/guests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGuest),
    })

    if (!response.ok) {
      throw new Error("Failed to add guest")
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error adding guest:", error)
    return null
  }
}

export async function updateGuest(id: string, updates: Partial<Guest>): Promise<boolean> {
  try {
    const updatedData = {
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    const response = await fetch(`/api/guests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
      throw new Error("Failed to update guest")
    }

    return true
  } catch (error) {
    console.error("Error updating guest:", error)
    return false
  }
}

export async function deleteGuest(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/guests/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete guest")
    }

    return true
  } catch (error) {
    console.error("Error deleting guest:", error)
    return false
  }
}

export async function checkDuplicateGuest(name: string, groupName?: string, excludeId?: string): Promise<boolean> {
  try {
    const guests = await getGuests()
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
  } catch (error) {
    console.error("Error checking duplicate guest:", error)
    return false
  }
}

export async function addGuestToGroup(groupName: string, guestName: string): Promise<boolean> {
  try {
    const guests = await getGuests()
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

    return await updateGuest(group.id, { groupMembers: updatedMembers })
  } catch (error) {
    console.error("Error adding guest to group:", error)
    return false
  }
}

// Budget management
export async function getBudgetItems(): Promise<BudgetItem[]> {
  try {
    const response = await fetch("/api/budget")
    if (!response.ok) {
      throw new Error("Failed to fetch budget items")
    }
    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return []
  }
}

export function saveBudgetItems(items: BudgetItem[]): void {
  // This function is now deprecated - individual operations should use API calls
  console.warn("saveBudgetItems is deprecated - use individual API operations instead")
}

export async function addBudgetItem(item: Omit<BudgetItem, "id" | "lastUpdated">): Promise<BudgetItem | null> {
  try {
    const newItem: BudgetItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    }

    const response = await fetch("/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })

    if (!response.ok) {
      throw new Error("Failed to add budget item")
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error adding budget item:", error)
    return null
  }
}

export async function updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<boolean> {
  try {
    const updatedData = {
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    const response = await fetch(`/api/budget/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
      throw new Error("Failed to update budget item")
    }

    return true
  } catch (error) {
    console.error("Error updating budget item:", error)
    return false
  }
}

export async function deleteBudgetItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/budget/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete budget item")
    }

    return true
  } catch (error) {
    console.error("Error deleting budget item:", error)
    return false
  }
}

// Settings management
export async function getSettings(): Promise<WeddingSettings> {
  try {
    const response = await fetch("/api/settings")
    if (!response.ok) {
      throw new Error("Failed to fetch settings")
    }
    const result = await response.json()
    return result.data || DEFAULT_SETTINGS
  } catch (error) {
    console.error("Error fetching settings:", error)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(settings: WeddingSettings): Promise<boolean> {
  try {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      throw new Error("Failed to save settings")
    }

    return true
  } catch (error) {
    console.error("Error saving settings:", error)
    return false
  }
}

// RSVP management
export async function findGuestForRSVP(name: string): Promise<Guest | null> {
  try {
    const guests = await getGuests()
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
  } catch (error) {
    console.error("Error finding guest for RSVP:", error)
    return null
  }
}

export async function submitGroupRSVP(
  groupGuest: Guest,
  rsvpData: {
    isAttending: boolean
    events: ("ceremony" | "reception")[]
    dietaryRequirements: string
    questions: string
    groupMembers: string[]
  },
): Promise<boolean> {
  try {
    const guests = await getGuests()

    const updatedGroupHeader: Guest = {
      ...groupGuest,
      rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
      events: rsvpData.isAttending ? rsvpData.events : [],
      questions: rsvpData.questions,
      lastUpdated: new Date().toISOString(),
    }

    // Update the group header
    await updateGuest(groupGuest.id, updatedGroupHeader)

    // Remove existing group members
    const existingMembers = guests.filter((g) => g.groupName === groupGuest.groupName && g.id !== groupGuest.id)
    for (const member of existingMembers) {
      await deleteGuest(member.id)
    }

    // Add new group members
    const filledMembers = rsvpData.groupMembers.filter((member) => member.trim() !== "")

    for (let index = 0; index < filledMembers.length; index++) {
      const memberName = filledMembers[index]
      const memberGuest: Omit<Guest, "id" | "lastUpdated"> = {
        type: "individual",
        guestName: memberName.trim(),
        groupName: groupGuest.groupName,
        rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
        events: rsvpData.isAttending ? rsvpData.events : [],
        dietaryRequirements: rsvpData.isAttending ? rsvpData.dietaryRequirements : "",
        questions: rsvpData.questions,
        side: groupGuest.side,
        notes: `Group member ${index + 1} of ${groupGuest.groupName}`,
      }
      await addGuest(memberGuest)
    }

    return true
  } catch (error) {
    console.error("Error submitting group RSVP:", error)
    return false
  }
}

export async function submitIndividualRSVP(
  guest: Guest,
  rsvpData: {
    isAttending: boolean
    events: ("ceremony" | "reception")[]
    dietaryRequirements: string
    questions: string
  },
): Promise<boolean> {
  try {
    return await updateGuest(guest.id, {
      rsvpStatus: rsvpData.isAttending ? "attending" : "not-attending",
      events: rsvpData.isAttending ? rsvpData.events : [],
      dietaryRequirements: rsvpData.isAttending ? rsvpData.dietaryRequirements : "",
      questions: rsvpData.questions,
    })
  } catch (error) {
    console.error("Error submitting individual RSVP:", error)
    return false
  }
}

// Admin login history management
export function getAdminLoginHistory(): { lastLogin: string; changes: string[] } {
  if (typeof window === "undefined") return { lastLogin: "", changes: [] }
  const history = localStorage.getItem("admin_login_history")
  return history ? JSON.parse(history) : { lastLogin: "", changes: [] }
}

export async function updateAdminLoginHistory(): Promise<void> {
  try {
    const currentTime = new Date().toISOString()
    const history = getAdminLoginHistory()

    // Get changes since last login
    const changes: string[] = []
    const guests = await getGuests()
    const budgetItems = await getBudgetItems()

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
  } catch (error) {
    console.error("Error updating admin login history:", error)
  }
}

// Additional functions for group management
export async function isGroupHeader(guest: Guest): Promise<boolean> {
  return guest.type === "group" && !guest.guestName && !!guest.groupName && !!guest.maxGroupSize
}

export async function getGroupHeader(groupName: string): Promise<Guest | null> {
  try {
    const guests = await getGuests()
    return guests.find((g) => g.type === "group" && g.groupName === groupName && !g.guestName) || null
  } catch (error) {
    console.error("Error getting group header:", error)
    return null
  }
}
