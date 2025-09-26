import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

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
    console.log("[v0] Login attempt for username:", username)

    // Validate credentials
    const user = ADMIN_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

    if (!user) {
      console.log("[v0] Invalid credentials")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    console.log("[v0] Creating session with token:", token)

    const sessionsCollection = await getCollection("admin_sessions")
    await sessionsCollection.insertOne({
      session_id: token,
      username: user.username,
      user_data: user,
      expires_at: expiresAt,
      created_at: new Date(),
    })

    console.log("[v0] Session created successfully")

    return NextResponse.json({
      success: true,
      token: token,
      user: { username: user.username, name: user.name },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
