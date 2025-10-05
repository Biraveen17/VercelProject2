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
    console.log("[v0] Checking authentication...")
    const token = localStorage.getItem("wedding_admin_token")
    if (!token) {
      console.log("[v0] No token found in localStorage")
      return false
    }

    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const result = await response.json()
    console.log("[v0] Authentication result:", result.authenticated)
    return result.authenticated === true
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    console.log("[v0] Starting login process...")
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const result = await response.json()
    console.log("[v0] Login API response:", result)

    if (result.success && result.token) {
      localStorage.setItem("wedding_admin_token", result.token)
      localStorage.setItem("wedding_admin_user", JSON.stringify(result.user))

      // Verify token was stored immediately
      const storedToken = localStorage.getItem("wedding_admin_token")
      console.log("[v0] Token stored successfully:", storedToken ? "yes" : "no")

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Double-check the token is still there
      const finalCheck = localStorage.getItem("wedding_admin_token")
      console.log("[v0] Final token check:", finalCheck ? "found" : "not found")

      return true
    }
    return false
  } catch (error) {
    console.error("Error during login:", error)
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem("wedding_admin_token")
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    }
  } catch (error) {
    console.error("Error during logout:", error)
  }

  localStorage.removeItem("wedding_admin_token")
  localStorage.removeItem("wedding_admin_user")

  // Redirect to admin login page
  if (typeof window !== "undefined") {
    window.location.href = "/admin"
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("wedding_admin_user")
    const token = localStorage.getItem("wedding_admin_token")

    if (userStr && token) {
      const user = JSON.parse(userStr)
      return user
    }

    if (!token) {
      return null
    }

    const response = await fetch("/api/auth/session", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const result = await response.json()

    if (result.authenticated && result.user) {
      localStorage.setItem("wedding_admin_user", JSON.stringify(result.user))
      return result.user
    }

    return null
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

export async function verifyToken(token: string): Promise<boolean> {
  try {
    if (!token || token.length < 10) {
      return false
    }

    // Check if token matches the format generated by login API
    return token.startsWith("token_") && token.length > 20
  } catch (error) {
    console.error("Error verifying token:", error)
    return false
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  return localStorage.getItem("wedding_admin_token")
}
