import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    console.log("[v0] Session check - token:", token ? "present" : "missing")

    if (!token) {
      console.log("[v0] No authorization token found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const sessions = await sql`
      SELECT * FROM admin_sessions 
      WHERE session_id = ${token} AND expires_at > NOW()
    `

    console.log("[v0] Database session found:", sessions.length > 0 ? "yes" : "no")

    if (sessions.length === 0) {
      console.log("[v0] Session expired or doesn't exist")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = sessions[0]
    const userData = typeof session.user_data === "string" ? JSON.parse(session.user_data) : session.user_data
    console.log("[v0] Session valid for user:", userData.username)

    return NextResponse.json({
      authenticated: true,
      user: { username: userData.username, name: userData.name },
    })
  } catch (error) {
    console.error("[v0] Session check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
