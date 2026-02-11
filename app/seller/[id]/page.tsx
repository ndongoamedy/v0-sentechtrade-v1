import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Star, Phone, CheckCircle2, Store } from "lucide-react"
import { mockListings, mockSellers } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const seller = mockSellers.find((s) => s.id === id)
  const sellerListings = mockListings.filter((l) => l.seller?.id === id)

  if (!seller) {
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
                    Vérifié
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{seller.rating}</span>
                  <span className="text-sm">({Math.floor(Math.random() * 100) + 20} avis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{seller.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  <span>{sellerListings.length} annonces</span>
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

          {sellerListings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerListings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <p className="text-gray-600">Ce vendeur n'a pas encore d'annonces actives.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
