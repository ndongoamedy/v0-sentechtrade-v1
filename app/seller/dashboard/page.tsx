"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, MessageSquare, TrendingUp, Plus, LogOut, Pencil, Trash2, Bolt as Boost } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { boostPacks } from "@/lib/data"
import { formatPrice, formatDate } from "@/lib/utils"
import { logout, getCurrentUser, initializeAuth } from "@/lib/auth"
import { buildWhatsAppLink } from "@/lib/whatsapp"
import { createClient } from "@/lib/supabase/client"
import type { Listing, Lead, User, Seller } from "@/lib/types"
import useSWR from "swr"

export default function SellerDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"listings" | "leads" | "boost">("listings")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize auth and get seller data
  useEffect(() => {
    const init = async () => {
      const session = await initializeAuth()
      if (!session || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
        router.push("/auth/login")
        return
      }
      setCurrentUser(session.user)

      // Get seller profile
      const supabase = createClient()
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (sellerData) {
        setSeller({
          id: sellerData.id,
          userId: sellerData.user_id,
          shopName: sellerData.shop_name,
          city: sellerData.city,
          whatsapp: sellerData.whatsapp,
          logo: sellerData.logo,
          description: sellerData.description,
          verified: sellerData.verified,
          rating: sellerData.rating,
          createdAt: new Date(sellerData.created_at),
        })
      }

      setIsInitialized(true)
    }

    init()
  }, [router])

  // Fetch listings for this seller
  const { data: listingsData, mutate: mutateListings } = useSWR<{ listings: Listing[] }>(
    seller ? `/api/listings?sellerId=${seller.id}` : null,
    (url) => fetch(url).then(res => res.json())
  )

  // Fetch leads for this seller
  const { data: leadsData, mutate: mutateLeads } = useSWR<{ leads: Lead[] }>(
    seller ? `/api/leads?sellerId=${seller.id}` : null,
    (url) => fetch(url).then(res => res.json())
  )

  const sellerListings = listingsData?.listings || []
  const sellerLeads = leadsData?.leads || []

  const handleLogout = async () => {
    logout()
    router.push("/")
  }

  const handleEditListing = (listingId: string) => {
    router.push(`/seller/listings/${listingId}/edit`)
  }

  const handleDeleteListing = async (listingId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" })
      if (res.ok) {
        mutateListings()
        alert("Annonce supprimée avec succès")
      } else {
        alert("Erreur lors de la suppression")
      }
    }
  }

  const handleBoostListing = (listingId: string) => {
    setActiveTab("boost")
  }

  const handleContactClient = (lead: any) => {
    const listingTitle = lead.listing?.title || "votre annonce"
    const message = `Bonjour ${lead.clientName}, merci pour votre intérêt pour ${listingTitle}. Je suis disponible pour discuter.`
    const whatsappUrl = buildWhatsAppLink(lead.clientPhone, message)
    window.open(whatsappUrl, "_blank")
  }

  const handleMarkLeadAsDone = async (leadId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('leads')
      .update({ status: 'CLOSED' })
      .eq('id', leadId)

    if (!error) {
      mutateLeads()
      alert("Lead marqué comme traité")
    }
  }

  const handleBuyBoostPack = (packId: string) => {
    const pack = boostPacks.find((p) => p.id === packId)
    if (!pack) return

    if (confirm(`Acheter le pack ${pack.name} pour ${formatPrice(pack.priceCFA)} CFA ?`)) {
      alert("Pack acheté avec succès ! Vous pouvez maintenant booster vos annonces.")
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord vendeur</h1>
            <p className="text-gray-600">
              {seller?.shopName ? `Bienvenue, ${seller.shopName}` : "Gérez vos annonces et suivez vos leads"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{sellerListings.length}</div>
                <div className="text-sm text-gray-600">Annonces actives</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{sellerLeads.length}</div>
                <div className="text-sm text-gray-600">Leads ce mois</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{seller?.rating?.toFixed(1) || "N/A"}</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "listings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mes annonces
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "leads"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab("boost")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "boost"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Boost
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Mes annonces</h2>
                  <Link
                    href="/seller/listings/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle annonce
                  </Link>
                </div>

                {sellerListings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Vous n&apos;avez pas encore d&apos;annonces</p>
                    <Link href="/seller/listings/new" className="text-blue-600 hover:underline mt-2 inline-block">
                      Créer votre première annonce
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sellerListings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          <img
                            src={listing.photos[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {listing.model} - {listing.capacity}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">{formatPrice(listing.priceCFA)} CFA</div>
                                {listing.featuredUntil && new Date(listing.featuredUntil) > new Date() && (
                                  <span className="text-xs text-orange-600 font-medium">Boosté</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Publié le {formatDate(new Date(listing.createdAt))}</span>
                              <span>-</span>
                              <span>{listing.city}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEditListing(listing.id)}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                              >
                                <Pencil className="w-3 h-3" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleBoostListing(listing.id)}
                                className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 flex items-center gap-1"
                              >
                                <Boost className="w-3 h-3" />
                                Booster
                              </button>
                              <button
                                onClick={() => handleDeleteListing(listing.id)}
                                className="px-3 py-1.5 border border-red-300 text-red-700 rounded text-sm font-medium hover:bg-red-50 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === "leads" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Demandes de contact</h2>
                {sellerLeads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun lead pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sellerLeads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  lead.type === "BUY" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                }`}
                              >
                                {lead.type === "BUY" ? "Achat" : "Échange"}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  lead.status === "NEW" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {lead.status === "NEW" ? "Nouveau" : lead.status === "REPLIED" ? "Répondu" : "Traité"}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{lead.clientName}</h3>
                            <p className="text-sm text-gray-600">{lead.clientPhone}</p>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(new Date(lead.createdAt))}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Intéressé par : {lead.listing?.title || "Annonce"}
                        </p>
                        {lead.message && (
                          <p className="text-sm text-gray-600 mb-3 italic">&quot;{lead.message}&quot;</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleContactClient(lead)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                          >
                            Contacter via WhatsApp
                          </button>
                          {lead.status !== "CLOSED" && (
                            <button
                              onClick={() => handleMarkLeadAsDone(lead.id)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                              Marquer comme traité
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Boost Tab */}
            {activeTab === "boost" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Booster vos annonces</h2>
                <p className="text-gray-600 mb-6">Augmentez la visibilité de vos annonces en les mettant en avant</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {boostPacks.map((pack) => (
                    <div key={pack.id} className="border rounded-xl p-6 hover:border-blue-500 transition-colors">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-4">
                        {formatPrice(pack.priceCFA)} <span className="text-lg">CFA</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">{pack.description}</p>
                      <button
                        onClick={() => handleBuyBoostPack(pack.id)}
                        className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Acheter
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
