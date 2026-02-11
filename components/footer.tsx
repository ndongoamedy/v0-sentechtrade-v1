import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/sentech-trade-logo.png" alt="SenTech Trade" className="h-8 w-auto" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              La marketplace #1 pour acheter et échanger des iPhones au Sénégal
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-gray-900">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/boutique" className="hover:text-blue-600 transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/echanger" className="hover:text-blue-600 transition-colors">
                  Échanger mon iPhone
                </Link>
              </li>
              <li>
                <Link href="/seller/apply" className="hover:text-blue-600 transition-colors">
                  Devenir vendeur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/a-propos" className="hover:text-blue-600 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-gray-900">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                Dakar, Sénégal
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                +221 77 751 55 63
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                ndongoamedy@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 SenTechTrade. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
