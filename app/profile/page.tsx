"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Edit, Heart, ShoppingBag, LogOut } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, logout } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      // Redirect to login if not authenticated
      router.push("/auth/login")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    window.dispatchEvent(new Event("auth-change"))
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">Chargement...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

        <div className="grid gap-6">
          {/* Profile Info Card */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">
                    {user.role === "CLIENT" ? "Client" : user.role === "SELLER" ? "Vendeur" : "Administrateur"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/profile/edit"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{user.city}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/profile/favorites"
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mes Favoris</h3>
                  <p className="text-sm text-gray-600">Annonces sauvegardées</p>
                </div>
              </div>
            </Link>

            <Link
              href="/profile/exchanges"
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mes Demandes</h3>
                  <p className="text-sm text-gray-600">Achats et échanges</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Become Seller CTA */}
          {user.role === "CLIENT" && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Devenez vendeur partenaire</h3>
              <p className="text-blue-100 mb-6">
                Rejoignez notre réseau de vendeurs vérifiés et bénéficiez d'une visibilité maximale
              </p>
              <Link
                href="/seller/apply"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Postuler maintenant
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
