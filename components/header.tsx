"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated())
      setCurrentUser(getCurrentUser())
    }

    checkAuth()

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", checkAuth)
    // Listen for custom auth events
    window.addEventListener("auth-change", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("auth-change", checkAuth)
    }
  }, [])

  const handleUserIconClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoggedIn && currentUser) {
      // Route based on user role
      if (currentUser.role === "ADMIN") {
        router.push("/admin")
      } else if (currentUser.role === "SELLER") {
        router.push("/seller/dashboard")
      } else {
        router.push("/profile")
      }
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/sentech-trade-logo.png" alt="SenTech Trade" className="h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Accueil
            </Link>
            <Link href="/boutique" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Boutique
            </Link>
            <Link href="/a-propos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              À propos
            </Link>
            <a href="/#comment-ca-marche" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Comment ça marche
            </a>
            <a href="/#faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/echanger"
              className="hidden lg:block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Demander une échange
            </Link>

            <button
              onClick={handleUserIconClick}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              title={isLoggedIn ? "Mon profil" : "Se connecter"}
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden mt-4 pt-4 border-t">
            <nav className="space-y-3">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/boutique"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-colors"
              >
                Boutique
              </Link>
              <Link
                href="/a-propos"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-colors"
              >
                À propos
              </Link>
              <a
                href="/#comment-ca-marche"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-colors"
              >
                Comment ça marche
              </a>
              <a
                href="/#faq"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/echanger"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Demander une échange
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
