"use client"

import { createClient } from "@/lib/supabase/client"
import type { User, UserRole } from "./types"

const AUTH_STORAGE_KEY = "sentech_auth"

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

// Get current session from Supabase
export async function getSessionAsync(): Promise<AuthSession | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null
  
  // Get user profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (!profile) return null
  
  const user: User = {
    id: session.user.id,
    email: session.user.email || '',
    name: profile.name || session.user.user_metadata?.name || '',
    phone: profile.phone || '',
    city: profile.city || 'Dakar',
    role: (profile.role as UserRole) || 'CLIENT',
    createdAt: new Date(profile.created_at),
  }
  
  return {
    user,
    token: session.access_token,
    expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
}

// Sync version for backward compatibility (reads from localStorage cache)
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    const session: AuthSession = JSON.parse(stored)

    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

// Save session to localStorage (for sync access)
export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

// Clear session
export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

// Login with email and password using Supabase Auth
export async function loginAsync(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { success: false, error: error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message }
  }
  
  if (!data.session) {
    return { success: false, error: 'Erreur de connexion' }
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()
  
  const user: User = {
    id: data.user.id,
    email: data.user.email || '',
    name: profile?.name || data.user.user_metadata?.name || '',
    phone: profile?.phone || '',
    city: profile?.city || 'Dakar',
    role: (profile?.role as UserRole) || 'CLIENT',
    createdAt: new Date(profile?.created_at || data.user.created_at),
  }
  
  const session: AuthSession = {
    user,
    token: data.session.access_token,
    expiresAt: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
  
  saveSession(session)
  
  return { success: true, session }
}

// Sync login wrapper
export function login(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  // This will be called but we need to handle async
  // For now, return a pending state - the actual login should use loginAsync
  console.warn('[v0] Use loginAsync instead of login for Supabase auth')
  return { success: false, error: 'Utilisez loginAsync' }
}

// Register new user with Supabase Auth
export async function registerAsync(data: {
  email: string
  password: string
  name: string
  phone: string
  city?: string
  isSeller?: boolean
}): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  const supabase = createClient()
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city || 'Dakar',
        role: data.isSeller ? 'SELLER' : 'CLIENT',
      },
    },
  })
  
  if (authError) {
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    return { success: false, error: authError.message }
  }
  
  if (!authData.user) {
    return { success: false, error: 'Erreur lors de la création du compte' }
  }
  
  // The profile will be created by a database trigger
  // But we can also try to create it manually if needed
  const role: UserRole = data.isSeller ? 'SELLER' : 'CLIENT'
  
  // Try to insert profile (trigger might have done it already)
  await supabase.from('profiles').upsert({
    id: authData.user.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    city: data.city || 'Dakar',
    role: role,
  }, { onConflict: 'id' })
  
  // If email confirmation is required, we won't have a session yet
  if (!authData.session) {
    return { 
      success: true, 
      error: 'Veuillez vérifier votre email pour confirmer votre compte'
    }
  }
  
  const user: User = {
    id: authData.user.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    city: data.city || 'Dakar',
    role: role,
    createdAt: new Date(),
  }
  
  const session: AuthSession = {
    user,
    token: authData.session.access_token,
    expiresAt: authData.session.expires_at ? authData.session.expires_at * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
  
  saveSession(session)
  
  return { success: true, session }
}

// Sync register wrapper
export function register(data: {
  email: string
  password: string
  name: string
  phone: string
  city?: string
  isSeller?: boolean
}): { success: boolean; session?: AuthSession; error?: string } {
  console.warn('[v0] Use registerAsync instead of register for Supabase auth')
  return { success: false, error: 'Utilisez registerAsync' }
}

// Logout using Supabase Auth
export async function logoutAsync(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  clearSession()
}

// Sync logout wrapper
export function logout(): void {
  clearSession()
  // Also sign out from Supabase asynchronously
  const supabase = createClient()
  supabase.auth.signOut()
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null
}

// Get current user (sync from cache)
export function getCurrentUser(): User | null {
  const session = getSession()
  return session?.user || null
}

// Check if user has specific role
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser()
  return user?.role === role
}

// Update user profile
export async function updateUserAsync(updatedUser: User, newPassword?: string): Promise<void> {
  const supabase = createClient()
  
  // Update profile in database
  await supabase
    .from('profiles')
    .update({
      name: updatedUser.name,
      phone: updatedUser.phone,
      city: updatedUser.city,
    })
    .eq('id', updatedUser.id)
  
  // Update password if provided
  if (newPassword) {
    await supabase.auth.updateUser({ password: newPassword })
  }
  
  // Update local cache
  const session = getSession()
  if (session) {
    const newSession: AuthSession = {
      ...session,
      user: updatedUser,
    }
    saveSession(newSession)
  }
  
  // Trigger auth change event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"))
  }
}

// Sync update wrapper
export function updateUser(updatedUser: User, newPassword?: string): void {
  updateUserAsync(updatedUser, newPassword)
}

// Initialize auth state from Supabase on app load
export async function initializeAuth(): Promise<AuthSession | null> {
  const session = await getSessionAsync()
  if (session) {
    saveSession(session)
  }
  return session
}
