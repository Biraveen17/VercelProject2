import { initializeDatabase, insertDefaultSettings } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting database initialization...")

    const dbInitialized = await initializeDatabase()
    if (!dbInitialized) {
      throw new Error("Database initialization failed")
    }

    const defaultsInserted = await insertDefaultSettings()
    if (!defaultsInserted) {
      console.warn("[v0] Warning: Failed to insert default settings")
    }

    console.log("[v0] Database initialization completed successfully")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      collections: ["guests", "budget_items", "wedding_settings", "content_pages", "spreadsheets", "admin_sessions"],
    })
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
