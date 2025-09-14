export interface AdminUser {
  username: string
  password: string
  name: string
}

const ADMIN_USERS: AdminUser[] = [
  {
    username: "Biraveen",
    password: "Kalyanam2026",
    name: "Biraveen (Groom)",
  },
  {
    username: "Varnie",
    password: "Kalyanam 2026",
    name: "Varnie (Bride)",
  },
]

export function validateAdmin(username: string, password: string): AdminUser | null {
  const user = ADMIN_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)
  return user || null
}

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    })
    const result = await response.json()
    return result.authenticated === true
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error("Error during login:", error)
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
  } catch (error) {
    console.error("Error during logout:", error)
  }

  // Redirect to admin login page
  if (typeof window !== "undefined") {
    window.location.href = "/admin"
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  if (typeof window === "undefined") return null

  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    })
    const result = await response.json()
    return result.authenticated ? result.user : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function checkAuthentication(): Promise<boolean> {
  return await isAuthenticated()
}

export async function checkSiteAccess(): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const response = await fetch("/api/site-access", {
      credentials: "include",
    })
    const result = await response.json()
    return result.hasAccess === true
  } catch (error) {
    console.error("Error checking site access:", error)
    return false
  }
}

export async function grantSiteAccess(password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/site-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      credentials: "include",
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error("Error granting site access:", error)
    return false
  }
}
