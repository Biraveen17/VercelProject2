import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

async function validateSession(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return { authenticated: false, error: "No authorization token" }
    }

    // Check session in database
    const sessions = await sql`
      SELECT session_id, username, user_data, expires_at
      FROM admin_sessions 
      WHERE session_id = ${token}
      AND expires_at > ${new Date().toISOString()}
    `

    if (sessions.length === 0) {
      return { authenticated: false, error: "Invalid or expired session" }
    }

    return { authenticated: true, session: sessions[0] }
  } catch (error) {
    console.error("Session validation error:", error)
    return { authenticated: false, error: "Session validation failed" }
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateSession(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const pages = await sql`
      SELECT * FROM content_pages 
      ORDER BY page_order ASC
    `

    // Transform database format back to frontend format
    const contentData: any = {}
    pages.forEach((page: any) => {
      contentData[page.page_key] = {
        title: page.title,
        description: page.description,
        content: page.content,
        enabled: page.enabled,
        order: page.page_order,
      }
    })

    return NextResponse.json({ data: contentData })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await validateSession(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const contentData = await request.json()

    // Update each page
    for (const [pageKey, pageData] of Object.entries(contentData)) {
      const page = pageData as any
      await sql`
        INSERT INTO content_pages (
          id, page_key, title, description, content, enabled, page_order, updated_at
        ) VALUES (
          ${pageKey}, ${pageKey}, ${page.title}, ${page.description}, ${page.content},
          ${Boolean(page.enabled)}, ${Number(page.order)}, NOW()
        )
        ON CONFLICT (page_key) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          content = EXCLUDED.content,
          enabled = EXCLUDED.enabled,
          page_order = EXCLUDED.page_order,
          updated_at = NOW()
      `
    }

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
