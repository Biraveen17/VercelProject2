import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (token) {
      await sql`DELETE FROM admin_sessions WHERE session_id = ${token}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
