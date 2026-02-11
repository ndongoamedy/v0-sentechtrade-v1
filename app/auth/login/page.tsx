"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { login, register } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (authMode === "login") {
      // Login
      const result = login(email, password)

      if (result.success && result.session) {
        console.log("[v0] Login successful, redirecting...")
        // Dispatch custom event to update header
        window.dispatchEvent(new Event("auth-change"))

        // Redirect based on role
        const user = result.session.user
        if (user.role === "ADMIN") {
          router.push("/admin")
        } else if (user.role === "SELLER") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
      } else {
        setError(result.error || "Erreur de connexion")
        setLoading(false)
      }
    } else {
      // Register
      if (!name || !phone) {
        setError("Veuillez remplir tous les champs")
        setLoading(false)
        return
      }

      const result = register({
        email,
        password,
        name,
        phone,
        isSeller,
      })

      if (result.success && result.session) {
        console.log("[v0] Registration successful, redirecting...")
        // Dispatch custom event to update header
        window.dispatchEvent(new Event("auth-change"))

        // If seller, redirect to application
        if (isSeller) {
          router.push("/seller/apply")
        } else {
          router.push("/")
        }
      } else {
        setError(result.error || "Erreur d'inscription")
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue</h1>
            <p className="text-gray-600">Connectez-vous ou créez un compte pour continuer</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setAuthMode("login")
                setError("")
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                authMode === "login" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setAuthMode("register")
                setError("")
              }}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                authMode === "register" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              Inscription
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {authMode === "login" && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs">
              <p className="font-bold text-blue-900 mb-2">🔑 Comptes de test disponibles :</p>

              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-blue-800">👤 Client :</p>
                  <p className="text-blue-700 ml-2">client@test.com / client2025</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-800">🏪 Vendeurs :</p>
                  <div className="ml-2 space-y-1 text-blue-700">
                    <p>• afcoms@sentech.sn / afcoms2025</p>
                    <p>• malick@sentech.sn / malick2025</p>
                    <p>• diwane@sentech.sn / diwane2025</p>
                    <p>• senstore@sentech.sn / senstore2025</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-blue-800">👨‍💼 Admin :</p>
                  <p className="text-blue-700 ml-2">admin@sentech.sn / admin2025</p>
                </div>

                <p className="text-blue-600 text-[10px] mt-2 italic">
                  💡 Visiteur : Pas besoin de connexion pour naviguer sur le site
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={authMode === "register"}
                  placeholder="Amadou Diop"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {authMode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={authMode === "register"}
                  placeholder="+221 77 123 45 67"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {authMode === "register" && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  type="checkbox"
                  id="seller"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded mt-0.5"
                />
                <label htmlFor="seller" className="text-sm font-medium cursor-pointer text-gray-900">
                  Je souhaite m'inscrire en tant que vendeur
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : authMode === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          {authMode === "login" && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Pas encore de compte ?{" "}
              <button onClick={() => setAuthMode("register")} className="text-blue-600 hover:text-blue-700 font-medium">
                S'inscrire
              </button>
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
