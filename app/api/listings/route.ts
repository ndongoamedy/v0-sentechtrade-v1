import { NextResponse } from "next/server"
import { mockListings } from "@/lib/data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")
    const city = searchParams.get("city")
    const model = searchParams.get("model")

    let filteredListings = mockListings.filter((l) => l.status === "PUBLISHED")

    if (sellerId) {
      filteredListings = filteredListings.filter((l) => l.sellerId === sellerId)
    }

    if (city) {
      filteredListings = filteredListings.filter((l) => l.city === city)
    }

    if (model) {
      filteredListings = filteredListings.filter((l) => l.model === model)
    }

    return NextResponse.json({ listings: filteredListings })
  } catch (error) {
    console.error("[v0] Error fetching listings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { sellerId, title, model, capacity, color, condition, priceCFA, city, photos } = body

    if (!sellerId || !title || !model || !capacity || !condition || !priceCFA || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to database
    const listing = {
      id: `listing-${Date.now()}`,
      ...body,
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("[v0] Listing created:", listing)

    return NextResponse.json({ success: true, listing }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
