import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const results = []

    // Test database connection
    try {
      const connectionTest = await sql`SELECT 1 as test`
      results.push({
        test: "Database Connection",
        status: connectionTest.length > 0 ? "PASS" : "FAIL",
        message: connectionTest.length > 0 ? "Connected successfully" : "Connection failed",
      })
    } catch (error) {
      results.push({
        test: "Database Connection",
        status: "FAIL",
        message: `Connection error: ${error}`,
      })
    }

    // Test table existence
    const tables = [
      "guests",
      "budget_items",
      "wedding_settings",
      "content_pages",
      "spreadsheets",
      "admin_sessions",
      "site_access_sessions",
    ]

    for (const table of tables) {
      try {
        const tableCheck = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        `

        results.push({
          test: `Table: ${table}`,
          status: tableCheck.length > 0 ? "PASS" : "FAIL",
          message: tableCheck.length > 0 ? "Table exists" : "Table missing",
        })
      } catch (error) {
        results.push({
          test: `Table: ${table}`,
          status: "FAIL",
          message: `Error checking table: ${error}`,
        })
      }
    }

    // Test API endpoints
    const apiTests = [
      { endpoint: "/api/guests", method: "GET", name: "Guests API" },
      { endpoint: "/api/budget", method: "GET", name: "Budget API" },
      { endpoint: "/api/settings", method: "GET", name: "Settings API" },
      { endpoint: "/api/content", method: "GET", name: "Content API" },
      { endpoint: "/api/spreadsheets", method: "GET", name: "Spreadsheets API" },
    ]

    for (const apiTest of apiTests) {
      try {
        const baseUrl = request.nextUrl.origin
        const response = await fetch(`${baseUrl}${apiTest.endpoint}`, {
          method: apiTest.method,
        })

        results.push({
          test: apiTest.name,
          status: response.ok ? "PASS" : "FAIL",
          message: response.ok
            ? `${apiTest.method} ${apiTest.endpoint} successful`
            : `${apiTest.method} ${apiTest.endpoint} failed with status ${response.status}`,
        })
      } catch (error) {
        results.push({
          test: apiTest.name,
          status: "FAIL",
          message: `API test failed: ${error}`,
        })
      }
    }

    const passCount = results.filter((r) => r.status === "PASS").length
    const failCount = results.filter((r) => r.status === "FAIL").length
    const successRate = ((passCount / results.length) * 100).toFixed(1)

    return NextResponse.json({
      success: failCount === 0,
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount,
        successRate: `${successRate}%`,
      },
      results,
    })
  } catch (error) {
    console.error("Migration test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run migration tests",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
