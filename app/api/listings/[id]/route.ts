import { NextResponse } from "next/server"
import { mockListings } from "@/lib/data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const listing = mockListings.find((l) => l.id === id)

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error("[v0] Error fetching listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // In a real app, this would update the database
    console.log("[v0] Listing updated:", id, body)

    return NextResponse.json({ success: true, id, updates: body })
  } catch (error) {
    console.error("[v0] Error updating listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // In a real app, this would delete from database
    console.log("[v0] Listing deleted:", id)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("[v0] Error deleting listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
