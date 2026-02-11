export interface ChatbotEvent {
  type: "bot_open" | "bot_intent_detected" | "bot_lead_created" | "bot_wa_clicked" | "bot_message_sent"
  sessionId: string
  intent?: string
  leadId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export class ChatbotAnalytics {
  private events: ChatbotEvent[] = []

  trackEvent(event: Omit<ChatbotEvent, "timestamp">): void {
    const fullEvent: ChatbotEvent = {
      ...event,
      timestamp: new Date(),
    }

    this.events.push(fullEvent)

    // Log to console for debugging
    console.log("[v0] Chatbot Event:", fullEvent)

    // In production, send to analytics service
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", event.type, {
        session_id: event.sessionId,
        intent: event.intent,
        lead_id: event.leadId,
        ...event.metadata,
      })
    }
  }

  getEvents(): ChatbotEvent[] {
    return this.events
  }

  exportCSV(): string {
    const headers = ["Type", "Session ID", "Intent", "Lead ID", "Timestamp", "Metadata"]
    const rows = this.events.map((event) => [
      event.type,
      event.sessionId,
      event.intent || "",
      event.leadId || "",
      event.timestamp.toISOString(),
      JSON.stringify(event.metadata || {}),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }
}

// Singleton instance
let analyticsInstance: ChatbotAnalytics | null = null

export function getChatbotAnalytics(): ChatbotAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new ChatbotAnalytics()
  }
  return analyticsInstance
}
