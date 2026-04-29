import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { userId, shopName, whatsapp, city, address, description, proofPhotos } = body

    // Validate required fields
    if (!shopName || !whatsapp || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: application, error } = await supabase
      .from('seller_applications')
      .insert({
        user_id: userId,
        shop_name: shopName,
        whatsapp,
        city,
        address,
        description,
        proof_photos: proofPhotos || [],
        status: 'PENDING_REVIEW',
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating seller application:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match TypeScript types
    const transformedApplication = {
      id: application.id,
      userId: application.user_id,
      shopName: application.shop_name,
      whatsapp: application.whatsapp,
      city: application.city,
      address: application.address,
      description: application.description,
      proofPhotos: application.proof_photos || [],
      status: application.status,
      createdAt: new Date(application.created_at),
    }

    return NextResponse.json({ success: true, application: transformedApplication }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating seller application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: applications, error } = await supabase
      .from('seller_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("[v0] Error fetching applications:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to match TypeScript types
    const transformedApplications = applications?.map(app => ({
      id: app.id,
      userId: app.user_id,
      shopName: app.shop_name,
      whatsapp: app.whatsapp,
      city: app.city,
      address: app.address,
      description: app.description,
      proofPhotos: app.proof_photos || [],
      status: app.status,
      rejectionReason: app.rejection_reason,
      createdAt: new Date(app.created_at),
      reviewedAt: app.reviewed_at ? new Date(app.reviewed_at) : undefined,
    })) || []

    return NextResponse.json({ applications: transformedApplications })
  } catch (error) {
    console.error("[v0] Error fetching applications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
