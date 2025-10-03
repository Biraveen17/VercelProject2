import { NextResponse } from "next/server"
import { getContentCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getContentCollection()
    const content = await collection.findOne({ type: "wedding_content" })

    if (!content) {
      // Return default content if none exists
      const defaultContent = {
        type: "wedding_content",
        home: {
          title: "Varnie & Biraveen",
          description: "Together with our families, we invite you to celebrate our Tamil Hindu wedding",
          content: "We are thrilled to invite you to join us as we begin our journey together as husband and wife...",
          enabled: true,
          order: 1,
        },
        events: {
          title: "Wedding Events",
          description: "Join us for two beautiful days of celebration in the stunning setting of Paphos, Cyprus",
          content:
            "Our celebration will include traditional Tamil Hindu ceremonies and modern reception festivities...",
          enabled: true,
          order: 2,
        },
        venue: {
          title: "Venue & Location",
          description: "Discover the beautiful venues in Paphos, Cyprus where we'll celebrate our special day",
          content: "Both our ceremony and reception will take place in stunning beachfront locations...",
          enabled: true,
          order: 3,
        },
        gallery: {
          title: "Our Gallery",
          description: "Capturing the beautiful moments of our journey together",
          content: "Browse through our engagement photos and pre-wedding celebrations...",
          enabled: true,
          order: 5,
        },
        travel: {
          title: "Travel to Cyprus",
          description: "Everything you need to know for your journey to our wedding in beautiful Paphos, Cyprus",
          content: "Cyprus is easily accessible from major European cities with direct flights to Paphos...",
          enabled: true,
          order: 4,
        },
        lastUpdated: new Date().toISOString(),
      }
      await collection.insertOne(defaultContent)
      return NextResponse.json(defaultContent)
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const collection = await getContentCollection()

    const updatedContent = {
      ...body,
      type: "wedding_content",
      lastUpdated: new Date().toISOString(),
    }

    await collection.updateOne({ type: "wedding_content" }, { $set: updatedContent }, { upsert: true })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error("[v0] Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
