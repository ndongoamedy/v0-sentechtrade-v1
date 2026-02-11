import { buildWhatsAppBuyLink, buildWhatsAppExchangeLink, buildWhatsAppSellerLink } from "../whatsapp"
import type { ExchangeSlots, BuySlots, SellerSlots } from "./intents"

export interface LeadResponse {
  success: boolean
  leadId?: string
  whatsappUrl?: string
  error?: string
}

export interface SellerApplicationResponse {
  success: boolean
  applicationId?: string
  whatsappUrl?: string
  error?: string
}

export async function createExchangeLead(
  slots: ExchangeSlots,
  sellerId?: string,
  listingId?: string,
): Promise<LeadResponse> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "EXCHANGE",
        listingId: listingId || null,
        sellerId: sellerId || "general",
        clientName: slots.name,
        clientEmail: slots.email,
        clientPhone: slots.phone,
        clientCity: slots.city,
        exchangeDetails: {
          currentModel: slots.currentModel,
          currentCapacity: slots.currentCapacity,
          currentColor: slots.currentColor,
          currentCondition: slots.currentCondition,
          currentBattery: slots.currentBattery,
          desiredModel: slots.desiredModel,
          desiredCapacity: slots.desiredCapacity,
          desiredColor: slots.desiredColor,
          minCondition: slots.minCondition,
          maxBudgetDiffCFA: slots.maxBudget,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create exchange lead")
    }

    const data = await response.json()

    // Build WhatsApp link
    const whatsappUrl = buildWhatsAppExchangeLink({
      name: slots.name!,
      phone: slots.phone!,
      city: slots.city!,
      currentModel: slots.currentModel!,
      currentCapacity: slots.currentCapacity!,
      currentColor: slots.currentColor!,
      currentCondition: slots.currentCondition!,
      desiredModel: slots.desiredModel!,
      desiredCapacity: slots.desiredCapacity!,
      minCondition: slots.minCondition!,
      maxBudget: slots.maxBudget!,
      listingRef: listingId,
    })

    return {
      success: true,
      leadId: data.lead?.id,
      whatsappUrl,
    }
  } catch (error) {
    console.error("[v0] Error creating exchange lead:", error)
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    }
  }
}

export async function createBuyLead(
  slots: BuySlots,
  sellerId: string,
  sellerPhone: string,
  listingTitle?: string,
  listingPrice?: number,
): Promise<LeadResponse> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "BUY",
        listingId: slots.listingId,
        sellerId,
        clientName: slots.name,
        clientPhone: slots.phone,
        clientCity: slots.city,
        message: `Intéressé par ${slots.model}`,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create buy lead")
    }

    const data = await response.json()

    // Build WhatsApp link
    const whatsappUrl = buildWhatsAppBuyLink(
      sellerPhone,
      {
        name: slots.name!,
        phone: slots.phone!,
        city: slots.city!,
      },
      {
        id: slots.listingId!,
        title: listingTitle || `${slots.model}`,
        model: slots.model!,
        priceCFA: listingPrice || 0,
      },
    )

    return {
      success: true,
      leadId: data.lead?.id,
      whatsappUrl,
    }
  } catch (error) {
    console.error("[v0] Error creating buy lead:", error)
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    }
  }
}

export async function createSellerApplication(slots: SellerSlots): Promise<SellerApplicationResponse> {
  try {
    const response = await fetch("/api/seller-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopName: slots.shopName,
        whatsapp: slots.phone,
        city: slots.city,
        description: slots.proofs,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create seller application")
    }

    const data = await response.json()

    // Build WhatsApp link for seller onboarding
    const whatsappUrl = buildWhatsAppSellerLink({
      shopName: slots.shopName!,
      phone: slots.phone!,
      city: slots.city!,
    })

    return {
      success: true,
      applicationId: data.application?.id,
      whatsappUrl,
    }
  } catch (error) {
    console.error("[v0] Error creating seller application:", error)
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    }
  }
}
