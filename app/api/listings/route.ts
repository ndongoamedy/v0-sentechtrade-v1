import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")
    const city = searchParams.get("city")
    const model = searchParams.get("model")

    const supabase = await createClient()

    let query = supabase
      .from('listings')
      .select(`
        *,
        seller:sellers(*)
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })

    if (sellerId) {
      query = query.eq('seller_id', sellerId)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (model) {
      query = query.eq('model', model)
    }

    const { data: listings, error } = await query

    if (error) {
      console.error("[v0] Error fetching listings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform database fields to match TypeScript types
    const transformedListings = listings?.map(listing => ({
      id: listing.id,
      sellerId: listing.seller_id,
      seller: listing.seller ? {
        id: listing.seller.id,
        userId: listing.seller.user_id,
        shopName: listing.seller.shop_name,
        city: listing.seller.city,
        whatsapp: listing.seller.whatsapp,
        logo: listing.seller.logo,
        description: listing.seller.description,
        verified: listing.seller.verified,
        rating: listing.seller.rating,
        createdAt: new Date(listing.seller.created_at),
      } : undefined,
      title: listing.title,
      model: listing.model,
      capacity: listing.capacity,
      color: listing.color,
      condition: listing.condition,
      priceCFA: listing.price_cfa,
      city: listing.city,
      photos: listing.photos || [],
      description: listing.description,
      allowExchange: listing.allow_exchange,
      featuredUntil: listing.featured_until ? new Date(listing.featured_until) : undefined,
      status: listing.status,
      createdAt: new Date(listing.created_at),
      updatedAt: new Date(listing.updated_at),
    })) || []

    return NextResponse.json({ listings: transformedListings })
  } catch (error) {
    console.error("[v0] Error fetching listings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { sellerId, title, model, capacity, color, condition, priceCFA, city, photos, description, allowExchange } = body

    // Validate required fields
    if (!sellerId || !title || !model || !capacity || !condition || !priceCFA || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        seller_id: sellerId,
        title,
        model,
        capacity,
        color: color || 'Autre',
        condition,
        price_cfa: priceCFA,
        city,
        photos: photos || [],
        description,
        allow_exchange: allowExchange ?? true,
        status: 'PUBLISHED',
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating listing:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match TypeScript types
    const transformedListing = {
      id: listing.id,
      sellerId: listing.seller_id,
      title: listing.title,
      model: listing.model,
      capacity: listing.capacity,
      color: listing.color,
      condition: listing.condition,
      priceCFA: listing.price_cfa,
      city: listing.city,
      photos: listing.photos || [],
      description: listing.description,
      allowExchange: listing.allow_exchange,
      status: listing.status,
      createdAt: new Date(listing.created_at),
      updatedAt: new Date(listing.updated_at),
    }

    return NextResponse.json({ success: true, listing: transformedListing }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
