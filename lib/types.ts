// User roles
export type UserRole = "CLIENT" | "SELLER" | "ADMIN"

// User type
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  city?: string
  role: UserRole
  createdAt: Date
}

// Seller/Shop
export interface Seller {
  id: string
  userId: string
  shopName: string
  city: string
  whatsapp: string
  logo?: string
  description?: string
  verified: boolean
  rating: number
  createdAt: Date
}

// iPhone models and specs
export type iPhoneModel =
  | "iPhone 16 Pro Max"
  | "iPhone 16 Pro"
  | "iPhone 16 Plus"
  | "iPhone 16"
  | "iPhone 15 Pro Max"
  | "iPhone 15 Pro"
  | "iPhone 15 Plus"
  | "iPhone 15"
  | "iPhone 14 Pro Max"
  | "iPhone 14 Pro"
  | "iPhone 14 Plus"
  | "iPhone 14"
  | "iPhone 13 Pro Max"
  | "iPhone 13 Pro"
  | "iPhone 13"
  | "iPhone 13 mini"
  | "iPhone 12 Pro Max"
  | "iPhone 12 Pro"
  | "iPhone 12"
  | "iPhone 12 mini"
  | "iPhone 11 Pro Max"
  | "iPhone 11 Pro"
  | "iPhone 11"
  | "iPhone SE (2022)"
  | "iPhone SE (2020)"

export type Capacity = "64GB" | "128GB" | "256GB" | "512GB" | "1TB"

export type Condition = "Neuf" | "Comme neuf" | "Excellent" | "Très bon" | "Bon" | "Correct"

export type Color =
  | "Noir"
  | "Blanc"
  | "Bleu"
  | "Rouge"
  | "Vert"
  | "Violet"
  | "Rose"
  | "Or"
  | "Argent"
  | "Titane Naturel"
  | "Titane Bleu"
  | "Titane Blanc"
  | "Titane Noir"
  | "Autre"

// Listing
export interface Listing {
  id: string
  sellerId: string
  seller?: Seller
  title: string
  model: iPhoneModel
  capacity: Capacity
  color: Color
  condition: Condition
  priceCFA: number
  city: string
  photos: string[]
  description?: string
  allowExchange: boolean
  featuredUntil?: Date
  status: "DRAFT" | "PUBLISHED" | "SOLD" | "SUSPENDED"
  createdAt: Date
  updatedAt: Date
}

// Lead types
export type LeadType = "BUY" | "EXCHANGE"
export type LeadStatus = "NEW" | "REPLIED" | "CLOSED"

// Lead (contact request)
export interface Lead {
  id: string
  type: LeadType
  listingId: string
  listing?: Listing
  sellerId: string
  seller?: Seller
  clientName: string
  clientEmail?: string
  clientPhone: string
  clientCity: string
  message: string
  status: LeadStatus
  exchangeDetails?: ExchangeDetails
  createdAt: Date
}

// Exchange details
export interface PhoneConditionDetails {
  // Screen condition
  screenStatus: "never_changed" | "changed" | "cracked"

  // Battery
  batteryHealth: number // percentage 0-100
  batteryReplaced: boolean

  // Face ID
  faceIdWorking: boolean
}

export interface ExchangeDetails {
  currentModel: iPhoneModel
  currentCapacity: Capacity
  currentCondition: Condition
  currentPhotos?: string[]
  conditionDetails: PhoneConditionDetails
  desiredModel: iPhoneModel
  desiredCapacity: Capacity
  minCondition: Condition
  maxBudgetCFA?: number
}

// Seller application
export interface SellerApplication {
  id: string
  userId: string
  shopName: string
  whatsapp: string
  city: string
  address?: string
  proofPhotos: string[]
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED"
  rejectionReason?: string
  createdAt: Date
  reviewedAt?: Date
}

// Boost packs
export interface BoostPack {
  id: string
  name: string
  durationDays: number
  priceCFA: number
  description: string
}

// Boost order
export interface BoostOrder {
  id: string
  sellerId: string
  listingId: string
  packId: string
  pack?: BoostPack
  priceCFA: number
  createdAt: Date
  expiresAt: Date
}
