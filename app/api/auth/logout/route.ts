import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("wedding_admin_session")?.value

    if (sessionId) {
      // Remove session from database
      await sql`
        DELETE FROM admin_sessions 
        WHERE session_id = ${sessionId}
      `
    }

    // Clear session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete("wedding_admin_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
