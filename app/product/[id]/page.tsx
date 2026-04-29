"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatWidgetProvider } from "@/components/chat-widget-provider"
import { MapPin, Star, Phone, CheckCircle2, ArrowLeft } from "lucide-react"
import { mockListings, mockSellers } from "@/lib/data"
import { formatPrice, formatDate } from "@/lib/utils"
import { buildWhatsAppLink } from "@/lib/whatsapp"
import { createClient } from "@/lib/supabase/server"

async function getListing(id: string) {
  try {
    const supabase = await createClient()
    const { data: listing, error } = await supabase
      .from("listings")
      .select(`
        *,
        seller:sellers(*)
      `)
      .eq("id", id)
      .single()
    
    if (error || !listing) {
      // Fallback to mock data
      const mockListing = mockListings.find((l) => l.id === id)
      if (mockListing) {
        const seller = mockSellers.find(s => s.id === mockListing.sellerId)
        return { ...mockListing, seller }
      }
      return null
    }
    
    return {
      ...listing,
      priceCFA: listing.price_cfa,
      allowExchange: listing.allow_exchange,
      createdAt: new Date(listing.created_at),
      seller: listing.seller ? {
        ...listing.seller,
        shopName: listing.seller.shop_name,
      } : null
    }
  } catch {
    // Fallback to mock data
    const mockListing = mockListings.find((l) => l.id === id)
    if (mockListing) {
      const seller = mockSellers.find(s => s.id === mockListing.sellerId)
      return { ...mockListing, seller }
    }
    return null
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const listing = await getListing(id)

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Annonce introuvable</h1>
          <Link href="/boutique" className="text-blue-600 hover:text-blue-700 font-medium">
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return <ProductDetailClient listing={listing} />
}

function ProductDetailClient({ listing }: { listing: (typeof mockListings)[0] }) {
  const searchParams = useSearchParams()
  const action = searchParams.get("action")

  const handleBuy = () => {
    const productUrl = `${window.location.origin}/product/${listing.id}`
    const message = `Bonjour, je suis intéressé par ${listing.title} (${listing.model} ${listing.capacity}, réf ${listing.id}) à ${listing.priceCFA.toLocaleString()} CFA.\n\nLien: ${productUrl}\n\nEst-il disponible ?`
    const whatsappUrl = buildWhatsAppLink(listing.seller?.whatsapp || "", message)
    window.open(whatsappUrl, "_blank")
  }

  const handleExchange = () => {
    window.location.href = `/echanger?listing=${listing.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden border">
              <img
                src={listing.photos[0] || "/placeholder.svg?height=600&width=600&query=iPhone"}
                alt={listing.title}
                className="w-full aspect-square object-cover"
              />
            </div>
            {listing.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {listing.photos.slice(1, 5).map((photo, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden border aspect-square">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`${listing.title} ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-2xl border p-6 lg:p-8">
              {/* Title and verification */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                {listing.seller?.verified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    Vérifié
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{listing.city}</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatPrice(listing.priceCFA)} <span className="text-xl">CFA</span>
                </div>
                {listing.allowExchange && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Échange possible
                  </div>
                )}
              </div>

              {/* Characteristics */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Modèle</div>
                    <div className="font-semibold text-gray-900">{listing.model}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Capacité</div>
                    <div className="font-semibold text-gray-900">{listing.capacity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Couleur</div>
                    <div className="font-semibold text-gray-900">{listing.color}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">État</div>
                    <div className="font-semibold text-gray-900">{listing.condition}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                </div>
              )}

              {/* Seller info */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Vendeur</h2>
                <Link
                  href={`/seller/${listing.seller?.id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {listing.seller?.shopName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{listing.seller?.shopName}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{listing.seller?.rating}</span>
                      </div>
                      {listing.seller?.verified && (
                        <>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="text-orange-600 font-medium">Vendeur professionnel</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
                {listing.seller?.description && (
                  <p className="text-sm text-gray-600 mt-3 ml-15">{listing.seller.description}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuy}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  Acheter via WhatsApp
                </button>
                {listing.allowExchange && (
                  <button
                    onClick={handleExchange}
                    className="w-full px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg"
                  >
                    Échanger mon iPhone
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">Publié le {formatDate(listing.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat widget with product context */}
      <ChatWidgetProvider
        contextListingId={listing.id}
        contextModel={listing.model}
        contextCapacity={listing.capacity}
        contextPrice={listing.priceCFA}
        contextSellerId={listing.sellerId}
        contextSellerPhone={listing.seller?.whatsapp}
        contextListingTitle={listing.title}
      />

      <Footer />
    </div>
  )
}
