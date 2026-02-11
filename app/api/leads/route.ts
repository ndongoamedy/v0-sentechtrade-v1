import { NextResponse } from "next/server"
import type { LeadType, ExchangeDetails } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { type, listingId, sellerId, clientName, clientEmail, clientPhone, clientCity, message, exchangeDetails } =
      body

    // Validate required fields
    if (!type || !listingId || !sellerId || !clientName || !clientPhone || !clientCity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to database
    const lead = {
      id: `lead-${Date.now()}`,
      type: type as LeadType,
      listingId,
      sellerId,
      clientName,
      clientEmail,
      clientPhone,
      clientCity,
      message,
      exchangeDetails: exchangeDetails as ExchangeDetails | undefined,
      status: "NEW",
      createdAt: new Date(),
    }

    console.log("[v0] Lead created:", lead)

    // In a real app, you might also:
    // - Send notification to seller
    // - Send confirmation email to client
    // - Track analytics

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")
    const listingId = searchParams.get("listingId")

    // In a real app, this would query the database
    // For now, return mock data
    const mockLeads = [
      {
        id: "1",
        type: "BUY",
        listingId: "1",
        sellerId: "s1",
        clientName: "Amadou Diop",
        clientPhone: "+221 77 123 45 67",
        clientCity: "Dakar",
        message: "Interested in buying",
        status: "NEW",
        createdAt: new Date("2025-01-28"),
      },
    ]

    let filteredLeads = mockLeads

    if (sellerId) {
      filteredLeads = filteredLeads.filter((l) => l.sellerId === sellerId)
    }

    if (listingId) {
      filteredLeads = filteredLeads.filter((l) => l.listingId === listingId)
    }

    return NextResponse.json({ leads: filteredLeads })
  } catch (error) {
    console.error("[v0] Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
