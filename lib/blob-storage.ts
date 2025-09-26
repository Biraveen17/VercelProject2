import { put, del } from "@vercel/blob"

export interface GuestData {
  id: string
  name: string
  email?: string
  phone?: string
  group?: string
  rsvpStatus?: "pending" | "attending" | "not-attending"
  dietaryRestrictions?: string
  plusOne?: boolean
  createdAt: string
  updatedAt: string
}

export interface BudgetItem {
  id: string
  category: string
  item: string
  estimatedCost: number
  actualCost?: number
  paid: boolean
  vendor?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  id: string
  coupleNames: string
  weddingDate: string
  venue: string
  rsvpDeadline: string
  welcomeMessage: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Generic functions for blob storage
export async function saveToBlob<T>(filename: string, data: T[]): Promise<void> {
  const blob = await put(filename, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
  })
  console.log(`Saved ${filename} to blob:`, blob.url)
}

export async function loadFromBlob<T>(filename: string): Promise<T[]> {
  try {
    const response = await fetch(`https://blob.vercel-storage.com/${filename}`)
    if (!response.ok) {
      if (response.status === 404) {
        return [] // Return empty array if file doesn't exist
      }
      throw new Error(`Failed to load ${filename}: ${response.statusText}`)
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return []
  }
}

export async function deleteFromBlob(filename: string): Promise<void> {
  try {
    await del(`https://blob.vercel-storage.com/${filename}`)
    console.log(`Deleted ${filename} from blob`)
  } catch (error) {
    console.error(`Error deleting ${filename}:`, error)
  }
}

// Specific functions for each data type
export async function saveGuests(guests: GuestData[]): Promise<void> {
  await saveToBlob("guests.json", guests)
}

export async function loadGuests(): Promise<GuestData[]> {
  return await loadFromBlob<GuestData>("guests.json")
}

export async function saveBudget(budget: BudgetItem[]): Promise<void> {
  await saveToBlob("budget.json", budget)
}

export async function loadBudget(): Promise<BudgetItem[]> {
  return await loadFromBlob<BudgetItem>("budget.json")
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await saveToBlob("settings.json", [settings])
}

export async function loadSettings(): Promise<SiteSettings | null> {
  const settings = await loadFromBlob<SiteSettings>("settings.json")
  return settings.length > 0 ? settings[0] : null
}

// Helper function to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
