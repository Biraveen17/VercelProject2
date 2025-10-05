// Test script to validate the localStorage to database migration
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface TestResult {
  test: string
  status: "PASS" | "FAIL"
  message: string
}

const results: TestResult[] = []

function addResult(test: string, status: "PASS" | "FAIL", message: string) {
  results.push({ test, status, message })
  console.log(`${status === "PASS" ? "✅" : "❌"} ${test}: ${message}`)
}

async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    if (result.length > 0 && result[0].test === 1) {
      addResult("Database Connection", "PASS", "Successfully connected to Neon database")
    } else {
      addResult("Database Connection", "FAIL", "Unexpected response from database")
    }
  } catch (error) {
    addResult("Database Connection", "FAIL", `Connection failed: ${error}`)
  }
}

async function testTableCreation() {
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
      const result = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${table}
      `

      if (result.length > 0) {
        addResult(`Table: ${table}`, "PASS", "Table exists in database")
      } else {
        addResult(`Table: ${table}`, "FAIL", "Table does not exist")
      }
    } catch (error) {
      addResult(`Table: ${table}`, "FAIL", `Error checking table: ${error}`)
    }
  }
}

async function testGuestOperations() {
  try {
    // Test inserting a guest
    const testGuest = {
      id: "test-guest-1",
      type: "individual",
      guest_name: "Test Guest",
      rsvp_status: "pending",
      events: JSON.stringify(["ceremony"]),
      side: "bride",
      last_updated: new Date().toISOString(),
    }

    await sql`
      INSERT INTO guests (id, type, guest_name, rsvp_status, events, side, last_updated)
      VALUES (${testGuest.id}, ${testGuest.type}, ${testGuest.guest_name}, ${testGuest.rsvp_status}, ${testGuest.events}, ${testGuest.side}, ${testGuest.last_updated})
    `

    // Test reading the guest
    const guests = await sql`SELECT * FROM guests WHERE id = ${testGuest.id}`

    if (guests.length > 0 && guests[0].guest_name === "Test Guest") {
      addResult("Guest Operations - Insert/Read", "PASS", "Successfully inserted and read guest data")
    } else {
      addResult("Guest Operations - Insert/Read", "FAIL", "Failed to insert or read guest data")
    }

    // Test updating the guest
    await sql`
      UPDATE guests 
      SET rsvp_status = 'attending' 
      WHERE id = ${testGuest.id}
    `

    const updatedGuests = await sql`SELECT * FROM guests WHERE id = ${testGuest.id}`

    if (updatedGuests.length > 0 && updatedGuests[0].rsvp_status === "attending") {
      addResult("Guest Operations - Update", "PASS", "Successfully updated guest data")
    } else {
      addResult("Guest Operations - Update", "FAIL", "Failed to update guest data")
    }

    // Test deleting the guest
    await sql`DELETE FROM guests WHERE id = ${testGuest.id}`

    const deletedGuests = await sql`SELECT * FROM guests WHERE id = ${testGuest.id}`

    if (deletedGuests.length === 0) {
      addResult("Guest Operations - Delete", "PASS", "Successfully deleted guest data")
    } else {
      addResult("Guest Operations - Delete", "FAIL", "Failed to delete guest data")
    }
  } catch (error) {
    addResult("Guest Operations", "FAIL", `Error in guest operations: ${error}`)
  }
}

async function testBudgetOperations() {
  try {
    // Test inserting a budget item
    const testBudget = {
      id: "test-budget-1",
      category1: "Venue",
      category2: "Reception",
      item_name: "Test Venue",
      vendor: "Test Vendor",
      cost: 1000,
      status: "planned",
      last_updated: new Date().toISOString(),
    }

    await sql`
      INSERT INTO budget_items (id, category1, category2, item_name, vendor, cost, status, last_updated)
      VALUES (${testBudget.id}, ${testBudget.category1}, ${testBudget.category2}, ${testBudget.item_name}, ${testBudget.vendor}, ${testBudget.cost}, ${testBudget.status}, ${testBudget.last_updated})
    `

    // Test reading the budget item
    const budgetItems = await sql`SELECT * FROM budget_items WHERE id = ${testBudget.id}`

    if (budgetItems.length > 0 && budgetItems[0].item_name === "Test Venue") {
      addResult("Budget Operations - Insert/Read", "PASS", "Successfully inserted and read budget data")
    } else {
      addResult("Budget Operations - Insert/Read", "FAIL", "Failed to insert or read budget data")
    }

    // Clean up
    await sql`DELETE FROM budget_items WHERE id = ${testBudget.id}`
    addResult("Budget Operations - Cleanup", "PASS", "Successfully cleaned up test budget data")
  } catch (error) {
    addResult("Budget Operations", "FAIL", `Error in budget operations: ${error}`)
  }
}

async function testSettingsOperations() {
  try {
    // Test inserting settings
    const testSettings = {
      bride_name: "Test Bride",
      groom_name: "Test Groom",
      wedding_date: "2026-03-27",
      ceremony_date: "2026-03-27",
      reception_date: "2026-03-28",
      venue: "Test Venue",
      location: "Test Location",
      allow_video_download: true,
      allow_video_fullscreen: true,
    }

    await sql`
      INSERT INTO wedding_settings (bride_name, groom_name, wedding_date, ceremony_date, reception_date, venue, location, allow_video_download, allow_video_fullscreen)
      VALUES (${testSettings.bride_name}, ${testSettings.groom_name}, ${testSettings.wedding_date}, ${testSettings.ceremony_date}, ${testSettings.reception_date}, ${testSettings.venue}, ${testSettings.location}, ${testSettings.allow_video_download}, ${testSettings.allow_video_fullscreen})
      ON CONFLICT (id) DO UPDATE SET
        bride_name = ${testSettings.bride_name},
        groom_name = ${testSettings.groom_name}
    `

    // Test reading settings
    const settings = await sql`SELECT * FROM wedding_settings LIMIT 1`

    if (settings.length > 0 && settings[0].bride_name === "Test Bride") {
      addResult("Settings Operations", "PASS", "Successfully inserted and read settings data")
    } else {
      addResult("Settings Operations", "FAIL", "Failed to insert or read settings data")
    }
  } catch (error) {
    addResult("Settings Operations", "FAIL", `Error in settings operations: ${error}`)
  }
}

async function testContentOperations() {
  try {
    // Test inserting content
    const testContent = {
      page_name: "test",
      content_data: JSON.stringify({
        title: "Test Page",
        description: "Test Description",
        content: "Test Content",
        enabled: true,
        order: 1,
      }),
    }

    await sql`
      INSERT INTO content_pages (page_name, content_data)
      VALUES (${testContent.page_name}, ${testContent.content_data})
      ON CONFLICT (page_name) DO UPDATE SET
        content_data = ${testContent.content_data}
    `

    // Test reading content
    const content = await sql`SELECT * FROM content_pages WHERE page_name = ${testContent.page_name}`

    if (content.length > 0) {
      const contentData = JSON.parse(content[0].content_data as string)
      if (contentData.title === "Test Page") {
        addResult("Content Operations", "PASS", "Successfully inserted and read content data")
      } else {
        addResult("Content Operations", "FAIL", "Content data structure incorrect")
      }
    } else {
      addResult("Content Operations", "FAIL", "Failed to insert or read content data")
    }

    // Clean up
    await sql`DELETE FROM content_pages WHERE page_name = ${testContent.page_name}`
  } catch (error) {
    addResult("Content Operations", "FAIL", `Error in content operations: ${error}`)
  }
}

async function testSpreadsheetOperations() {
  try {
    // Test inserting spreadsheet
    const testSpreadsheet = {
      id: "test-sheet-1",
      name: "Test Sheet",
      cells: JSON.stringify({ A1: { value: "Test", computed: "Test" } }),
      last_modified: new Date().toISOString(),
    }

    await sql`
      INSERT INTO spreadsheets (id, name, cells, last_modified)
      VALUES (${testSpreadsheet.id}, ${testSpreadsheet.name}, ${testSpreadsheet.cells}, ${testSpreadsheet.last_modified})
    `

    // Test reading spreadsheet
    const spreadsheets = await sql`SELECT * FROM spreadsheets WHERE id = ${testSpreadsheet.id}`

    if (spreadsheets.length > 0 && spreadsheets[0].name === "Test Sheet") {
      addResult("Spreadsheet Operations", "PASS", "Successfully inserted and read spreadsheet data")
    } else {
      addResult("Spreadsheet Operations", "FAIL", "Failed to insert or read spreadsheet data")
    }

    // Clean up
    await sql`DELETE FROM spreadsheets WHERE id = ${testSpreadsheet.id}`
  } catch (error) {
    addResult("Spreadsheet Operations", "FAIL", `Error in spreadsheet operations: ${error}`)
  }
}

async function testSessionOperations() {
  try {
    // Test admin session
    const testAdminSession = {
      session_id: "test-admin-session",
      username: "testuser",
      user_data: JSON.stringify({ username: "testuser", name: "Test User" }),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    await sql`
      INSERT INTO admin_sessions (session_id, username, user_data, expires_at, created_at)
      VALUES (${testAdminSession.session_id}, ${testAdminSession.username}, ${testAdminSession.user_data}, ${testAdminSession.expires_at}, ${testAdminSession.created_at})
    `

    const adminSessions = await sql`SELECT * FROM admin_sessions WHERE session_id = ${testAdminSession.session_id}`

    if (adminSessions.length > 0) {
      addResult("Admin Session Operations", "PASS", "Successfully inserted and read admin session data")
    } else {
      addResult("Admin Session Operations", "FAIL", "Failed to insert or read admin session data")
    }

    // Test site access session
    const testSiteSession = {
      session_id: "test-site-session",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    await sql`
      INSERT INTO site_access_sessions (session_id, expires_at, created_at)
      VALUES (${testSiteSession.session_id}, ${testSiteSession.expires_at}, ${testSiteSession.created_at})
    `

    const siteSessions = await sql`SELECT * FROM site_access_sessions WHERE session_id = ${testSiteSession.session_id}`

    if (siteSessions.length > 0) {
      addResult("Site Access Session Operations", "PASS", "Successfully inserted and read site access session data")
    } else {
      addResult("Site Access Session Operations", "FAIL", "Failed to insert or read site access session data")
    }

    // Clean up
    await sql`DELETE FROM admin_sessions WHERE session_id = ${testAdminSession.session_id}`
    await sql`DELETE FROM site_access_sessions WHERE session_id = ${testSiteSession.session_id}`
  } catch (error) {
    addResult("Session Operations", "FAIL", `Error in session operations: ${error}`)
  }
}

async function runAllTests() {
  console.log("🚀 Starting Migration Validation Tests...\n")

  await testDatabaseConnection()
  await testTableCreation()
  await testGuestOperations()
  await testBudgetOperations()
  await testSettingsOperations()
  await testContentOperations()
  await testSpreadsheetOperations()
  await testSessionOperations()

  console.log("\n📊 Test Results Summary:")
  console.log("========================")

  const passCount = results.filter((r) => r.status === "PASS").length
  const failCount = results.filter((r) => r.status === "FAIL").length

  console.log(`✅ Passed: ${passCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📈 Success Rate: ${((passCount / results.length) * 100).toFixed(1)}%`)

  if (failCount > 0) {
    console.log("\n❌ Failed Tests:")
    results
      .filter((r) => r.status === "FAIL")
      .forEach((result) => {
        console.log(`   • ${result.test}: ${result.message}`)
      })
  }

  console.log("\n🎉 Migration validation complete!")

  return failCount === 0
}

// Run the tests
runAllTests()
  .then((success) => {
    if (success) {
      console.log("\n✅ All tests passed! Migration is successful.")
      process.exit(0)
    } else {
      console.log("\n❌ Some tests failed. Please review the migration.")
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error("\n💥 Test execution failed:", error)
    process.exit(1)
  })
