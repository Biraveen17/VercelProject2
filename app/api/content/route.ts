import { sql } from "@/lib/neon"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
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
    const contentData = await request.json()

    // Update each page
    for (const [pageKey, pageData] of Object.entries(contentData)) {
      const page = pageData as any
      await sql`
        INSERT INTO content_pages (
          id, page_key, title, description, content, enabled, page_order, updated_at
        ) VALUES (
          ${pageKey}, ${pageKey}, ${page.title}, ${page.description}, ${page.content},
          ${page.enabled}, ${page.order}, NOW()
        )
        ON CONFLICT (page_key) DO UPDATE SET
          title = ${page.title},
          description = ${page.description},
          content = ${page.content},
          enabled = ${page.enabled},
          page_order = ${page.order},
          updated_at = NOW()
      `
    }

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
