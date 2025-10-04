import { MongoClient, type Db, type Collection } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
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

// Database and collection helpers
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("wedding-website")
}

export async function getGuestsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("guests")
}

export async function getBudgetCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("budget")
}

export async function getSettingsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("settings")
}

export async function getSpreadsheetCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("spreadsheet")
}

export async function getGroupsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("groups")
}

export async function getPageVisitsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("pageVisits")
}

export default clientPromise
