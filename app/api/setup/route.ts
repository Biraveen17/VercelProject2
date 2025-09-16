import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("[v0] Starting database setup...")

    // Create admin_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        token VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `
    console.log("[v0] Created admin_sessions table")

    // Create guests table
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        dietary_restrictions TEXT,
        plus_one BOOLEAN DEFAULT FALSE,
        plus_one_name VARCHAR(255),
        group_name VARCHAR(255),
        rsvp_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Created guests table")

    // Insert default admin user if not exists
    const existingAdmin = await sql`
      SELECT * FROM admin_sessions WHERE username = 'admin' LIMIT 1
    `

    if (existingAdmin.length === 0) {
      console.log("[v0] Creating default admin session...")
      // Create a long-lasting admin session for initial setup
      const token = "token_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await sql`
        INSERT INTO admin_sessions (token, user_id, username, expires_at)
        VALUES (${token}, 1, 'admin', ${expiresAt.toISOString()})
      `
      console.log("[v0] Default admin session created with token:", token)

      return Response.json({
        success: true,
        message: "Database setup complete",
        adminToken: token,
      })
    }

    return Response.json({
      success: true,
      message: "Database setup complete - admin already exists",
    })
  } catch (error) {
    console.error("[v0] Database setup error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
