import type { iPhoneModel, Capacity, Condition } from "../types"

export type Intent = "exchange" | "buy" | "seller" | "faq" | "greeting" | "unknown"

export type Language = "fr" | "en"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  quickReplies?: QuickReply[]
}

export interface QuickReply {
  id: string
  label: string
  value: string
  icon?: string
}

export interface ExchangeSlots {
  currentModel?: iPhoneModel
  currentCapacity?: Capacity
  currentColor?: string
  currentCondition?: Condition
  currentScreenCondition?: "ok" | "changed" | "cracked"
  currentBackCondition?: "ok" | "cracked" | "hidden"
  currentFaceId?: "ok" | "broken"
  currentBattery?: number | "changed" // percentage or "changed"
  desiredModel?: iPhoneModel
  desiredCapacity?: Capacity
  desiredColor?: string
  minCondition?: Condition
  maxBudget?: number
  name?: string
  phone?: string
  city?: string
  email?: string
}

export interface BuySlots {
  listingId?: string
  model?: iPhoneModel
  name?: string
  phone?: string
  city?: string
}

export interface SellerSlots {
  shopName?: string
  phone?: string
  city?: string
  proofs?: string
}

export interface ChatSession {
  id: string
  intent?: Intent
  language: Language
  exchangeSlots?: ExchangeSlots
  buySlots?: BuySlots
  sellerSlots?: SellerSlots
  messages: ChatMessage[]
  contextListingId?: string
  contextModel?: string
  contextCapacity?: string
  contextPrice?: number
  contextSellerId?: string
  createdAt: Date
}

// Intent detection patterns
export const intentPatterns: Record<Intent, RegExp[]> = {
  exchange: [/échang/i, /trade/i, /reprise/i, /reprendre/i, /troquer/i],
  buy: [/achet/i, /achèt/i, /buy/i, /prendre/i, /intéress/i, /veux.*ce/i, /veux.*cet/i],
  seller: [/vendeur/i, /vendre/i, /sell/i, /boutique/i, /partenaire/i, /devenir/i],
  faq: [/comment/i, /pourquoi/i, /qu'est-ce/i, /c'est quoi/i, /aide/i, /help/i, /info/i, /question/i],
  greeting: [/bonjour/i, /salut/i, /hello/i, /hi/i, /hey/i, /bonsoir/i],
  unknown: [],
}

export function detectIntent(message: string): Intent {
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (intent === "unknown") continue
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        return intent as Intent
      }
    }
  }
  return "unknown"
}

export function detectLanguage(message: string): Language {
  // Simple detection: if contains common English words and no French accents
  const englishWords = /\b(hello|hi|buy|sell|exchange|help|want|need|how|what)\b/i
  const frenchAccents = /[àâäéèêëïîôùûüÿæœç]/i

  if (englishWords.test(message) && !frenchAccents.test(message)) {
    return "en"
  }
  return "fr"
}
