"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Key, User, Shield, Eye } from "lucide-react"

export default function CredentialsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès de Test</h1>
          <p className="text-gray-600">Identifiants pour tester l'application</p>
        </div>

        <div className="space-y-6">
          {/* Admin */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Administrateur</h2>
                <p className="text-sm text-gray-600">Accès complet à la plateforme</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-mono font-semibold">admin@sentech.sn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mot de passe:</span>
                <span className="font-mono font-semibold">admin2025</span>
              </div>
            </div>
          </div>

          {/* Sellers */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Vendeurs</h2>
                <p className="text-sm text-gray-600">Gérer les annonces et les demandes</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* AfComs */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">AfComs</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono font-semibold">afcoms@sentech.sn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mot de passe:</span>
                    <span className="font-mono font-semibold">afcoms2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-semibold">+221 77 876 01 23</span>
                  </div>
                </div>
              </div>

              {/* Malick Commerce */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Malick Commerce & services</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono font-semibold">malick@sentech.sn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mot de passe:</span>
                    <span className="font-mono font-semibold">malick2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-semibold">+221 78 361 48 59</span>
                  </div>
                </div>
              </div>

              {/* Diwane Apple */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Diwane Apple</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono font-semibold">diwane@sentech.sn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mot de passe:</span>
                    <span className="font-mono font-semibold">diwane2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-semibold">+221775723147</span>
                  </div>
                </div>
              </div>

              {/* Sen Store Phone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Sen Store Phone</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono font-semibold">senstore@sentech.sn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mot de passe:</span>
                    <span className="font-mono font-semibold">senstore2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-semibold">+221778464833</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Visiteur</h2>
                <p className="text-sm text-gray-600">Aucune connexion requise</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                Les visiteurs peuvent naviguer sur le site, voir les annonces et faire des demandes d'échange sans créer
                de compte. Aucun identifiant nécessaire.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
