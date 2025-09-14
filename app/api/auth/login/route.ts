import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface AdminUser {
  username: string
  password: string
  name: string
}

const ADMIN_USERS: AdminUser[] = [
  {
    username: "Biraveen",
    password: "Kalyanam2026",
    name: "Biraveen (Groom)",
  },
  {
    username: "Varnie",
    password: "Kalyanam 2026",
    name: "Varnie (Bride)",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    const user = ADMIN_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session in database
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await sql`
      INSERT INTO admin_sessions (session_id, username, user_data, expires_at, created_at)
      VALUES (${sessionId}, ${user.username}, ${JSON.stringify(user)}, ${expiresAt.toISOString()}, ${new Date().toISOString()})
    `

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: { username: user.username, name: user.name },
    })

    response.cookies.set("wedding_admin_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
