import { MongoClient, type Db, type Collection } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("wedding_website")
}

// Collection helpers
export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(name)
}

// Database initialization function
export async function initializeDatabase() {
  try {
    const db = await getDatabase()

    // Create collections with validation schemas
    const collections = [
      "guests",
      "budget_items",
      "wedding_settings",
      "content_pages",
      "spreadsheets",
      "admin_sessions",
    ]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } catch (error: any) {
        if (error.code === 48) {
          console.log(`Collection ${collectionName} already exists`)
        } else {
          throw error
        }
      }
    }

    // Create indexes for better performance
    const guestsCollection = await getCollection("guests")
    await guestsCollection.createIndex({ type: 1 })
    await guestsCollection.createIndex({ group_name: 1 })
    await guestsCollection.createIndex({ rsvp_status: 1 })
    await guestsCollection.createIndex({ side: 1 })

    const budgetCollection = await getCollection("budget_items")
    await budgetCollection.createIndex({ category1: 1 })
    await budgetCollection.createIndex({ status: 1 })

    const contentCollection = await getCollection("content_pages")
    await contentCollection.createIndex({ page_key: 1 }, { unique: true })
    await contentCollection.createIndex({ enabled: 1 })

    const sessionsCollection = await getCollection("admin_sessions")
    await sessionsCollection.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}

// Helper function to insert default settings if they don't exist
export async function insertDefaultSettings() {
  try {
    const settingsCollection = await getCollection("wedding_settings")

    const existingSettings = await settingsCollection.findOne({ _id: "default" })

    if (!existingSettings) {
      await settingsCollection.insertOne({
        _id: "default",
        bride_name: "Varnie",
        groom_name: "Biraveen",
        wedding_date: "2026-03-27",
        ceremony_date: "2026-03-27",
        reception_date: "2026-03-28",
        venue: "Paphos, Cyprus",
        location: "Cyprus",
        allow_video_download: true,
        allow_video_fullscreen: true,
        updated_at: new Date(),
      })
    }

    // Insert default content pages if they don't exist
    const contentCollection = await getCollection("content_pages")
    const defaultPages = [
      {
        _id: "home",
        page_key: "home",
        title: "Varnie & Biraveen",
        description: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
        content: "We are thrilled to invite you to join us as we begin our journey together as husband and wife...",
        enabled: true,
        page_order: 1,
        updated_at: new Date(),
      },
      {
        _id: "events",
        page_key: "events",
        title: "Wedding Events",
        description: "Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus",
        content: "Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities...",
        enabled: true,
        page_order: 2,
        updated_at: new Date(),
      },
      {
        _id: "venue",
        page_key: "venue",
        title: "Venue & Location",
        description: "Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day",
        content: "Both our ceremony and reception will take place in stunning beachfront locations...",
        enabled: true,
        page_order: 3,
        updated_at: new Date(),
      },
      {
        _id: "travel",
        page_key: "travel",
        title: "Travel to Cyprus",
        description: "Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus",
        content: "Cyprus is easily accessible from major European cities with direct flights to Paphos...",
        enabled: true,
        page_order: 4,
        updated_at: new Date(),
      },
      {
        _id: "gallery",
        page_key: "gallery",
        title: "Our Gallery",
        description: "Capturing the beautiful moments of our journey together",
        content: "Browse through our engagement photos and pre-wedding celebrations...",
        enabled: true,
        page_order: 5,
        updated_at: new Date(),
      },
    ]

    for (const page of defaultPages) {
      const existing = await contentCollection.findOne({ page_key: page.page_key })
      if (!existing) {
        await contentCollection.insertOne(page)
      }
    }

    console.log("Default data inserted successfully")
    return true
  } catch (error) {
    console.error("Failed to insert default data:", error)
    return false
  }
}
