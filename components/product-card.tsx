"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, ShoppingCart, CheckCircle2 } from "lucide-react"
import type { Listing } from "@/lib/types"
import { formatPrice, isFeatured } from "@/lib/utils"

interface ProductCardProps {
  listing: Listing
}

export function ProductCard({ listing }: ProductCardProps) {
  const router = useRouter()
  const featured = isFeatured(listing)

  const handleCardClick = () => {
    router.push(`/product/${listing.id}`)
  }

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/product/${listing.id}`
    const message = `Bonjour, je suis intéressé par ${listing.title} (${listing.model} ${listing.capacity}, réf ${listing.id}) à ${listing.priceCFA.toLocaleString()} CFA.\n\nLien: ${productUrl}\n\nEst-il disponible ?`
    const whatsappUrl = `https://wa.me/${listing.seller?.whatsapp?.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleExchange = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/echanger?listing=${listing.id}`
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative bg-gray-50">
        <img
          src={listing.photos[0] || "/placeholder.svg?height=300&width=300&query=iPhone"}
          alt={listing.title}
          className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            Boosté
          </div>
        )}
        {listing.allowExchange && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Échange possible
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {listing.model} • {listing.capacity}
        </p>

        <div className="text-2xl font-bold text-blue-600 mb-3">
          {formatPrice(listing.priceCFA)} <span className="text-sm">CFA</span>
        </div>

        <Link
          href={`/seller/${listing.seller?.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 mb-3 pb-3 border-b hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {listing.seller?.shopName.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{listing.seller?.shopName}</div>
            <div className="flex items-center gap-1">
              {listing.seller?.verified && <span className="text-xs text-orange-600 font-medium">Vérifié</span>}
            </div>
          </div>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{listing.city}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleBuy}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Acheter
          </button>
          <button
            onClick={handleExchange}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors"
          >
            Échanger
          </button>
        </div>
      </div>
    </div>
  )
}
