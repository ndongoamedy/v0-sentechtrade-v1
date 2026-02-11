"use client"

import type { User, UserRole } from "./types"

// Mock users database (in production, this would be in a real database)
const mockUsers: User[] = [
  {
    id: "u1",
    email: "afcoms@sentech.sn",
    password: "afcoms2025",
    name: "AfComs",
    role: "SELLER",
    phone: "+221 77 876 01 23",
    city: "Dakar",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "u2",
    email: "malick@sentech.sn",
    password: "malick2025",
    name: "Malick Commerce & services",
    role: "SELLER",
    phone: "+221 78 361 48 59",
    city: "Dakar",
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "u3",
    email: "diwane@sentech.sn",
    password: "diwane2025",
    name: "Diwane Apple",
    role: "SELLER",
    phone: "+221775723147",
    city: "Dakar",
    createdAt: new Date("2023-05-10"),
  },
  {
    id: "u4",
    email: "senstore@sentech.sn",
    password: "senstore2025",
    name: "Sen Store Phone",
    role: "SELLER",
    phone: "+221778464833",
    city: "Dakar",
    createdAt: new Date("2023-07-01"),
  },
  {
    id: "u5",
    email: "admin@sentech.sn",
    password: "admin2025",
    name: "Admin SenTech",
    role: "ADMIN",
    phone: "+221773456789",
    city: "Dakar",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "u6",
    email: "client@test.com",
    password: "client2025",
    name: "Client Test",
    role: "CLIENT",
    phone: "+221771234567",
    city: "Dakar",
    createdAt: new Date("2024-01-01"),
  },
]

const AUTH_STORAGE_KEY = "sentech_auth"

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

// Get current session from localStorage
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    const session: AuthSession = JSON.parse(stored)

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

// Save session to localStorage
export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

// Clear session
export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

// Login with email and password
export function login(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  console.log("[v0] Login attempt:", { email })

  // Find user by email
  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Email ou mot de passe incorrect" }
  }

  // Verify password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return { success: false, error: "Email ou mot de passe incorrect" }
  }

  // Create session (expires in 7 days)
  const session: AuthSession = {
    user: {
      ...user,
      password: undefined as any, // Don't include password in session
    },
    token: `mock_token_${user.id}_${Date.now()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }

  saveSession(session)
  console.log("[v0] Login successful:", { userId: user.id, role: user.role })

  return { success: true, session }
}

// Register new user
export function register(data: {
  email: string
  password: string
  name: string
  phone: string
  city?: string
  isSeller?: boolean
}): { success: boolean; session?: AuthSession; error?: string } {
  console.log("[v0] Register attempt:", { email: data.email, isSeller: data.isSeller })

  // Check if email already exists
  if (mockUsers.find((u) => u.email === data.email)) {
    return { success: false, error: "Cet email est déjà utilisé" }
  }

  // Create new user
  const newUser: User = {
    id: `u${mockUsers.length + 1}`,
    email: data.email,
    password: data.password, // In production, hash with bcrypt
    name: data.name,
    role: data.isSeller ? "SELLER" : "CLIENT",
    phone: data.phone,
    city: data.city || "Dakar",
    createdAt: new Date(),
  }

  mockUsers.push(newUser)

  // Create session
  const session: AuthSession = {
    user: {
      ...newUser,
      password: undefined as any,
    },
    token: `mock_token_${newUser.id}_${Date.now()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }

  saveSession(session)
  console.log("[v0] Registration successful:", { userId: newUser.id, role: newUser.role })

  return { success: true, session }
}

// Logout
export function logout(): void {
  console.log("[v0] Logout")
  clearSession()
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null
}

// Get current user
export function getCurrentUser(): User | null {
  const session = getSession()
  return session?.user || null
}

// Check if user has specific role
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser()
  return user?.role === role
}

export function updateUser(updatedUser: User, newPassword?: string): void {
  const session = getSession()
  if (!session) return

  // Find and update user in mock database
  const userIndex = mockUsers.findIndex((u) => u.id === updatedUser.id)
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updatedUser,
      password: newPassword || mockUsers[userIndex].password,
    }

    // Update session
    const newSession: AuthSession = {
      ...session,
      user: {
        ...updatedUser,
        password: undefined as any,
      },
    }
    saveSession(newSession)

    // Trigger auth change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"))
    }
  }
}
