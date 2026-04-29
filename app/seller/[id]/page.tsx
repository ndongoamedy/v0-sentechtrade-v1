import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Star, Phone, CheckCircle2, Store } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

async function getSellerWithListings(id: string) {
  try {
    const supabase = await createClient()
    
    // Get seller
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single()
    
    if (sellerError || !seller) {
      return null
    }
    
    // Get seller listings
    const { data: listings, error: listingsError } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", id)
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false })
    
    const transformedSeller = {
      id: seller.id,
      userId: seller.user_id,
      shopName: seller.shop_name,
      whatsapp: seller.whatsapp,
      city: seller.city,
      logo: seller.logo,
      description: seller.description,
      verified: seller.verified,
      rating: seller.rating,
      createdAt: new Date(seller.created_at),
    }
    
    const transformedListings = (listings || []).map(listing => ({
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
      featuredUntil: listing.featured_until ? new Date(listing.featured_until) : undefined,
      createdAt: new Date(listing.created_at),
      updatedAt: new Date(listing.updated_at),
      seller: transformedSeller,
    }))
    
    return {
      seller: transformedSeller,
      listings: transformedListings,
    }
  } catch (e) {
    console.error("[Supabase] Error fetching seller:", e)
    return null
  }
}

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await getSellerWithListings(id)

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendeur introuvable</h1>
          <Link href="/boutique" className="text-blue-600 hover:text-blue-700 font-medium">
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const { seller, listings } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Seller Header */}
        <div className="bg-white rounded-2xl border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {seller.shopName.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{seller.shopName}</h1>
                {seller.verified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Verifie
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                {seller.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{seller.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{seller.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  <span>{listings.length} annonces</span>
                </div>
              </div>

              {seller.description && <p className="text-gray-700 leading-relaxed mb-4">{seller.description}</p>}

              <a
                href={`https://wa.me/${seller.whatsapp?.replace(/[^0-9+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Seller Listings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Annonces de {seller.shopName}</h2>

          {listings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <p className="text-gray-600">Ce vendeur n&apos;a pas encore d&apos;annonces actives.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
