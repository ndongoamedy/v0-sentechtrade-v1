import {
  detectIntent,
  detectLanguage,
  type ChatSession,
  type Intent,
  type ChatMessage,
  type QuickReply,
} from "./intents"
import { faqData } from "./faq-data"
import { getResponse } from "./responses"
import { iPhoneModels, modelStorageMap } from "../data"
import type { iPhoneModel, Capacity } from "../types"
import { calculateTopUp, formatEstimation, type PhoneConditionDetails } from "./estimation"

export class ChatbotService {
  private session: ChatSession

  constructor(session?: Partial<ChatSession>) {
    this.session = {
      id: session?.id || crypto.randomUUID(),
      language: session?.language || "fr",
      messages: session?.messages || [],
      contextListingId: session?.contextListingId,
      contextModel: session?.contextModel,
      contextCapacity: session?.contextCapacity,
      contextPrice: session?.contextPrice,
      contextSellerId: session?.contextSellerId,
      createdAt: session?.createdAt || new Date(),
      ...session,
    }
  }

  getSession(): ChatSession {
    return this.session
  }

  addMessage(role: "user" | "assistant", content: string, quickReplies?: QuickReply[]): ChatMessage {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      quickReplies,
    }
    this.session.messages.push(message)
    return message
  }

  processMessage(userMessage: string): string {
    this.addMessage("user", userMessage)

    // Detect language if first message
    if (this.session.messages.length === 1) {
      this.session.language = detectLanguage(userMessage)
    }

    // Detect intent if not set
    if (!this.session.intent) {
      const intent = detectIntent(userMessage)

      if (intent === "greeting") {
        const response = getResponse("greeting", this.session.language)
        const quickReplies: QuickReply[] = [
          {
            id: "exchange",
            label: this.session.language === "fr" ? "🔄 Échanger" : "🔄 Exchange",
            value: "Je veux échanger mon iPhone",
          },
          {
            id: "buy",
            label: this.session.language === "fr" ? "🛒 Acheter" : "🛒 Buy",
            value: "Je veux acheter un iPhone",
          },
          {
            id: "seller",
            label: this.session.language === "fr" ? "🏪 Devenir vendeur" : "🏪 Become seller",
            value: "Je veux devenir vendeur",
          },
          { id: "faq", label: this.session.language === "fr" ? "❓ FAQ" : "❓ FAQ", value: "Aide" },
        ]
        this.addMessage("assistant", response, quickReplies)
        return response
      }

      if (intent === "unknown") {
        const response = getResponse("unknown", this.session.language)
        const quickReplies: QuickReply[] = [
          {
            id: "exchange",
            label: this.session.language === "fr" ? "🔄 Échanger" : "🔄 Exchange",
            value: "Je veux échanger mon iPhone",
          },
          {
            id: "buy",
            label: this.session.language === "fr" ? "🛒 Acheter" : "🛒 Buy",
            value: "Je veux acheter un iPhone",
          },
          {
            id: "seller",
            label: this.session.language === "fr" ? "🏪 Devenir vendeur" : "🏪 Become seller",
            value: "Je veux devenir vendeur",
          },
        ]
        this.addMessage("assistant", response, quickReplies)
        return response
      }

      this.session.intent = intent
      return this.handleIntent(intent, userMessage)
    }

    // Continue with current intent
    return this.continueIntent(userMessage)
  }

  private handleIntent(intent: Intent, message: string): string {
    switch (intent) {
      case "exchange":
        this.session.exchangeSlots = {}
        const response = getResponse("exchange_start", this.session.language)
        const modelButtons = this.getModelButtons()
        this.addMessage("assistant", response, modelButtons)
        return response

      case "buy":
        this.session.buySlots = {
          listingId: this.session.contextListingId,
          model: this.session.contextModel as iPhoneModel,
        }
        const buyResponse = getResponse("buy_start", this.session.language)
        if (!this.session.contextModel) {
          const modelButtons = this.getModelButtons()
          this.addMessage("assistant", buyResponse, modelButtons)
        } else {
          this.addMessage("assistant", buyResponse)
        }
        return buyResponse

      case "seller":
        this.session.sellerSlots = {}
        const sellerResponse = getResponse("seller_start", this.session.language)
        this.addMessage("assistant", sellerResponse)
        return sellerResponse

      case "faq":
        return this.handleFAQ(message)

      default:
        const unknownResponse = getResponse("unknown", this.session.language)
        this.addMessage("assistant", unknownResponse)
        return unknownResponse
    }
  }

  private continueIntent(message: string): string {
    switch (this.session.intent) {
      case "exchange":
        return this.handleExchangeFlow(message)
      case "buy":
        return this.handleBuyFlow(message)
      case "seller":
        return this.handleSellerFlow(message)
      default:
        return this.handleFAQ(message)
    }
  }

  private handleExchangeFlow(message: string): string {
    const slots = this.session.exchangeSlots!

    // Current model
    if (!slots.currentModel) {
      const model = this.extractModel(message)
      if (model) {
        slots.currentModel = model
        const response = getResponse("ask_current_capacity", this.session.language)
        const capacityButtons = this.getCapacityButtons(model)
        this.addMessage("assistant", response, capacityButtons)
        return response
      }
      const response = getResponse("invalid_model", this.session.language)
      const modelButtons = this.getModelButtons()
      this.addMessage("assistant", response, modelButtons)
      return response
    }

    // Current capacity
    if (!slots.currentCapacity) {
      const capacity = this.extractCapacity(message, slots.currentModel)
      if (capacity) {
        slots.currentCapacity = capacity
        const response = getResponse("ask_screen_condition", this.session.language)
        const screenButtons = this.getScreenConditionButtons()
        this.addMessage("assistant", response, screenButtons)
        return response
      }
      const validCapacities = modelStorageMap[slots.currentModel].join(", ")
      const response = getResponse("invalid_capacity", this.session.language) + validCapacities
      const capacityButtons = this.getCapacityButtons(slots.currentModel)
      this.addMessage("assistant", response, capacityButtons)
      return response
    }

    if (!slots.currentScreenCondition) {
      const screenCondition = this.extractScreenCondition(message)
      if (screenCondition) {
        slots.currentScreenCondition = screenCondition
        const response = getResponse("ask_back_condition", this.session.language)
        const backButtons = this.getBackConditionButtons()
        this.addMessage("assistant", response, backButtons)
        return response
      }
      const response = getResponse("ask_screen_condition", this.session.language)
      const screenButtons = this.getScreenConditionButtons()
      this.addMessage("assistant", response, screenButtons)
      return response
    }

    if (!slots.currentBackCondition) {
      const backCondition = this.extractBackCondition(message)
      if (backCondition) {
        slots.currentBackCondition = backCondition
        const response = getResponse("ask_face_id", this.session.language)
        const faceIdButtons = this.getFaceIdButtons()
        this.addMessage("assistant", response, faceIdButtons)
        return response
      }
      const response = getResponse("ask_back_condition", this.session.language)
      const backButtons = this.getBackConditionButtons()
      this.addMessage("assistant", response, backButtons)
      return response
    }

    if (!slots.currentFaceId) {
      const faceId = this.extractFaceId(message)
      if (faceId) {
        slots.currentFaceId = faceId
        const response = getResponse("ask_battery", this.session.language)
        this.addMessage("assistant", response)
        return response
      }
      const response = getResponse("ask_face_id", this.session.language)
      const faceIdButtons = this.getFaceIdButtons()
      this.addMessage("assistant", response, faceIdButtons)
      return response
    }

    if (slots.currentBattery === undefined) {
      const battery = this.extractBattery(message)
      if (battery !== null) {
        slots.currentBattery = battery
        const response = getResponse("ask_desired_model", this.session.language)
        const modelButtons = this.getModelButtons()
        this.addMessage("assistant", response, modelButtons)
        return response
      }
      const response = getResponse("invalid_battery", this.session.language)
      this.addMessage("assistant", response)
      return response
    }

    // Desired model
    if (!slots.desiredModel) {
      const model = this.extractModel(message)
      if (model) {
        slots.desiredModel = model
        const response = getResponse("ask_desired_capacity", this.session.language)
        const capacityButtons = this.getCapacityButtons(model)
        this.addMessage("assistant", response, capacityButtons)
        return response
      }
      const response = getResponse("invalid_model", this.session.language)
      const modelButtons = this.getModelButtons()
      this.addMessage("assistant", response, modelButtons)
      return response
    }

    // Desired capacity - Calculate estimation after this
    if (!slots.desiredCapacity) {
      const capacity = this.extractCapacity(message, slots.desiredModel)
      if (capacity) {
        slots.desiredCapacity = capacity
        return this.showEstimation()
      }
      const validCapacities = modelStorageMap[slots.desiredModel].join(", ")
      const response = getResponse("invalid_capacity", this.session.language) + validCapacities
      const capacityButtons = this.getCapacityButtons(slots.desiredModel)
      this.addMessage("assistant", response, capacityButtons)
      return response
    }

    if (!slots.name) {
      slots.name = message.trim()
      const response = getResponse("ask_phone", this.session.language)
      this.addMessage("assistant", response)
      return response
    }

    if (!slots.phone) {
      slots.phone = message.trim()
      const response = getResponse("ask_city", this.session.language)
      const cityButtons = this.getCityButtons()
      this.addMessage("assistant", response, cityButtons)
      return response
    }

    // City (final step)
    if (!slots.city) {
      slots.city = message.trim()
      return this.completeExchange()
    }

    return getResponse("unknown", this.session.language)
  }

  private handleBuyFlow(message: string): string {
    const slots = this.session.buySlots!

    // Model (if not from context)
    if (!slots.model) {
      const model = this.extractModel(message)
      if (model) {
        slots.model = model
        const response = getResponse("ask_name", this.session.language)
        this.addMessage("assistant", response)
        return response
      }
      const response = getResponse("invalid_model", this.session.language)
      const modelButtons = this.getModelButtons()
      this.addMessage("assistant", response, modelButtons)
      return response
    }

    // Name
    if (!slots.name) {
      slots.name = message.trim()
      const response = getResponse("ask_phone", this.session.language)
      this.addMessage("assistant", response)
      return response
    }

    // Phone
    if (!slots.phone) {
      slots.phone = message.trim()
      const response = getResponse("ask_city", this.session.language)
      const cityButtons = this.getCityButtons()
      this.addMessage("assistant", response, cityButtons)
      return response
    }

    // City (final step)
    if (!slots.city) {
      slots.city = message.trim()
      return this.completeBuy()
    }

    return getResponse("unknown", this.session.language)
  }

  private handleSellerFlow(message: string): string {
    const slots = this.session.sellerSlots!

    // Shop name
    if (!slots.shopName) {
      slots.shopName = message.trim()
      const response = getResponse("ask_phone", this.session.language)
      this.addMessage("assistant", response)
      return response
    }

    // Phone
    if (!slots.phone) {
      slots.phone = message.trim()
      const response = getResponse("ask_city", this.session.language)
      const cityButtons = this.getCityButtons()
      this.addMessage("assistant", response, cityButtons)
      return response
    }

    // City (final step)
    if (!slots.city) {
      slots.city = message.trim()
      return this.completeSeller()
    }

    return getResponse("unknown", this.session.language)
  }

  private handleFAQ(message: string): string {
    const query = message.toLowerCase()

    // Find matching FAQ
    for (const faq of faqData) {
      if (faq.keywords.some((keyword) => query.includes(keyword.toLowerCase()))) {
        this.addMessage("assistant", faq.answer)
        return faq.answer
      }
    }

    // No match found
    const response =
      "Je n'ai pas trouvé de réponse à cette question. Voulez-vous :\n• Échanger votre iPhone\n• Acheter un iPhone\n• Devenir vendeur\n\nOu contactez-nous sur WhatsApp pour plus d'aide."
    const quickReplies: QuickReply[] = [
      { id: "exchange", label: "🔄 Échanger", value: "Je veux échanger mon iPhone" },
      { id: "buy", label: "🛒 Acheter", value: "Je veux acheter un iPhone" },
      { id: "seller", label: "🏪 Devenir vendeur", value: "Je veux devenir vendeur" },
    ]
    this.addMessage("assistant", response, quickReplies)
    return response
  }

  private extractModel(message: string): iPhoneModel | null {
    const normalized = message.toLowerCase()

    for (const model of iPhoneModels) {
      const modelLower = model.toLowerCase()
      if (normalized.includes(modelLower)) {
        return model
      }

      // Try without "iPhone" prefix
      const modelWithoutPrefix = modelLower.replace("iphone ", "")
      if (normalized.includes(modelWithoutPrefix)) {
        return model
      }
    }

    return null
  }

  private extractCapacity(message: string, model: iPhoneModel): Capacity | null {
    const validCapacities = modelStorageMap[model]
    const normalized = message.toLowerCase().replace(/\s/g, "")

    for (const capacity of validCapacities) {
      if (normalized.includes(capacity.toLowerCase())) {
        return capacity
      }
    }

    return null
  }

  private extractScreenCondition(message: string): "ok" | "changed" | "cracked" | null {
    const normalized = message.toLowerCase()
    if (normalized.includes("ok") || normalized.includes("bon") || normalized.includes("jamais")) {
      return "ok"
    }
    if (normalized.includes("changé") || normalized.includes("remplacé") || normalized.includes("changed")) {
      return "changed"
    }
    if (normalized.includes("fissuré") || normalized.includes("cassé") || normalized.includes("cracked")) {
      return "cracked"
    }
    return null
  }

  private extractBackCondition(message: string): "ok" | "cracked" | "hidden" | null {
    const normalized = message.toLowerCase()
    if (normalized.includes("ok") || normalized.includes("bon")) {
      return "ok"
    }
    if (normalized.includes("fissuré") || normalized.includes("cassé") || normalized.includes("cracked")) {
      return "cracked"
    }
    if (normalized.includes("caché") || normalized.includes("coque") || normalized.includes("hidden")) {
      return "hidden"
    }
    return null
  }

  private extractFaceId(message: string): "ok" | "broken" | null {
    const normalized = message.toLowerCase()
    if (
      normalized.includes("oui") ||
      normalized.includes("ok") ||
      normalized.includes("fonctionne") ||
      normalized.includes("yes") ||
      normalized.includes("works")
    ) {
      return "ok"
    }
    if (
      normalized.includes("non") ||
      normalized.includes("hs") ||
      normalized.includes("cassé") ||
      normalized.includes("no") ||
      normalized.includes("broken")
    ) {
      return "broken"
    }
    return null
  }

  private extractBattery(message: string): number | "changed" | null {
    const normalized = message.toLowerCase()
    if (normalized.includes("changé") || normalized.includes("remplacé") || normalized.includes("changed")) {
      return "changed"
    }
    const match = message.match(/\d+/)
    if (match) {
      const percentage = Number.parseInt(match[0])
      if (percentage >= 0 && percentage <= 100) {
        return percentage
      }
    }
    return null
  }

  private completeExchange(): string {
    const slots = this.session.exchangeSlots!
    const summary =
      this.session.language === "fr"
        ? `✅ Récapitulatif de votre demande d'échange :\n\n📱 VOTRE IPHONE :\n• ${slots.currentModel} ${slots.currentCapacity}\n• Écran : ${slots.currentScreenCondition}\n• Dos : ${slots.currentBackCondition}\n• Face ID : ${slots.currentFaceId}\n• Batterie : ${typeof slots.currentBattery === "number" ? slots.currentBattery + "%" : slots.currentBattery}\n\n🎯 IPHONE SOUHAITÉ :\n• ${slots.desiredModel} ${slots.desiredCapacity}\n\n👤 VOS COORDONNÉES :\n• Nom : ${slots.name}\n• WhatsApp : ${slots.phone}\n• Ville : ${slots.city}\n\nTout est correct ? Je vais créer votre demande d'échange ! 🚀`
        : `✅ Exchange Request Summary:\n\n📱 YOUR IPHONE:\n• ${slots.currentModel} ${slots.currentCapacity}\n• Screen: ${slots.currentScreenCondition}\n• Back: ${slots.currentBackCondition}\n• Face ID: ${slots.currentFaceId}\n• Battery: ${typeof slots.currentBattery === "number" ? slots.currentBattery + "%" : slots.currentBattery}\n\n🎯 DESIRED IPHONE:\n• ${slots.desiredModel} ${slots.desiredCapacity}\n\n👤 YOUR INFO:\n• Name: ${slots.name}\n• WhatsApp: ${slots.phone}\n• City: ${slots.city}\n\nEverything correct? I'll create your exchange request! 🚀`

    this.addMessage("assistant", summary)
    return summary
  }

  private completeBuy(): string {
    const slots = this.session.buySlots!
    const summary =
      this.session.language === "fr"
        ? `✅ Récapitulatif de votre achat :\n\n📱 IPHONE :\n• ${slots.model}\n\n👤 VOS COORDONNÉES :\n• Nom : ${slots.name}\n• WhatsApp : ${slots.phone}\n• Ville : ${slots.city}\n\nTout est correct ? Je vais créer votre demande d'achat ! 🚀`
        : `✅ Purchase Summary:\n\n📱 IPHONE:\n• ${slots.model}\n\n👤 YOUR INFO:\n• Name: ${slots.name}\n• WhatsApp: ${slots.phone}\n• City: ${slots.city}\n\nEverything correct? I'll create your purchase request! 🚀`

    this.addMessage("assistant", summary)
    return summary
  }

  private completeSeller(): string {
    const slots = this.session.sellerSlots!
    const summary =
      this.session.language === "fr"
        ? `✅ Récapitulatif de votre candidature :\n\n🏪 BOUTIQUE :\n• Nom : ${slots.shopName}\n• WhatsApp : ${slots.phone}\n• Ville : ${slots.city}\n\nTout est correct ? Je vais envoyer votre candidature ! 🚀\n\nNotre équipe l'examinera sous 48-72h.`
        : `✅ Application Summary:\n\n🏪 SHOP:\n• Name: ${slots.shopName}\n• WhatsApp: ${slots.phone}\n• City: ${slots.city}\n\nEverything correct? I'll submit your application! 🚀\n\nOur team will review it within 48-72h.`

    this.addMessage("assistant", summary)
    return summary
  }

  isReadyToSubmit(): boolean {
    if (this.session.intent === "exchange") {
      const slots = this.session.exchangeSlots
      return !!(
        slots?.currentModel &&
        slots?.currentCapacity &&
        slots?.currentScreenCondition &&
        slots?.currentBackCondition &&
        slots?.currentFaceId &&
        slots?.currentBattery !== undefined &&
        slots?.desiredModel &&
        slots?.desiredCapacity &&
        slots?.name &&
        slots?.phone &&
        slots?.city
      )
    }

    if (this.session.intent === "buy") {
      const slots = this.session.buySlots
      return !!(slots?.model && slots?.name && slots?.phone && slots?.city)
    }

    if (this.session.intent === "seller") {
      const slots = this.session.sellerSlots
      return !!(slots?.shopName && slots?.phone && slots?.city)
    }

    return false
  }

  private getModelButtons(): QuickReply[] {
    return iPhoneModels.map((model) => ({
      id: model,
      label: model,
      value: model,
    }))
  }

  private getCapacityButtons(model: iPhoneModel): QuickReply[] {
    const capacities = modelStorageMap[model] || []
    return capacities.map((capacity) => ({
      id: capacity,
      label: capacity,
      value: capacity,
    }))
  }

  private getScreenConditionButtons(): QuickReply[] {
    return [
      {
        id: "screen-ok",
        label: this.session.language === "fr" ? "✅ OK / Jamais changé" : "✅ OK / Never changed",
        value: this.session.language === "fr" ? "ok" : "ok",
      },
      {
        id: "screen-changed",
        label: this.session.language === "fr" ? "🔧 Changé" : "🔧 Changed",
        value: this.session.language === "fr" ? "changé" : "changed",
      },
      {
        id: "screen-cracked",
        label: this.session.language === "fr" ? "💔 Fissuré" : "💔 Cracked",
        value: this.session.language === "fr" ? "fissuré" : "cracked",
      },
    ]
  }

  private getBackConditionButtons(): QuickReply[] {
    return [
      {
        id: "back-ok",
        label: this.session.language === "fr" ? "✅ OK" : "✅ OK",
        value: "ok",
      },
      {
        id: "back-cracked",
        label: this.session.language === "fr" ? "💔 Fissuré/Cassé" : "💔 Cracked",
        value: this.session.language === "fr" ? "fissuré" : "cracked",
      },
      {
        id: "back-hidden",
        label: this.session.language === "fr" ? "📱 Caché (coque)" : "📱 Hidden (case)",
        value: this.session.language === "fr" ? "caché" : "hidden",
      },
    ]
  }

  private getFaceIdButtons(): QuickReply[] {
    return [
      {
        id: "faceid-ok",
        label: this.session.language === "fr" ? "✅ Fonctionne" : "✅ Works",
        value: this.session.language === "fr" ? "oui" : "yes",
      },
      {
        id: "faceid-broken",
        label: this.session.language === "fr" ? "❌ Ne fonctionne pas" : "❌ Doesn't work",
        value: this.session.language === "fr" ? "non" : "no",
      },
    ]
  }

  private getCityButtons(): QuickReply[] {
    const cities = ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Mbour", "Rufisque", "Touba"]
    return cities.map((city) => ({
      id: city,
      label: city,
      value: city,
    }))
  }

  private showEstimation(): string {
    const slots = this.session.exchangeSlots!

    const conditionDetails: PhoneConditionDetails = {
      screen: slots.currentScreenCondition!,
      back: slots.currentBackCondition!,
      faceId: slots.currentFaceId!,
      battery: slots.currentBattery!,
    }

    const estimation = calculateTopUp(
      slots.currentModel!,
      slots.currentCapacity!,
      conditionDetails,
      slots.desiredModel!,
      slots.desiredCapacity!,
    )

    if (!estimation) {
      const response = getResponse("estimation_unavailable", this.session.language)
      this.addMessage("assistant", response)
      return response
    }

    const estimationMessage = formatEstimation(
      estimation,
      slots.currentModel!,
      slots.currentCapacity!,
      slots.desiredModel!,
      slots.desiredCapacity!,
      this.session.language,
    )

    const followUp =
      this.session.language === "fr"
        ? "\n\n✅ Cette estimation te convient ?\nDonne-moi tes coordonnées pour finaliser la demande d'échange.\n\nQuel est ton nom complet ?"
        : "\n\n✅ Does this estimation work for you?\nGive me your contact info to finalize the exchange request.\n\nWhat's your full name?"

    const fullMessage = estimationMessage + followUp

    const quickReplies: QuickReply[] = [
      {
        id: "view-catalog",
        label: this.session.language === "fr" ? "🛍️ Voir la boutique" : "🛍️ View catalog",
        value: "/catalog",
      },
    ]

    this.addMessage("assistant", fullMessage, quickReplies)
    return fullMessage
  }
}
