import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const SITE_PASSWORDS = ["kalyanam2026", "varniebiraveen"]

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Validate site access password
    const isValid = SITE_PASSWORDS.some((validPassword) => validPassword.toLowerCase() === password.toLowerCase())

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Create site access session
    const sessionId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sql`
      INSERT INTO site_access_sessions (session_id, expires_at, created_at)
      VALUES (${sessionId}, ${expiresAt.toISOString()}, ${new Date().toISOString()})
    `

    // Set site access cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("wedding_site_access", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Site access error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("wedding_site_access")?.value

    if (!sessionId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    // Check site access session in database
    const sessions = await sql`
      SELECT session_id, expires_at
      FROM site_access_sessions 
      WHERE session_id = ${sessionId}
      AND expires_at > ${new Date().toISOString()}
    `

    if (sessions.length === 0) {
      // Session expired or doesn't exist
      const response = NextResponse.json({ hasAccess: false }, { status: 401 })
      response.cookies.delete("wedding_site_access")
      return response
    }

    return NextResponse.json({ hasAccess: true })
  } catch (error) {
    console.error("Site access check error:", error)
    return NextResponse.json({ hasAccess: false }, { status: 500 })
  }
}
