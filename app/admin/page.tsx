"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Package, MessageSquare, AlertCircle, LogOut, Check, X, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockListings } from "@/lib/data"
import { formatPrice, formatDate } from "@/lib/utils"
import { logout, getCurrentUser } from "@/lib/auth"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"applications" | "listings" | "leads">("applications")
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      router.push("/auth/login")
      return
    }
    setCurrentUser(user)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleApproveApplication = (appId: string) => {
    if (confirm("Approuver cette candidature vendeur ?")) {
      // In real app, call API to approve
      console.log("[v0] Approve application:", appId)
      alert("Candidature approuvée ! Le vendeur peut maintenant créer des annonces.")
      router.refresh()
    }
  }

  const handleRejectApplication = (appId: string) => {
    const reason = prompt("Raison du rejet (optionnel) :")
    if (reason !== null) {
      // In real app, call API to reject
      console.log("[v0] Reject application:", appId, reason)
      alert("Candidature rejetée.")
      router.refresh()
    }
  }

  const handleViewApplicationDetails = (appId: string) => {
    // In real app, open modal or navigate to details page
    console.log("[v0] View application details:", appId)
    alert("Détails de la candidature (à implémenter)")
  }

  const handleSuspendListing = (listingId: string) => {
    if (confirm("Suspendre cette annonce ?")) {
      // In real app, call API to suspend
      console.log("[v0] Suspend listing:", listingId)
      alert("Annonce suspendue.")
      router.refresh()
    }
  }

  const handleViewListing = (listingId: string) => {
    router.push(`/product/${listingId}`)
  }

  // Mock data
  const applications = [
    {
      id: "1",
      shopName: "Tech Store Dakar",
      whatsapp: "+221 77 999 88 77",
      city: "Dakar",
      status: "PENDING_REVIEW",
      createdAt: new Date("2025-01-28"),
    },
    {
      id: "2",
      shopName: "Mobile Plus",
      whatsapp: "+221 77 888 77 66",
      city: "Thiès",
      status: "PENDING_REVIEW",
      createdAt: new Date("2025-01-27"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
            <p className="text-gray-600">Gérez la plateforme SenTechTrade</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4</div>
                <div className="text-sm text-gray-600">Vendeurs actifs</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mockListings.length}</div>
                <div className="text-sm text-gray-600">Annonces publiées</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-600">Leads ce mois</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "applications"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Candidatures vendeurs
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "listings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annonces
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
            </div>
          </div>

          <div className="p-6">
            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Candidatures en attente</h2>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{app.shopName}</h3>
                          <p className="text-sm text-gray-600">{app.city}</p>
                          <p className="text-sm text-gray-600">{app.whatsapp}</p>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(app.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Rejeter
                        </button>
                        <button
                          onClick={() => handleViewApplicationDetails(app.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                        >
                          <Info className="w-4 h-4" />
                          Plus d'infos
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Toutes les annonces</h2>
                <div className="space-y-4">
                  {mockListings.slice(0, 5).map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={listing.photos[0] || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                              <p className="text-sm text-gray-600">{listing.seller?.shopName}</p>
                              <p className="text-sm text-gray-600">{formatDate(listing.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">{formatPrice(listing.priceCFA)} CFA</div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  listing.status === "PUBLISHED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {listing.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleViewListing(listing.id)}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
                            >
                              Voir
                            </button>
                            <button
                              onClick={() => handleSuspendListing(listing.id)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                            >
                              Suspendre
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === "leads" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tous les leads</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vendeur</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{formatDate(new Date())}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              {i % 2 === 0 ? "Achat" : "Échange"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">Client {i}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Digital World</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                              Répondu
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
