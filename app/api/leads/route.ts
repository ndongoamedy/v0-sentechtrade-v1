import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { LeadType, ExchangeDetails } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { type, listingId, sellerId, clientName, clientEmail, clientPhone, clientCity, message, exchangeDetails } = body

    // Validate required fields
    if (!type || !listingId || !sellerId || !clientName || !clientPhone || !clientCity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        type: type as LeadType,
        listing_id: listingId,
        seller_id: sellerId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_city: clientCity,
        message,
        exchange_details: exchangeDetails as ExchangeDetails | undefined,
        status: 'NEW',
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating lead:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match TypeScript types
    const transformedLead = {
      id: lead.id,
      type: lead.type,
      listingId: lead.listing_id,
      sellerId: lead.seller_id,
      clientName: lead.client_name,
      clientEmail: lead.client_email,
      clientPhone: lead.client_phone,
      clientCity: lead.client_city,
      message: lead.message,
      exchangeDetails: lead.exchange_details,
      status: lead.status,
      createdAt: new Date(lead.created_at),
    }

    return NextResponse.json({ success: true, lead: transformedLead }, { status: 201 })
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

    const supabase = await createClient()

    let query = supabase
      .from('leads')
      .select(`
        *,
        listing:listings(*),
        seller:sellers(*)
      `)
      .order('created_at', { ascending: false })

    if (sellerId) {
      query = query.eq('seller_id', sellerId)
    }

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error("[v0] Error fetching leads:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match TypeScript types
    const transformedLeads = leads?.map(lead => ({
      id: lead.id,
      type: lead.type,
      listingId: lead.listing_id,
      sellerId: lead.seller_id,
      listing: lead.listing ? {
        id: lead.listing.id,
        title: lead.listing.title,
        model: lead.listing.model,
        capacity: lead.listing.capacity,
        priceCFA: lead.listing.price_cfa,
      } : undefined,
      clientName: lead.client_name,
      clientEmail: lead.client_email,
      clientPhone: lead.client_phone,
      clientCity: lead.client_city,
      message: lead.message,
      exchangeDetails: lead.exchange_details,
      status: lead.status,
      createdAt: new Date(lead.created_at),
    })) || []

    return NextResponse.json({ leads: transformedLeads })
  } catch (error) {
    console.error("[v0] Error fetching leads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
