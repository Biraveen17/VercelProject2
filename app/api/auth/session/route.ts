import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("wedding_admin_session")?.value

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Check session in database
    const sessions = await sql`
      SELECT session_id, username, user_data, expires_at
      FROM admin_sessions 
      WHERE session_id = ${sessionId}
      AND expires_at > ${new Date().toISOString()}
    `

    if (sessions.length === 0) {
      // Session expired or doesn't exist
      const response = NextResponse.json({ authenticated: false }, { status: 401 })
      response.cookies.delete("wedding_admin_session")
      return response
    }

    const session = sessions[0]
    const userData = JSON.parse(session.user_data as string)

    return NextResponse.json({
      authenticated: true,
      user: { username: userData.username, name: userData.name },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
