import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (token) {
      const sessionsCollection = await getCollection("admin_sessions")
      await sessionsCollection.deleteOne({ session_id: token })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
