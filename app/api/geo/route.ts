import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // Get country from Vercel's geo headers
  const country = request.geo?.country || request.headers.get("x-vercel-ip-country") || "US"

  return NextResponse.json({ country })
}
