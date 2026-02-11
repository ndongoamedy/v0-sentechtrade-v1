export interface FAQItem {
  id: string
  question: string
  answer: string
  category: "models" | "conditions" | "process" | "seller" | "general"
  keywords: string[]
}

export const faqData: FAQItem[] = [
  // Models & Capacities
  {
    id: "models-available",
    question: "Quels modèles d'iPhone sont disponibles ?",
    answer:
      "Nous avons des iPhone du XR jusqu'au dernier iPhone 17 Pro Max, incluant aussi l'iPhone Air. Les modèles populaires incluent iPhone 13, 14, 15, 16 et 17 dans toutes leurs variantes (standard, Plus, Pro, Pro Max).",
    category: "models",
    keywords: ["modèle", "disponible", "iphone", "version", "quel"],
  },
  {
    id: "capacities-info",
    question: "Quelles capacités de stockage sont disponibles ?",
    answer:
      "Les capacités varient selon le modèle : 64GB, 128GB, 256GB, 512GB et 1TB. Par exemple, l'iPhone 15 Pro Max est disponible en 256GB, 512GB et 1TB, tandis que l'iPhone 13 est disponible en 128GB, 256GB et 512GB.",
    category: "models",
    keywords: ["capacité", "stockage", "gb", "mémoire", "espace"],
  },

  // Conditions
  {
    id: "condition-neuf",
    question: 'Que signifie "Neuf" ?',
    answer:
      "📦 NEUF : iPhone jamais utilisé, scellé dans son emballage d'origine avec tous les accessoires. Garantie constructeur complète.",
    category: "conditions",
    keywords: ["neuf", "nouveau", "état", "scellé", "emballage"],
  },
  {
    id: "condition-comme-neuf",
    question: 'Que signifie "Comme neuf" ?',
    answer:
      "✨ COMME NEUF : iPhone utilisé très peu de temps (quelques jours/semaines), aucune trace d'usure visible. Batterie à 95-100%. Comme sorti de la boîte.",
    category: "conditions",
    keywords: ["comme neuf", "état", "parfait", "impeccable"],
  },
  {
    id: "condition-excellent",
    question: 'Que signifie "Excellent" ?',
    answer:
      "⭐ EXCELLENT : iPhone en très bon état général, quelques micro-rayures invisibles à l'œil nu. Batterie à 90-95%. Fonctionne parfaitement.",
    category: "conditions",
    keywords: ["excellent", "état", "très bon"],
  },
  {
    id: "condition-tres-bon",
    question: 'Que signifie "Très bon" ?',
    answer:
      "👍 TRÈS BON : iPhone avec quelques traces d'usage légères mais bien entretenu. Batterie à 85-90%. Aucun impact sur les performances.",
    category: "conditions",
    keywords: ["très bon", "état", "bon état"],
  },
  {
    id: "condition-bon",
    question: 'Que signifie "Bon" ?',
    answer:
      "✓ BON : iPhone avec des traces d'usage visibles (rayures, micro-chocs) mais fonctionnel. Batterie à 80-85%. Bon rapport qualité-prix.",
    category: "conditions",
    keywords: ["bon", "état", "usage", "rayure"],
  },
  {
    id: "condition-correct",
    question: 'Que signifie "Correct" ?',
    answer:
      "⚠️ CORRECT : iPhone avec usure importante visible, mais toutes les fonctions marchent. Batterie à 75-80%. Prix très attractif.",
    category: "conditions",
    keywords: ["correct", "état", "usé", "abîmé"],
  },

  // Process
  {
    id: "how-to-buy",
    question: "Comment acheter un iPhone ?",
    answer:
      "1️⃣ Parcourez la boutique et trouvez l'iPhone qui vous intéresse\n2️⃣ Cliquez sur \"Acheter\" pour voir les détails\n3️⃣ Contactez le vendeur via WhatsApp (message pré-rempli)\n4️⃣ Convenez du rendez-vous et du mode de paiement\n5️⃣ Vérifiez l'appareil avant de payer",
    category: "process",
    keywords: ["acheter", "achat", "comment", "processus", "étapes"],
  },
  {
    id: "how-to-exchange",
    question: "Comment échanger mon iPhone ?",
    answer:
      '1️⃣ Cliquez sur "Échanger mon iPhone"\n2️⃣ Décrivez votre iPhone actuel (modèle, capacité, état, photos)\n3️⃣ Choisissez l\'iPhone que vous voulez\n4️⃣ Indiquez votre budget max à rajouter\n5️⃣ Remplissez vos coordonnées\n6️⃣ Contactez le vendeur via WhatsApp pour finaliser',
    category: "process",
    keywords: ["échanger", "échange", "trade", "reprise", "comment"],
  },
  {
    id: "payment-methods",
    question: "Quels sont les modes de paiement ?",
    answer:
      "Les paiements se font directement entre vous et le vendeur. Modes recommandés : 💰 Wave, 📱 Orange Money, 💵 Espèces (remise en main propre). Nous conseillons de vérifier l'appareil avant tout paiement.",
    category: "process",
    keywords: ["paiement", "payer", "wave", "orange money", "espèces"],
  },
  {
    id: "delivery-zones",
    question: "Quelles sont les zones de livraison ?",
    answer:
      "Les vendeurs sont principalement à Dakar, mais aussi à Thiès, Saint-Louis, Kaolack et d'autres villes du Sénégal. La livraison ou le lieu de rencontre se décide directement avec le vendeur via WhatsApp.",
    category: "process",
    keywords: ["livraison", "zone", "ville", "dakar", "rencontre"],
  },

  // Seller
  {
    id: "become-seller",
    question: "Comment devenir vendeur ?",
    answer:
      'Pour devenir vendeur partenaire :\n1️⃣ Cliquez sur "Devenir vendeur"\n2️⃣ Remplissez le formulaire (nom boutique, WhatsApp, ville)\n3️⃣ Fournissez des preuves d\'activité (photos boutique, réseaux sociaux)\n4️⃣ Notre équipe examine votre candidature sous 48-72h\n5️⃣ Une fois approuvé, vous pouvez publier vos annonces',
    category: "seller",
    keywords: ["vendeur", "vendre", "devenir", "partenaire", "boutique"],
  },
  {
    id: "seller-verification",
    question: "Les vendeurs sont-ils vérifiés ?",
    answer:
      'Oui ! Tous nos vendeurs partenaires sont vérifiés par notre équipe. Vous pouvez les identifier grâce au badge bleu ✓ "Vérifié" sur leur profil. Nous vérifions leur identité, leur boutique et leur sérieux.',
    category: "seller",
    keywords: ["vérifié", "vérification", "badge", "confiance", "sérieux"],
  },

  // General
  {
    id: "what-is-senttechtrade",
    question: "C'est quoi SenTechTrade ?",
    answer:
      "SenTechTrade est la marketplace de confiance pour acheter et échanger des iPhone au Sénégal. Nous connectons acheteurs et vendeurs vérifiés via WhatsApp pour des transactions simples et sécurisées.",
    category: "general",
    keywords: ["senttechtrade", "c'est quoi", "plateforme", "marketplace"],
  },
  {
    id: "contact-support",
    question: "Comment vous contacter ?",
    answer:
      "Pour toute question ou problème, vous pouvez nous contacter via WhatsApp ou par email. Notre équipe répond généralement sous 24h.",
    category: "general",
    keywords: ["contact", "aide", "support", "problème", "question"],
  },
]

export const quickActions = [
  { id: "exchange", label: "Échanger mon iPhone", icon: "🔄" },
  { id: "buy", label: "Acheter un iPhone", icon: "🛒" },
  { id: "seller", label: "Devenir vendeur", icon: "🏪" },
  { id: "help", label: "Aide & FAQ", icon: "❓" },
]
