import type { iPhoneModel, Capacity } from "../types"

/**
 * Official vendor prices (prix vendeurs officiels)
 * These are the reference prices used for exchange calculations
 */
export const VENDOR_PRICES: Record<string, number> = {
  // iPhone 17
  "iPhone 17-512GB": 825000,
  "iPhone 17-256GB": 750000,
  "iPhone 17-128GB": 720000,

  // iPhone 17 Pro
  "iPhone 17 Pro-1TB": 1110000,
  "iPhone 17 Pro-512GB": 1085000,
  "iPhone 17 Pro-256GB": 1050000,

  // iPhone 17 Pro Max
  "iPhone 17 Pro Max-1TB": 1200000,
  "iPhone 17 Pro Max-512GB": 1125000,
  "iPhone 17 Pro Max-256GB": 1090000,

  // iPhone Air
  "iPhone Air-128GB": 850000,
  "iPhone Air-256GB": 900000,
  "iPhone Air-512GB": 950000,

  // iPhone 16 Pro Max
  "iPhone 16 Pro Max-512GB": 770000,
  "iPhone 16 Pro Max-256GB": 720000,

  // iPhone 16 Pro
  "iPhone 16 Pro-256GB": 620000,
  "iPhone 16 Pro-128GB": 590000,

  // iPhone 16
  "iPhone 16-128GB": 440000,

  // iPhone 15 Pro Max
  "iPhone 15 Pro Max-512GB": 560000,
  "iPhone 15 Pro Max-256GB": 550000,

  // iPhone 15 Pro
  "iPhone 15 Pro-128GB": 450000,
  "iPhone 15 Pro-256GB": 480000,

  // iPhone 14 Pro Max
  "iPhone 14 Pro Max-256GB": 450000,
  "iPhone 14 Pro Max-128GB": 400000,

  // iPhone 14 Pro
  "iPhone 14 Pro-128GB": 345000,
  "iPhone 14 Pro-256GB": 365000,

  // iPhone 13 Pro Max
  "iPhone 13 Pro Max-128GB": 290000,
  "iPhone 13 Pro Max-256GB": 315000,

  // iPhone 13 Pro
  "iPhone 13 Pro-256GB": 260000,
  "iPhone 13 Pro-128GB": 240000,

  // iPhone 13
  "iPhone 13-256GB": 205000,
  "iPhone 13-128GB": 185000,

  // iPhone 12 Pro Max
  "iPhone 12 Pro Max-256GB": 260000,
  "iPhone 12 Pro Max-128GB": 245000,

  // iPhone 12 Pro
  "iPhone 12 Pro-256GB": 200000,
  "iPhone 12 Pro-128GB": 180000,

  // iPhone 12
  "iPhone 12-128GB": 145000,
  "iPhone 12-64GB": 135000,

  // iPhone 11 Pro Max
  "iPhone 11 Pro Max-256GB": 185000,
  "iPhone 11 Pro Max-64GB": 165000,

  // iPhone 11 Pro
  "iPhone 11 Pro-256GB": 150000,
  "iPhone 11 Pro-64GB": 137000,

  // iPhone 11
  "iPhone 11-128GB": 125000,
  "iPhone 11-64GB": 115000,

  // iPhone XR
  "iPhone XR-64GB": 93000,
  "iPhone XR-128GB": 105000,

  // iPhone 7 Plus
  "iPhone 7 Plus-128GB": 55000,
}

/**
 * Get vendor price for a specific model and capacity
 */
export function getVendorPrice(model: iPhoneModel, capacity: Capacity): number | null {
  const key = `${model}-${capacity}`
  return VENDOR_PRICES[key] || null
}
