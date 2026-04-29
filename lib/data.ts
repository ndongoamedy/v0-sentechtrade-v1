import type { iPhoneModel, Capacity, Condition, BoostPack } from "./types"

// Boost packs
export const boostPacks: BoostPack[] = [
  {
    id: "boost-3d",
    name: "Boost 3 jours",
    durationDays: 3,
    priceCFA: 2500,
    description: "Mettez en avant votre annonce pendant 3 jours",
  },
  {
    id: "boost-7d",
    name: "Boost 7 jours",
    durationDays: 7,
    priceCFA: 5000,
    description: "Mettez en avant votre annonce pendant 7 jours",
  },
  {
    id: "boost-30d",
    name: "Boost 30 jours",
    durationDays: 30,
    priceCFA: 18000,
    description: "Mettez en avant votre annonce pendant 30 jours",
  },
]

// iPhone models list
export const iPhoneModels: iPhoneModel[] = [
  "iPhone 17 Pro Max",
  "iPhone 17 Pro",
  "iPhone 17",
  "iPhone Air",
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13",
  "iPhone 13 mini",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
  "iPhone XS Max",
  "iPhone XS",
  "iPhone XR",
  "iPhone SE (2022)",
  "iPhone SE (2020)",
]

// Capacities
export const capacities: Capacity[] = ["64GB", "128GB", "256GB", "512GB", "1TB"]

// Conditions
export const conditions: Condition[] = ["Neuf", "Comme neuf", "Excellent", "Très bon", "Bon", "Correct"]

// Colors
export const colors = [
  "Noir",
  "Blanc",
  "Bleu",
  "Rouge",
  "Vert",
  "Violet",
  "Rose",
  "Or",
  "Argent",
  "Titane Naturel",
  "Titane Bleu",
  "Titane Blanc",
  "Titane Noir",
  "Autre",
]

// Cities in Senegal
export const cities = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Kaolack",
  "Ziguinchor",
  "Diourbel",
  "Louga",
  "Tambacounda",
  "Kolda",
  "Matam",
  "Kaffrine",
  "Kédougou",
  "Sédhiou",
  "Fatick",
]

// Model-to-storage mapping for dependent dropdowns
export const modelStorageMap: Record<iPhoneModel, Capacity[]> = {
  "iPhone XR": ["64GB", "128GB", "256GB"],
  "iPhone XS": ["64GB", "256GB", "512GB"],
  "iPhone XS Max": ["64GB", "256GB", "512GB"],
  "iPhone 11": ["64GB", "128GB", "256GB"],
  "iPhone 11 Pro": ["64GB", "256GB", "512GB"],
  "iPhone 11 Pro Max": ["64GB", "256GB", "512GB"],
  "iPhone 12 mini": ["64GB", "128GB", "256GB"],
  "iPhone 12": ["64GB", "128GB", "256GB"],
  "iPhone 12 Pro": ["128GB", "256GB", "512GB"],
  "iPhone 12 Pro Max": ["128GB", "256GB", "512GB"],
  "iPhone 13 mini": ["128GB", "256GB", "512GB"],
  "iPhone 13": ["128GB", "256GB", "512GB"],
  "iPhone 13 Pro": ["128GB", "256GB", "512GB", "1TB"],
  "iPhone 13 Pro Max": ["128GB", "256GB", "512GB", "1TB"],
  "iPhone 14": ["128GB", "256GB", "512GB"],
  "iPhone 14 Plus": ["128GB", "256GB", "512GB"],
  "iPhone 14 Pro": ["128GB", "256GB", "512GB", "1TB"],
  "iPhone 14 Pro Max": ["128GB", "256GB", "512GB", "1TB"],
  "iPhone 15": ["128GB", "256GB", "512GB"],
  "iPhone 15 Plus": ["128GB", "256GB", "512GB"],
  "iPhone 15 Pro": ["128GB", "256GB", "512GB", "1TB"],
  "iPhone 15 Pro Max": ["256GB", "512GB", "1TB"],
  "iPhone 16": ["128GB", "256GB", "512GB"],
  "iPhone 16 Plus": ["128GB", "256GB", "512GB"],
  "iPhone 16 Pro": ["256GB", "512GB", "1TB"],
  "iPhone 16 Pro Max": ["256GB", "512GB", "1TB"],
  "iPhone 17": ["128GB", "256GB", "512GB"],
  "iPhone 17 Pro": ["256GB", "512GB", "1TB"],
  "iPhone 17 Pro Max": ["256GB", "512GB", "1TB"],
  "iPhone Air": ["128GB", "256GB", "512GB"],
  "iPhone SE (2020)": ["64GB", "128GB", "256GB"],
  "iPhone SE (2022)": ["64GB", "128GB", "256GB"],
}

export function getValidCapacities(model: iPhoneModel): Capacity[] {
  return modelStorageMap[model] || capacities
}
