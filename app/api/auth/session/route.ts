import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    console.log("[v0] Session check - token:", token ? "present" : "missing")

    if (!token) {
      console.log("[v0] No authorization token found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const sessionsCollection = await getCollection("admin_sessions")
    const session = await sessionsCollection.findOne({
      session_id: token,
      expires_at: { $gt: new Date() },
    })

    console.log("[v0] Database session found:", session ? "yes" : "no")

    if (!session) {
      console.log("[v0] Session expired or doesn't exist")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const userData = session.user_data
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
