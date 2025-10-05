import { getCollection } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

async function validateSession(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return { authenticated: false, error: "No authorization token" }
    }

    const sessionsCollection = await getCollection("admin_sessions")
    const session = await sessionsCollection.findOne({
      session_id: token,
      expires_at: { $gt: new Date() },
    })

    if (!session) {
      return { authenticated: false, error: "Invalid or expired session" }
    }

    return { authenticated: true, session }
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

    const contentCollection = await getCollection("content_pages")
    const pages = await contentCollection.find({}).sort({ page_order: 1 }).toArray()

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

    const contentCollection = await getCollection("content_pages")

    // Update each page
    for (const [pageKey, pageData] of Object.entries(contentData)) {
      const page = pageData as any
      const pageDoc = {
        _id: pageKey,
        page_key: pageKey,
        title: page.title,
        description: page.description,
        content: page.content,
        enabled: Boolean(page.enabled),
        page_order: Number(page.order),
        updated_at: new Date().toISOString(),
      }

      await contentCollection.findOneAndUpdate({ page_key: pageKey }, { $set: pageDoc }, { upsert: true })
    }

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
