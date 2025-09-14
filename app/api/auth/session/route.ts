import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    console.log("[v0] Session check - token:", token ? "present" : "missing")

    if (!token) {
      console.log("[v0] No authorization token found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Check session in database
    const sessions = await sql`
      SELECT session_id, username, user_data, expires_at
      FROM admin_sessions 
      WHERE session_id = ${token}
      AND expires_at > ${new Date().toISOString()}
    `

    console.log("[v0] Database sessions found:", sessions.length)

    if (sessions.length === 0) {
      console.log("[v0] Session expired or doesn't exist")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = sessions[0]
    const userData = JSON.parse(session.user_data as string)
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
