import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Users, Smartphone, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">À propos de SenTechTrade</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            La marketplace #1 pour acheter et échanger des iPhones au Sénégal
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            SenTechTrade a été créé pour simplifier l'achat et l'échange d'iPhones au Sénégal. Nous connectons les
            acheteurs avec des vendeurs vérifiés et de confiance, offrant une expérience sécurisée et transparente pour
            tous.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Notre plateforme facilite les transactions en permettant un contact direct via WhatsApp, éliminant les
            intermédiaires inutiles et garantissant des prix justes pour tous.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vendeurs Vérifiés</h3>
            <p className="text-gray-600 leading-relaxed">
              Tous nos vendeurs partenaires sont soigneusement vérifiés pour garantir la qualité et la fiabilité de
              leurs services.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Communauté Active</h3>
            <p className="text-gray-600 leading-relaxed">
              Rejoignez une communauté grandissante d'acheteurs et vendeurs d'iPhones à travers tout le Sénégal.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Large Sélection</h3>
            <p className="text-gray-600 leading-relaxed">
              Accédez à un catalogue complet d'iPhones de tous modèles, capacités et états, à des prix compétitifs.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processus Simple</h3>
            <p className="text-gray-600 leading-relaxed">
              Achetez ou échangez votre iPhone en quelques clics grâce à notre processus simplifié et notre intégration
              WhatsApp.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-blue-100 mb-6 text-lg">Une question ? Notre équipe est là pour vous aider.</p>
          <div className="space-y-3 text-lg">
            <p>
              <strong>Email:</strong> ndongoamedy@gmail.com
            </p>
            <p>
              <strong>Téléphone:</strong> +221 77 751 55 63
            </p>
            <p>
              <strong>Adresse:</strong> Dakar, Sénégal
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
