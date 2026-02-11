import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { userId, shopName, whatsapp, city, address, description, proofPhotos } = body

    // Validate required fields
    if (!shopName || !whatsapp || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to database
    const application = {
      id: `app-${Date.now()}`,
      userId: userId || `user-${Date.now()}`,
      shopName,
      whatsapp,
      city,
      address,
      description,
      proofPhotos: proofPhotos || [],
      status: "PENDING_REVIEW",
      createdAt: new Date(),
    }

    console.log("[v0] Seller application created:", application)

    // In a real app, you might also:
    // - Send notification to admin
    // - Send confirmation email to applicant

    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating seller application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // In a real app, this would query the database
    // For now, return mock data
    const mockApplications = [
      {
        id: "1",
        shopName: "Tech Store Dakar",
        whatsapp: "+221 77 999 88 77",
        city: "Dakar",
        status: "PENDING_REVIEW",
        createdAt: new Date("2025-01-28"),
      },
    ]

    return NextResponse.json({ applications: mockApplications })
  } catch (error) {
    console.error("[v0] Error fetching applications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
