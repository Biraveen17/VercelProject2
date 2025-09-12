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

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("wedding_admin_auth") === "true"
}

export function login(username: string, password: string): boolean {
  const user = validateAdmin(username, password)
  if (user) {
    localStorage.setItem("wedding_admin_auth", "true")
    localStorage.setItem("wedding_admin_user", JSON.stringify(user))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("wedding_admin_auth")
  localStorage.removeItem("wedding_admin_user")
}

export function getCurrentUser(): AdminUser | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("wedding_admin_user")
  return userStr ? JSON.parse(userStr) : null
}
