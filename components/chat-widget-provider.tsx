"use client"

import { ChatWidget } from "./chat-widget"

interface ChatWidgetProviderProps {
  contextListingId?: string
  contextModel?: string
  contextCapacity?: string
  contextPrice?: number
  contextSellerId?: string
  contextSellerPhone?: string
  contextListingTitle?: string
}

export function ChatWidgetProvider(props: ChatWidgetProviderProps) {
  return <ChatWidget {...props} />
}
