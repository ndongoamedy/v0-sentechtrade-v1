import Link from "next/link"
import { Search, RefreshCw, ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { mockListings } from "@/lib/data"
import { isFeatured } from "@/lib/utils"

export default function HomePage() {
  // Featured listings (boosted)
  const featuredListings = mockListings.filter(isFeatured).slice(0, 4)

  // Recent listings
  const recentListings = mockListings
    .filter((l) => l.status === "PUBLISHED")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/iphone-devices-pattern-blue.jpg" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Achetez et échangez votre
              <br />
              iPhone au Sénégal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              La marketplace de confiance pour les iPhone. Vendeurs vérifiés, processus simple, contact direct via
              WhatsApp.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un iPhone..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none"
                />
              </div>
              <Link
                href="/boutique"
                className="px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg whitespace-nowrap text-center"
              >
                Parcourir
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                href="/echanger"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Échanger mon iPhone
              </Link>
              <Link
                href="/seller/apply"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Devenir vendeur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      {featuredListings.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">À la une</h2>
                <p className="text-gray-600 mt-1">Les meilleures offres du moment</p>
              </div>
              <Link href="/boutique" className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
                Voir tout
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="comment-ca-marche" className="bg-gray-50 py-16 md:py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Comment ça marche ?</h2>
            <p className="text-gray-600 text-lg">Achetez ou vendez votre iPhone en toute simplicité</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Parcourez la boutique</h3>
              <p className="text-gray-600 leading-relaxed">
                Explorez notre catalogue d'iPhone vérifiés. Filtrez par modèle, prix, état et ville.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Contactez le vendeur</h3>
              <p className="text-gray-600 leading-relaxed">
                Cliquez sur "Acheter" ou "Échanger" pour contacter directement via WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Finalisez la transaction</h3>
              <p className="text-gray-600 leading-relaxed">
                Rencontrez le vendeur, vérifiez l'appareil et finalisez votre achat en toute sécurité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Annonces récentes</h2>
              <p className="text-gray-600 mt-1">Découvrez les dernières offres disponibles</p>
            </div>
            <Link href="/boutique" className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/boutique"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Voir toutes les annonces
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-16 md:py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Questions fréquentes</h2>
            <p className="text-gray-600 text-lg">Tout ce que vous devez savoir sur SenTechTrade</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Comment puis-je acheter un iPhone ?",
                answer:
                  "Parcourez notre boutique, sélectionnez l'iPhone qui vous intéresse, puis cliquez sur 'Acheter' pour contacter le vendeur directement via WhatsApp.",
              },
              {
                question: "Les vendeurs sont-ils vérifiés ?",
                answer:
                  "Oui, tous nos vendeurs partenaires sont vérifiés par notre équipe. Vous pouvez identifier les vendeurs vérifiés grâce au badge bleu sur leur profil.",
              },
              {
                question: "Comment fonctionne l'échange d'iPhone ?",
                answer:
                  "Remplissez le formulaire d'échange en 4 étapes simples : décrivez votre iPhone actuel, choisissez le modèle souhaité, fournissez vos coordonnées, puis contactez le vendeur via WhatsApp pour finaliser l'échange.",
              },
              {
                question: "Puis-je vendre mon iPhone sur la plateforme ?",
                answer:
                  "Pour vendre sur SenTechTrade, vous devez devenir vendeur partenaire. Cliquez sur 'Devenir vendeur' et remplissez le formulaire de candidature. Notre équipe examinera votre demande.",
              },
              {
                question: "Quels sont les modes de paiement acceptés ?",
                answer:
                  "Les modes de paiement sont convenus directement entre l'acheteur et le vendeur. Nous recommandons les paiements sécurisés comme Wave, Orange Money, ou en espèces lors de la remise en main propre.",
              },
              {
                question: "Que faire en cas de problème avec un vendeur ?",
                answer:
                  "Si vous rencontrez un problème, contactez-nous immédiatement via notre page de contact. Nous prendrons les mesures nécessaires pour résoudre la situation.",
              },
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg border group">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à vendre vos iPhone ?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Rejoignez notre réseau de vendeurs vérifiés et bénéficiez d'une visibilité maximale
          </p>
          <Link
            href="/seller/apply"
            className="inline-block px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg text-lg"
          >
            Devenir vendeur partenaire
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
