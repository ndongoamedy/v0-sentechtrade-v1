import type { Listing, ExchangeDetails } from "./types"

// Build WhatsApp link
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, "")
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

// Format buy message with emojis
export function formatBuyMessage(listing: Listing, productUrl?: string, lang: "fr" | "en" = "fr"): string {
  if (lang === "en") {
    let msg = `👋 Hi! I'm interested in this iPhone:\n\n`
    msg += `━━━━━━━━━━━━━━━━━━━━\n`
    msg += `📱 *PRODUCT DETAILS*\n\n`
    msg += `▫️ Model: ${listing.model} ${listing.capacity}\n`
    msg += `▫️ Title: ${listing.title}\n`
    msg += `▫️ Price: 💰 ${listing.priceCFA.toLocaleString()} CFA\n`
    msg += `▫️ Reference: 🔖 ${listing.id}\n`
    if (productUrl) {
      msg += `▫️ Link: 🔗 ${productUrl}\n`
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
    msg += `✅ Is it still available?`
    return msg
  }

  let msg = `👋 Bonjour ! Je suis intéressé par cet iPhone :\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *DÉTAILS DU PRODUIT*\n\n`
  msg += `▫️ Modèle : ${listing.model} ${listing.capacity}\n`
  msg += `▫️ Titre : ${listing.title}\n`
  msg += `▫️ Prix : 💰 ${listing.priceCFA.toLocaleString()} CFA\n`
  msg += `▫️ Référence : 🔖 ${listing.id}\n`
  if (productUrl) {
    msg += `▫️ Lien : 🔗 ${productUrl}\n`
  }
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
  msg += `✅ Est-il toujours disponible ?`
  return msg
}

export function formatExchangeMessage(
  listing: Listing,
  exchangeDetails: ExchangeDetails,
  clientName: string,
  clientPhone: string,
  clientCity: string,
  productUrl?: string,
  lang: "fr" | "en" = "fr",
): string {
  const { currentModel, currentCapacity, currentCondition, conditionDetails, maxBudgetCFA, currentPhotos } =
    exchangeDetails

  if (lang === "en") {
    let msg = `🔄 Hello! I'd like to exchange my iPhone:\n\n`
    msg += `━━━━━━━━━━━━━━━━━━━━\n`
    msg += `📱 *MY CURRENT IPHONE*\n\n`
    msg += `▫️ Model: ${currentModel} ${currentCapacity}\n`
    msg += `▫️ Overall condition: ${currentCondition}\n`

    // Screen status
    const screenEmoji =
      conditionDetails.screenStatus === "never_changed"
        ? "✨"
        : conditionDetails.screenStatus === "changed"
          ? "🔧"
          : "⚠️"
    const screenText =
      conditionDetails.screenStatus === "never_changed"
        ? "Never changed/Good condition"
        : conditionDetails.screenStatus === "changed"
          ? "Screen replaced"
          : "Cracked"
    msg += `▫️ Screen: ${screenEmoji} ${screenText}\n`

    // Battery
    msg += `▫️ Battery: 🔋 ${conditionDetails.batteryHealth}%`
    msg += ` (${conditionDetails.batteryReplaced ? "Replaced ✅" : "Never replaced"})\n`

    // Face ID
    const faceIdEmoji = conditionDetails.faceIdWorking ? "✅" : "❌"
    msg += `▫️ Face ID: ${faceIdEmoji} ${conditionDetails.faceIdWorking ? "Working" : "Not working"}\n`

    // Photos
    if (currentPhotos && currentPhotos.length > 0) {
      msg += `▫️ Photos: 📸 ${currentPhotos.length} photo(s) available\n`
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
    msg += `📱 *DESIRED IPHONE*\n\n`
    msg += `▫️ Model: ${listing.model} ${listing.capacity}\n`
    msg += `▫️ Min condition: ${listing.condition}\n`
    msg += `▫️ Reference: 🔖 ${listing.id}\n`

    if (productUrl) {
      msg += `▫️ Link: 🔗 ${productUrl}\n`
    }

    if (maxBudgetCFA) {
      msg += `\n💰 Max top-up budget: ${maxBudgetCFA.toLocaleString()} CFA\n`
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
    msg += `👤 *MY CONTACT INFO*\n\n`
    msg += `▫️ Name: ${clientName}\n`
    msg += `▫️ Phone: 📞 ${clientPhone}\n`
    msg += `▫️ City: 📍 ${clientCity}`

    return msg
  }

  let msg = `🔄 Bonjour ! Je souhaite échanger mon iPhone :\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *MON IPHONE ACTUEL*\n\n`
  msg += `▫️ Modèle : ${currentModel} ${currentCapacity}\n`
  msg += `▫️ État général : ${currentCondition}\n`

  // Screen status
  const screenEmoji =
    conditionDetails.screenStatus === "never_changed" ? "✨" : conditionDetails.screenStatus === "changed" ? "🔧" : "⚠️"
  const screenText =
    conditionDetails.screenStatus === "never_changed"
      ? "Jamais changé/Bon état"
      : conditionDetails.screenStatus === "changed"
        ? "Écran changé"
        : "Fissuré"
  msg += `▫️ Écran : ${screenEmoji} ${screenText}\n`

  // Battery
  msg += `▫️ Batterie : 🔋 ${conditionDetails.batteryHealth}%`
  msg += ` (${conditionDetails.batteryReplaced ? "Changée ✅" : "Jamais changée"})\n`

  // Face ID
  const faceIdEmoji = conditionDetails.faceIdWorking ? "✅" : "❌"
  msg += `▫️ Face ID : ${faceIdEmoji} ${conditionDetails.faceIdWorking ? "Fonctionne" : "Ne fonctionne pas"}\n`

  // Photos
  if (currentPhotos && currentPhotos.length > 0) {
    msg += `▫️ Photos : 📸 ${currentPhotos.length} photo(s) disponible(s)\n`
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *IPHONE SOUHAITÉ*\n\n`
  msg += `▫️ Modèle : ${listing.model} ${listing.capacity}\n`
  msg += `▫️ État min : ${listing.condition}\n`
  msg += `▫️ Réf : 🔖 ${listing.id}\n`

  if (productUrl) {
    msg += `▫️ Lien : 🔗 ${productUrl}\n`
  }

  if (maxBudgetCFA) {
    msg += `\n💰 Budget différence max : ${maxBudgetCFA.toLocaleString()} CFA\n`
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
  msg += `👤 *MES COORDONNÉES*\n\n`
  msg += `▫️ Nom : ${clientName}\n`
  msg += `▫️ Téléphone : 📞 ${clientPhone}\n`
  msg += `▫️ Ville : 📍 ${clientCity}`

  return msg
}

// Helper functions for chatbot integration
export function buildWhatsAppBuyLink(
  sellerPhone: string,
  customer: { name: string; phone: string; city: string },
  listing: { id: string; title: string; model: string; priceCFA: number },
): string {
  let msg = `👋 Bonjour ! Je suis intéressé par cet iPhone :\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *DÉTAILS DU PRODUIT*\n\n`
  msg += `▫️ Modèle : ${listing.model}\n`
  msg += `▫️ Titre : ${listing.title}\n`
  msg += `▫️ Prix : 💰 ${listing.priceCFA.toLocaleString()} CFA\n`
  msg += `▫️ Référence : 🔖 ${listing.id}\n`
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
  msg += `👤 *MES COORDONNÉES*\n\n`
  msg += `▫️ Nom : ${customer.name}\n`
  msg += `▫️ Téléphone : 📞 ${customer.phone}\n`
  msg += `▫️ Ville : 📍 ${customer.city}\n`
  msg += `\n✅ Est-il toujours disponible ?`

  return buildWhatsAppLink(sellerPhone, msg)
}

export function buildWhatsAppExchangeLink(params: {
  name: string
  phone: string
  city: string
  currentModel: string
  currentCapacity: string
  currentColor: string
  currentCondition: string
  desiredModel: string
  desiredCapacity: string
  minCondition: string
  maxBudget: number
  listingRef?: string
}): string {
  let msg = `🔄 Bonjour ! Je souhaite échanger mon iPhone :\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *MON IPHONE ACTUEL*\n\n`
  msg += `▫️ Modèle : ${params.currentModel} ${params.currentCapacity}\n`
  msg += `▫️ Couleur : ${params.currentColor}\n`
  msg += `▫️ État général : ${params.currentCondition}\n`
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📱 *IPHONE SOUHAITÉ*\n\n`
  msg += `▫️ Modèle : ${params.desiredModel} ${params.desiredCapacity}\n`
  msg += `▫️ État minimum : ${params.minCondition}\n`
  if (params.listingRef) {
    msg += `▫️ Réf : 🔖 ${params.listingRef}\n`
  }
  msg += `\n💰 Budget différence max : ${params.maxBudget.toLocaleString()} CFA\n`
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`
  msg += `👤 *MES COORDONNÉES*\n\n`
  msg += `▫️ Nom : ${params.name}\n`
  msg += `▫️ Téléphone : 📞 ${params.phone}\n`
  msg += `▫️ Ville : 📍 ${params.city}`

  // Use general support number for exchanges
  return buildWhatsAppLink("+221778515563", msg)
}

export function buildWhatsAppSellerLink(params: {
  shopName: string
  phone: string
  city: string
}): string {
  let msg = `🏪 Bonjour ! Je souhaite devenir vendeur partenaire :\n\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n`
  msg += `📋 *INFORMATIONS BOUTIQUE*\n\n`
  msg += `▫️ Nom de la boutique : ${params.shopName}\n`
  msg += `▫️ WhatsApp : 📞 ${params.phone}\n`
  msg += `▫️ Ville : 📍 ${params.city}\n`
  msg += `\n━━━━━━━━━━━━━━━━━━━━\n\n`
  msg += `✅ Je souhaite rejoindre votre réseau de vendeurs vérifiés.`

  // Use general support number for seller applications
  return buildWhatsAppLink("+221778515563", msg)
}
