import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur d&apos;authentification</h1>
          <p className="text-gray-600 mb-6">
            Une erreur s&apos;est produite lors de la connexion. Veuillez réessayer.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
