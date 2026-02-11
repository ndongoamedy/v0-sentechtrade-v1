"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, updateUser } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)
    setName(currentUser.name)
    setEmail(currentUser.email)
    setPhone(currentUser.phone || "")
    setCity(currentUser.city || "")
    setLoading(false)
  }, [router])

  const handleSave = () => {
    if (!user) return

    // Validate password change if provided
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas")
        return
      }
      if (newPassword.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères")
        return
      }
    }

    const updatedUser: User = {
      ...user,
      name,
      email,
      phone,
      city,
    }

    updateUser(updatedUser, newPassword || undefined)
    alert("Profil mis à jour avec succès")
    router.push("/profile")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">Chargement...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au profil
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier mon profil</h1>

        <div className="bg-white rounded-2xl border p-6 md:p-8 space-y-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations personnelles</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 XXX XX XX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Dakar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
            <p className="text-sm text-gray-600 mb-4">
              Laissez vide si vous ne souhaitez pas changer votre mot de passe
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
