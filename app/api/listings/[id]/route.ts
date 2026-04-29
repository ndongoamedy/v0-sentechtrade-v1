import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:sellers(*)
      `)
      .eq('id', id)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Transform to match TypeScript types
    const transformedListing = {
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
    }

    return NextResponse.json({ listing: transformedListing })
  } catch (error) {
    console.error("[v0] Error fetching listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    // Transform camelCase to snake_case for database
    const updates: Record<string, any> = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.model !== undefined) updates.model = body.model
    if (body.capacity !== undefined) updates.capacity = body.capacity
    if (body.color !== undefined) updates.color = body.color
    if (body.condition !== undefined) updates.condition = body.condition
    if (body.priceCFA !== undefined) updates.price_cfa = body.priceCFA
    if (body.city !== undefined) updates.city = body.city
    if (body.photos !== undefined) updates.photos = body.photos
    if (body.description !== undefined) updates.description = body.description
    if (body.allowExchange !== undefined) updates.allow_exchange = body.allowExchange
    if (body.status !== undefined) updates.status = body.status
    updates.updated_at = new Date().toISOString()

    const { data: listing, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating listing:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error("[v0] Error updating listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("[v0] Error deleting listing:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("[v0] Error deleting listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
