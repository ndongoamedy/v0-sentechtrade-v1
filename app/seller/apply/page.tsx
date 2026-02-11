"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Store, CheckCircle2 } from "lucide-react"
import { cities } from "@/lib/data"

export default function SellerApplyPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)

  const [shopName, setShopName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [acceptRules, setAcceptRules] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would call an API to create a SellerApplication
    console.log("[v0] Seller application submitted:", {
      shopName,
      whatsapp,
      city,
      address,
      description,
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidature envoyée !</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Merci pour votre candidature. Notre équipe va examiner votre demande et vous contactera sous 48 heures.
              Vous recevrez un email de confirmation à l'adresse indiquée.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Devenir vendeur partenaire</h1>
          <p className="text-gray-600">Rejoignez notre réseau de vendeurs vérifiés</p>
        </div>

        <div className="bg-white rounded-2xl border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                placeholder="Ex: Digital World"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Numéro WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="+221 77 XXX XX XX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Ce numéro sera utilisé pour les contacts clients</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ville <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Adresse - Optionnel</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Plateau, Avenue Léopold Sédar Senghor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description de votre activité</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Parlez-nous de votre boutique, votre expérience, vos spécialités..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Avantages vendeur partenaire</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✓ Badge "Vendeur vérifié"</li>
                <li>✓ Visibilité maximale sur la plateforme</li>
                <li>✓ Gestion simple de vos annonces</li>
                <li>✓ Statistiques et suivi des leads</li>
                <li>✓ Options de mise en avant (Boost)</li>
              </ul>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="accept"
                checked={acceptRules}
                onChange={(e) => setAcceptRules(e.target.checked)}
                required
                className="w-5 h-5 text-blue-600 rounded mt-0.5"
              />
              <label htmlFor="accept" className="text-sm text-gray-700 cursor-pointer">
                J'accepte les conditions d'utilisation et m'engage à fournir des informations exactes et à respecter les
                règles de la plateforme
              </label>
            </div>

            <button
              type="submit"
              disabled={!acceptRules}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
            >
              Soumettre ma candidature
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
