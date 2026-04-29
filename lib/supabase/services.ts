import { createClient } from './client'
import type { SupabaseClient } from '@supabase/supabase-js'

// Types for database responses
export interface DBSeller {
  id: string
  user_id: string
  shop_name: string
  whatsapp: string
  city: string
  logo: string | null
  description: string | null
  verified: boolean
  rating: number | null
  created_at: string
}

export interface DBListing {
  id: string
  seller_id: string
  title: string
  model: string
  capacity: string
  color: string
  condition: string
  price_cfa: number
  city: string
  photos: string[]
  description: string | null
  allow_exchange: boolean
  status: string
  featured_until: string | null
  created_at: string
  updated_at: string
  seller?: DBSeller
}

export interface DBLead {
  id: string
  listing_id: string | null
  seller_id: string | null
  type: 'BUY' | 'EXCHANGE'
  client_name: string
  client_email: string | null
  client_phone: string
  client_city: string | null
  message: string | null
  exchange_details: any | null
  status: string
  created_at: string
}

export interface DBSellerApplication {
  id: string
  user_id: string | null
  shop_name: string
  whatsapp: string
  city: string
  address: string | null
  description: string | null
  proof_photos: string[] | null
  status: string
  rejection_reason: string | null
  created_at: string
  reviewed_at: string | null
}

export interface DBProfile {
  id: string
  user_id: string
  name: string | null
  phone: string | null
  city: string | null
  role: 'CLIENT' | 'SELLER' | 'ADMIN'
  created_at: string
}

// Transform DB listing to app format
export function transformListing(listing: DBListing) {
  return {
    id: listing.id,
    sellerId: listing.seller_id,
    title: listing.title,
    model: listing.model,
    capacity: listing.capacity,
    color: listing.color,
    condition: listing.condition,
    priceCFA: listing.price_cfa,
    city: listing.city,
    photos: listing.photos || [],
    description: listing.description,
    allowExchange: listing.allow_exchange,
    status: listing.status,
    featuredUntil: listing.featured_until ? new Date(listing.featured_until) : undefined,
    createdAt: new Date(listing.created_at),
    updatedAt: new Date(listing.updated_at),
    seller: listing.seller ? transformSeller(listing.seller) : undefined,
  }
}

// Transform DB seller to app format
export function transformSeller(seller: DBSeller) {
  return {
    id: seller.id,
    userId: seller.user_id,
    shopName: seller.shop_name,
    whatsapp: seller.whatsapp,
    city: seller.city,
    logo: seller.logo,
    description: seller.description,
    verified: seller.verified,
    rating: seller.rating,
    createdAt: new Date(seller.created_at),
  }
}

// Transform DB lead to app format
export function transformLead(lead: DBLead) {
  return {
    id: lead.id,
    listingId: lead.listing_id,
    sellerId: lead.seller_id,
    type: lead.type,
    clientName: lead.client_name,
    clientEmail: lead.client_email,
    clientPhone: lead.client_phone,
    clientCity: lead.client_city,
    message: lead.message,
    exchangeDetails: lead.exchange_details,
    status: lead.status,
    createdAt: new Date(lead.created_at),
  }
}

// Transform DB profile to app format
export function transformProfile(profile: DBProfile) {
  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    phone: profile.phone,
    city: profile.city,
    role: profile.role,
    createdAt: new Date(profile.created_at),
  }
}

// ==================== LISTINGS ====================

export async function getPublishedListings(filters?: {
  model?: string
  capacity?: string
  condition?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('listings')
    .select(`
      *,
      seller:sellers(*)
    `)
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })

  if (filters?.model) {
    query = query.eq('model', filters.model)
  }
  if (filters?.capacity) {
    query = query.eq('capacity', filters.capacity)
  }
  if (filters?.condition) {
    query = query.eq('condition', filters.condition)
  }
  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.minPrice) {
    query = query.gte('price_cfa', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price_cfa', filters.maxPrice)
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Supabase] Error fetching listings:', error)
    throw error
  }

  return (data || []).map(transformListing)
}

