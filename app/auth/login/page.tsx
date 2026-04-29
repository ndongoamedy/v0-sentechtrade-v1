"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loginAsync, registerAsync } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSeller, setIsSeller] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (authMode === "login") {
        // Login
        const result = await loginAsync(email, password)

        if (result.success && result.session) {
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

        const result = await registerAsync({
          email,
          password,
          name,
          phone,
          isSeller,
        })

        if (result.success) {
          if (result.session) {
            // Dispatch custom event to update header
            window.dispatchEvent(new Event("auth-change"))

            // If seller, redirect to application
            if (isSeller) {
              router.push("/seller/apply")
            } else {
              router.push("/")
            }
          } else {
            // Email confirmation required
            setSuccess(result.error || "Veuillez vérifier votre email pour confirmer votre compte")
            setLoading(false)
          }
        } else {
          setError(result.error || "Erreur d'inscription")
          setLoading(false)
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite")
      setLoading(false)
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
                setSuccess("")
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
                setSuccess("")
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

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{success}</div>
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
                placeholder="********"
                minLength={6}
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
                  Je souhaite m&apos;inscrire en tant que vendeur
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
                S&apos;inscrire
              </button>
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
