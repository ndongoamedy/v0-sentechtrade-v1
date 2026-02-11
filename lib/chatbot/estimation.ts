import { mockListings } from "../data"
import type { iPhoneModel, Capacity } from "../types"
import { getVendorPrice } from "./vendor-prices"

export interface PhoneConditionDetails {
  screen: "ok" | "changed" | "cracked"
  back: "ok" | "cracked" | "hidden"
  faceId: "ok" | "broken"
  battery: number | "changed" // percentage or "changed"
}

export interface EstimationResult {
  currentPhoneValue: number
  desiredPhonePrice: number
  topUpAmount: number
  penalties: {
    screen: number
    back: number
    faceId: number
    battery: number
  }
  baseValue: number
}

const PENALTIES = {
  screen: 25000, // Screen changed or cracked
  back: 25000, // Back broken/hidden
  faceId: 20000, // Face ID not working
  battery: 30000, // Battery < 80% or changed
}

/**
 * Get the median seller price for a specific model and capacity
 */
function getMedianPrice(model: iPhoneModel, capacity: Capacity): number | null {
  const matchingListings = mockListings.filter(
    (listing) => listing.model === model && listing.capacity === capacity && listing.status === "PUBLISHED",
  )

  if (matchingListings.length === 0) {
    return null
  }

  const prices = matchingListings.map((l) => l.priceCFA).sort((a, b) => a - b)
  const mid = Math.floor(prices.length / 2)

  return prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid]
}

/**
 * Round to nearest 100
 */
function roundTo100(value: number): number {
  return Math.round(value / 100) * 100
}

/**
 * Calculate top-up amount for phone exchange
 *
 * Formula:
 * 1. Base value = roundTo100(vendorPrice * 0.70)
 * 2. Penalties (cumulative):
 *    - Screen changed/cracked: -25,000 CFA
 *    - Back broken/hidden: -25,000 CFA
 *    - Face ID broken: -20,000 CFA
 *    - Battery < 80% or changed: -30,000 CFA
 * 3. Adjusted value = max(0, base - penalties)
 * 4. Top-up = roundTo100(desiredPrice - adjusted)
 */
export function calculateTopUp(
  currentModel: iPhoneModel,
  currentCapacity: Capacity,
  currentCondition: PhoneConditionDetails,
  desiredModel: iPhoneModel,
  desiredCapacity: Capacity,
): EstimationResult | null {
  const currentPhonePrice = getVendorPrice(currentModel, currentCapacity)
  const desiredPhonePrice = getVendorPrice(desiredModel, desiredCapacity)

  // If prices are not available, return null
  if (!currentPhonePrice || !desiredPhonePrice) {
    return null
  }

  const baseValue = roundTo100(currentPhonePrice * 0.7)

  // Calculate penalties (only if defects are declared)
  const penalties = {
    screen: currentCondition.screen !== "ok" ? PENALTIES.screen : 0,
    back: currentCondition.back !== "ok" ? PENALTIES.back : 0,
    faceId: currentCondition.faceId !== "ok" ? PENALTIES.faceId : 0,
    battery:
      currentCondition.battery === "changed" ||
      (typeof currentCondition.battery === "number" && currentCondition.battery < 80)
        ? PENALTIES.battery
        : 0,
  }

  // Calculate total penalties
  const totalPenalties = Object.values(penalties).reduce((sum, penalty) => sum + penalty, 0)

  const currentPhoneValue = Math.max(0, baseValue - totalPenalties)

  const topUpAmount = roundTo100(desiredPhonePrice - currentPhoneValue)

  return {
    currentPhoneValue,
    desiredPhonePrice,
    topUpAmount,
    penalties,
    baseValue,
  }
}

/**
 * Format estimation result as a message
 */
export function formatEstimation(
  estimation: EstimationResult,
  currentModel: iPhoneModel,
  currentCapacity: Capacity,
  desiredModel: iPhoneModel,
  desiredCapacity: Capacity,
  language: "fr" | "en" = "fr",
): string {
  if (language === "fr") {
    return `Pour passer de ${currentModel} ${currentCapacity} à ${desiredModel} ${desiredCapacity}, tu auras besoin d'environ ${estimation.topUpAmount.toLocaleString()} CFA.\n\nℹ️ NB : Estimation basée sur les infos fournies ; elle sera vérifiée avant validation.`
  } else {
    return `To upgrade from ${currentModel} ${currentCapacity} to ${desiredModel} ${desiredCapacity}, you'll need approximately ${estimation.topUpAmount.toLocaleString()} CFA.\n\nℹ️ Note: Estimation based on provided info; will be verified before validation.`
  }
}
