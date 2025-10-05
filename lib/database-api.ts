import type { Guest, BudgetItem, WeddingSettings } from "./database"

// Budget API functions
export async function getBudgetItems(): Promise<BudgetItem[]> {
  try {
    const response = await fetch("/api/budget")
    if (!response.ok) {
      throw new Error("Failed to fetch budget items")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching budget items:", error)
    return []
  }
}

export async function addBudgetItem(item: Omit<BudgetItem, "id" | "lastUpdated">): Promise<void> {
  try {
    const response = await fetch("/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      throw new Error("Failed to add budget item")
    }
  } catch (error) {
    console.error("Error adding budget item:", error)
    throw error
  }
}

export async function updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<void> {
  try {
    const response = await fetch(`/api/budget/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update budget item")
    }
  } catch (error) {
    console.error("Error updating budget item:", error)
    throw error
  }
}

export async function deleteBudgetItem(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/budget/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete budget item")
    }
  } catch (error) {
    console.error("Error deleting budget item:", error)
    throw error
  }
}

// Guest API functions
export async function getGuests(): Promise<Guest[]> {
  try {
    const response = await fetch("/api/guests")
    if (!response.ok) {
      throw new Error("Failed to fetch guests")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching guests:", error)
    return []
  }
}

export async function addGuest(guest: Omit<Guest, "id" | "lastUpdated">): Promise<void> {
  try {
    const response = await fetch("/api/guests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guest),
    })

    if (!response.ok) {
      throw new Error("Failed to add guest")
    }
  } catch (error) {
    console.error("Error adding guest:", error)
    throw error
  }
}

export async function updateGuest(id: string, updates: Partial<Guest>): Promise<void> {
  try {
    const response = await fetch(`/api/guests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update guest")
    }
  } catch (error) {
    console.error("Error updating guest:", error)
    throw error
  }
}

export async function deleteGuest(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/guests/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete guest")
    }
  } catch (error) {
    console.error("Error deleting guest:", error)
    throw error
  }
}

// RSVP function
export async function submitRSVP(rsvpData: {
  name: string
  isAttending: boolean
  events: ("ceremony" | "reception")[]
  dietaryRequirements: string
  questions: string
}): Promise<void> {
  try {
    const response = await fetch("/api/guests/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rsvpData),
    })

    if (!response.ok) {
      throw new Error("Failed to submit RSVP")
    }
  } catch (error) {
    console.error("Error submitting RSVP:", error)
    throw error
  }
}

// Helper functions that work with API data
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

// Keep settings functions using localStorage for now (can be migrated later if needed)
export function getSettings(): WeddingSettings {
  if (typeof window === "undefined") {
    return {
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
  }
  const settings = localStorage.getItem("wedding_settings")
  return settings
    ? JSON.parse(settings)
    : {
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
}

export function saveSettings(settings: WeddingSettings): void {
  localStorage.setItem("wedding_settings", JSON.stringify(settings))
}
