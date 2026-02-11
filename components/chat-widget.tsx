"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Loader2, AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatbotService } from "@/lib/chatbot/service"
import { quickActions } from "@/lib/chatbot/faq-data"
import { createExchangeLead, createBuyLead, createSellerApplication } from "@/lib/chatbot/api"
import { getChatbotAnalytics } from "@/lib/chatbot/analytics"
import { rateLimiter } from "@/lib/chatbot/rate-limit"
import type { ChatSession, ChatMessage } from "@/lib/chatbot/intents"

interface ChatWidgetProps {
  contextListingId?: string
  contextModel?: string
  contextCapacity?: string
  contextPrice?: number
  contextSellerId?: string
  contextSellerPhone?: string
  contextListingTitle?: string
}

export function ChatWidget({
  contextListingId,
  contextModel,
  contextCapacity,
  contextPrice,
  contextSellerId,
  contextSellerPhone,
  contextListingTitle,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [chatbot, setChatbot] = useState<ChatbotService | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const analytics = getChatbotAnalytics()

  const initializeChatbot = () => {
    const session: Partial<ChatSession> = {
      contextListingId,
      contextModel,
      contextCapacity,
      contextPrice,
      contextSellerId,
    }
    const bot = new ChatbotService(session)
    setChatbot(bot)

    // Add welcome message
    bot.processMessage("bonjour")
    setMessages(bot.getSession().messages)
    setRateLimitError(null)

    analytics.trackEvent({
      type: "bot_open",
      sessionId: bot.getSession().id,
      metadata: {
        hasContext: !!contextListingId,
        listingId: contextListingId,
        model: contextModel,
      },
    })
  }

  // Initialize chatbot with context
  useEffect(() => {
    initializeChatbot()
  }, [contextListingId, contextModel, contextCapacity, contextPrice, contextSellerId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleRestartChat = () => {
    initializeChatbot()
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || !chatbot || isLoading) return

    if (textToSend === "/catalog") {
      window.location.href = "/boutique"
      return
    }

    setIsLoading(true)
    setInput("")

    try {
      const response = chatbot.processMessage(textToSend)
      setMessages([...chatbot.getSession().messages])

      analytics.trackEvent({
        type: "bot_message_sent",
        sessionId: chatbot.getSession().id,
        metadata: { messageLength: textToSend.length },
      })

      if (chatbot.getSession().intent) {
        analytics.trackEvent({
          type: "bot_intent_detected",
          sessionId: chatbot.getSession().id,
          intent: chatbot.getSession().intent,
        })
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (value: string) => {
    if (!chatbot || isLoading) return
    handleSend(value)
  }

  const handleQuickAction = (actionId: string) => {
    if (!chatbot || isLoading) return

    const actionMessages: Record<string, string> = {
      exchange: "Je veux échanger mon iPhone",
      buy: "Je veux acheter un iPhone",
      seller: "Je veux devenir vendeur",
      help: "Aide",
    }

    const message = actionMessages[actionId] || actionId
    handleSend(message)
  }

  const handleSubmitLead = async () => {
    if (!chatbot || !chatbot.isReadyToSubmit() || isSubmitting) return

    const limitCheck = rateLimiter.checkLimit()
    if (!limitCheck.allowed) {
      const resetTime = limitCheck.resetAt?.toLocaleString("fr-FR")
      setRateLimitError(
        `Vous avez atteint la limite de ${3} demandes par 24h. Réessayez après ${resetTime} ou contactez-nous directement sur WhatsApp.`,
      )
      return
    }

    setIsSubmitting(true)
    const session = chatbot.getSession()

    try {
      if (session.intent === "exchange") {
        const result = await createExchangeLead(session.exchangeSlots!, contextSellerId, contextListingId)

        if (result.success && result.whatsappUrl) {
          rateLimiter.incrementCount()

          analytics.trackEvent({
            type: "bot_lead_created",
            sessionId: session.id,
            intent: "exchange",
            leadId: result.leadId,
            metadata: {
              currentModel: session.exchangeSlots?.currentModel,
              desiredModel: session.exchangeSlots?.desiredModel,
            },
          })

          window.open(result.whatsappUrl, "_blank")

          analytics.trackEvent({
            type: "bot_wa_clicked",
            sessionId: session.id,
            intent: "exchange",
            leadId: result.leadId,
          })

          const successMsg =
            session.language === "fr"
              ? "✅ Votre demande d'échange a été créée ! Vous allez être redirigé vers WhatsApp."
              : "✅ Your exchange request has been created! You will be redirected to WhatsApp."
          chatbot.addMessage("assistant", successMsg)
          setMessages([...chatbot.getSession().messages])
        } else {
          throw new Error(result.error)
        }
      } else if (session.intent === "buy") {
        const result = await createBuyLead(
          session.buySlots!,
          contextSellerId || "general",
          contextSellerPhone || "+221778515563",
          contextListingTitle,
          contextPrice,
        )

        if (result.success && result.whatsappUrl) {
          rateLimiter.incrementCount()

          analytics.trackEvent({
            type: "bot_lead_created",
            sessionId: session.id,
            intent: "buy",
            leadId: result.leadId,
            metadata: {
              model: session.buySlots?.model,
              listingId: contextListingId,
            },
          })

          window.open(result.whatsappUrl, "_blank")

          analytics.trackEvent({
            type: "bot_wa_clicked",
            sessionId: session.id,
            intent: "buy",
            leadId: result.leadId,
          })

          const successMsg =
            session.language === "fr"
              ? "✅ Votre demande d'achat a été créée ! Vous allez être redirigé vers WhatsApp."
              : "✅ Your purchase request has been created! You will be redirected to WhatsApp."
          chatbot.addMessage("assistant", successMsg)
          setMessages([...chatbot.getSession().messages])
        } else {
          throw new Error(result.error)
        }
      } else if (session.intent === "seller") {
        const result = await createSellerApplication(session.sellerSlots!)

        if (result.success && result.whatsappUrl) {
          rateLimiter.incrementCount()

          analytics.trackEvent({
            type: "bot_lead_created",
            sessionId: session.id,
            intent: "seller",
            leadId: result.applicationId,
            metadata: {
              shopName: session.sellerSlots?.shopName,
              city: session.sellerSlots?.city,
            },
          })

          window.open(result.whatsappUrl, "_blank")

          analytics.trackEvent({
            type: "bot_wa_clicked",
            sessionId: session.id,
            intent: "seller",
            leadId: result.applicationId,
          })

          const successMsg =
            session.language === "fr"
              ? "✅ Votre candidature a été envoyée ! Notre équipe vous contactera sous 48-72h."
              : "✅ Your application has been submitted! Our team will contact you within 48-72h."
          chatbot.addMessage("assistant", successMsg)
          setMessages([...chatbot.getSession().messages])
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error("[v0] Submit error:", error)
      const errorMsg =
        session.language === "fr"
          ? "❌ Une erreur est survenue. Veuillez réessayer ou nous contacter directement."
          : "❌ An error occurred. Please try again or contact us directly."
      chatbot.addMessage("assistant", errorMsg)
      setMessages([...chatbot.getSession().messages])
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md z-50">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-[600px] max-h-[80vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant SenTechTrade</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                En ligne
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestartChat}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Recommencer"
              title="Recommencer le chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Minimiser"
            >
              <span className="text-xl leading-none">−</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                  {message.role === "assistant" && message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => handleQuickReply(reply.value)}
                          disabled={isLoading}
                          className="px-3 py-2 bg-white hover:bg-blue-50 text-blue-600 text-sm rounded-lg border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Limit Error */}
            {rateLimitError && (
              <div className="px-4 py-3 bg-red-50 border-t border-red-200">
                <div className="flex items-start gap-2 text-sm text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{rateLimitError}</p>
                </div>
              </div>
            )}

            {/* Submit Button (when ready) */}
            {chatbot?.isReadyToSubmit() && !rateLimitError && (
              <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                <Button
                  onClick={handleSubmitLead}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Continuer sur WhatsApp"
                  )}
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ou tape ta réponse..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