export async function getFeaturedListings() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      seller:sellers(*)
    `)
    .eq('status', 'PUBLISHED')
    .gt('featured_until', new Date().toISOString())
    .order('featured_until', { ascending: false })
    .limit(10)

  if (error) {
    console.error('[Supabase] Error fetching featured listings:', error)
    throw error
  }

  return (data || []).map(transformListing)
}

export async function getListingById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      seller:sellers(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('[Supabase] Error fetching listing:', error)
    return null
  }

  return data ? transformListing(data) : null
}

export async function getSellerListings(sellerId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      seller:sellers(*)
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Error fetching seller listings:', error)
    throw error
  }

  return (data || []).map(transformListing)
}

export async function createListing(listing: {
  seller_id: string
  title: string
  model: string
  capacity: string
  color: string
  condition: string
  price_cfa: number
  city: string
  photos: string[]
  description?: string
  allow_exchange: boolean
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listing,
      status: 'PUBLISHED',
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error creating listing:', error)
    throw error
  }

  return transformListing(data)
}

export async function updateListing(id: string, updates: Partial<{
  title: string
  model: string
  capacity: string
  color: string
  condition: string
  price_cfa: number
  city: string
  photos: string[]
  description: string
  allow_exchange: boolean
  status: string
  featured_until: string
}>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error updating listing:', error)
    throw error
  }

  return transformListing(data)
}

export async function deleteListing(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[Supabase] Error deleting listing:', error)
    throw error
  }

  return true
}

// ==================== LEADS ====================

export async function createLead(lead: {
  listing_id?: string
  seller_id?: string
  type: 'BUY' | 'EXCHANGE'
  client_name: string
  client_email?: string
  client_phone: string
  client_city?: string
  message?: string
  exchange_details?: any
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...lead,
      status: 'NEW',
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error creating lead:', error)
    throw error
  }

  return transformLead(data)
}

export async function getSellerLeads(sellerId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Error fetching leads:', error)
    throw error
  }

  return (data || []).map(transformLead)
}

export async function getAllLeads() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Error fetching all leads:', error)
    throw error
  }

  return (data || []).map(transformLead)
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error updating lead:', error)
    throw error
  }

  return transformLead(data)
}

// ==================== SELLERS ====================

export async function getSellerByUserId(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Error fetching seller:', error)
    throw error
  }

  return data ? transformSeller(data) : null
}

export async function getSellerById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[Supabase] Error fetching seller:', error)
    return null
  }

  return data ? transformSeller(data) : null
}

export async function getAllSellers() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Error fetching sellers:', error)
    throw error
  }

  return (data || []).map(transformSeller)
}

export async function createSeller(seller: {
  user_id: string
  shop_name: string
  whatsapp: string
  city: string
  description?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sellers')
    .insert({
      ...seller,
      verified: false,
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error creating seller:', error)
    throw error
  }

  return transformSeller(data)
}

// ==================== SELLER APPLICATIONS ====================

export async function createSellerApplication(application: {
  user_id?: string
  shop_name: string
  whatsapp: string
  city: string
  address?: string
  description?: string
  proof_photos?: string[]
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('seller_applications')
    .insert({
      ...application,
      status: 'PENDING_REVIEW',
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error creating seller application:', error)
    throw error
  }

  return data
}

export async function getPendingApplications() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('status', 'PENDING_REVIEW')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] Error fetching applications:', error)
    throw error
  }

  return data || []
}

export async function approveSellerApplication(applicationId: string) {
  const supabase = createClient()
  
  // Get the application
  const { data: application, error: fetchError } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (fetchError || !application) {
    throw new Error('Application not found')
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('seller_applications')
    .update({
      status: 'APPROVED',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (updateError) {
    throw updateError
  }

  // Create seller record
  if (application.user_id) {
    const { error: sellerError } = await supabase
      .from('sellers')
      .insert({
        user_id: application.user_id,
        shop_name: application.shop_name,
        whatsapp: application.whatsapp,
        city: application.city,
        description: application.description,
        verified: true,
      })

    if (sellerError) {
      console.error('[Supabase] Error creating seller:', sellerError)
    }

    // Update profile role to SELLER
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'SELLER' })
      .eq('user_id', application.user_id)

    if (profileError) {
      console.error('[Supabase] Error updating profile:', profileError)
    }
  }

  return true
}

export async function rejectSellerApplication(applicationId: string, reason: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('seller_applications')
    .update({
      status: 'REJECTED',
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  if (error) {
    console.error('[Supabase] Error rejecting application:', error)
    throw error
  }

  return true
}

// ==================== PROFILES ====================

export async function getProfileByUserId(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase] Error fetching profile:', error)
    throw error
  }

  return data ? transformProfile(data) : null
}

export async function createProfile(profile: {
  user_id: string
  name?: string
  phone?: string
  city?: string
  role?: 'CLIENT' | 'SELLER' | 'ADMIN'
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      ...profile,
      role: profile.role || 'CLIENT',
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error creating profile:', error)
    throw error
  }

  return transformProfile(data)
}

export async function updateProfile(userId: string, updates: Partial<{
  name: string
  phone: string
  city: string
  role: 'CLIENT' | 'SELLER' | 'ADMIN'
}>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('[Supabase] Error updating profile:', error)
    throw error
  }

  return transformProfile(data)
}

// ==================== STATS ====================

export async function getAdminStats() {
  const supabase = createClient()
  
  const [sellersResult, listingsResult, leadsResult, applicationsResult] = await Promise.all([
    supabase.from('sellers').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('seller_applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_REVIEW'),
  ])

  return {
    sellers: sellersResult.count || 0,
    listings: listingsResult.count || 0,
    leads: leadsResult.count || 0,
    pendingApplications: applicationsResult.count || 0,
  }
}

export async function getSellerStats(sellerId: string) {
  const supabase = createClient()
  
  const [listingsResult, leadsResult] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('seller_id', sellerId),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('seller_id', sellerId),
  ])

  return {
    listings: listingsResult.count || 0,
    leads: leadsResult.count || 0,
  }
}

// ==================== FILE UPLOAD ====================

export async function uploadListingPhoto(file: File, listingId: string): Promise<string> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${listingId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('listings-photos')
    .upload(fileName, file)

  if (error) {
    console.error('[Supabase] Error uploading photo:', error)
    throw error
  }

  const { data: urlData } = supabase.storage
    .from('listings-photos')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteListingPhoto(photoUrl: string): Promise<void> {
  const supabase = createClient()
  
  // Extract path from URL
  const path = photoUrl.split('/listings-photos/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('listings-photos')
    .remove([path])

  if (error) {
    console.error('[Supabase] Error deleting photo:', error)
    throw error
  }
}
