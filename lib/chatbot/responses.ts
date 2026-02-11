import type { Language } from "./intents"

export const responses = {
  fr: {
    greeting: "Bonjour ! 👋 Je suis l'assistant SenTechTrade. Comment puis-je vous aider aujourd'hui ?",
    exchange_start:
      "Super ! Je vais vous aider à estimer votre échange. 🔄\n\nCommençons par votre iPhone actuel. Quel modèle avez-vous ?",
    buy_start: "Parfait ! Je vais vous aider à acheter un iPhone. 🛒\n\nQuel modèle recherchez-vous ?",
    seller_start:
      "Excellent ! Vous souhaitez devenir vendeur partenaire. 🏪\n\nPour commencer, quel est le nom de votre boutique ?",
    unknown:
      "Je n'ai pas bien compris. 🤔 Voulez-vous :\n• Échanger votre iPhone\n• Acheter un iPhone\n• Devenir vendeur\n• Consulter la FAQ",
    ask_current_model: "Quel est le modèle de votre iPhone actuel ?",
    ask_current_capacity: "Quelle est la capacité de stockage ?",
    ask_screen_condition: "Quel est l'état de l'écran ?",
    ask_back_condition: "Quel est l'état du dos du téléphone ?",
    ask_face_id: "Le Face ID fonctionne-t-il ?",
    ask_battery: "Quel est l'état de la batterie ?\n(Indiquez le pourcentage ou 'changée' si elle a été remplacée)",
    ask_desired_model: "Quel iPhone souhaitez-vous en échange ?",
    ask_desired_capacity: "Quelle capacité de stockage souhaitez-vous ?",
    ask_name: "Quel est votre nom complet ?",
    ask_phone: "Quel est votre numéro WhatsApp ?",
    ask_city: "Dans quelle ville êtes-vous ?",
    invalid_model: "Ce modèle n'est pas disponible. Veuillez choisir parmi les modèles proposés.",
    invalid_capacity: "Cette capacité n'est pas valide pour ce modèle. Capacités disponibles : ",
    invalid_battery: "Veuillez indiquer un pourcentage (ex: 85) ou 'changée'.",
    estimation_unavailable:
      "Désolé, je n'ai pas assez de données pour estimer cet échange. Contactez-nous sur WhatsApp pour une estimation personnalisée.",
    rate_limit:
      "Vous avez atteint la limite de 3 demandes par 24h. Veuillez réessayer demain ou contactez-nous directement sur WhatsApp.",
    error: "Une erreur s'est produite. Veuillez réessayer ou nous contacter sur WhatsApp.",
  },
  en: {
    greeting: "Hello! 👋 I'm the SenTechTrade assistant. How can I help you today?",
    exchange_start:
      "Great! I'll help you estimate your exchange. 🔄\n\nLet's start with your current iPhone. What model do you have?",
    buy_start: "Perfect! I'll help you buy an iPhone. 🛒\n\nWhich model are you looking for?",
    seller_start: "Excellent! You want to become a partner seller. 🏪\n\nTo start, what's your shop name?",
    unknown:
      "I didn't quite understand. 🤔 Would you like to:\n• Exchange your iPhone\n• Buy an iPhone\n• Become a seller\n• Check the FAQ",
    ask_current_model: "What's your current iPhone model?",
    ask_current_capacity: "What's the storage capacity?",
    ask_screen_condition: "What's the screen condition?",
    ask_back_condition: "What's the back condition?",
    ask_face_id: "Does Face ID work?",
    ask_battery: "What's the battery condition?\n(Indicate percentage or 'changed' if replaced)",
    ask_desired_model: "Which iPhone would you like in exchange?",
    ask_desired_capacity: "What storage capacity would you like?",
    ask_name: "What's your full name?",
    ask_phone: "What's your WhatsApp number?",
    ask_city: "Which city are you in?",
    invalid_model: "This model is not available. Please choose from the suggested models.",
    invalid_capacity: "This capacity is not valid for this model. Available capacities: ",
    invalid_battery: "Please indicate a percentage (ex: 85) or 'changed'.",
    estimation_unavailable:
      "Sorry, I don't have enough data to estimate this exchange. Contact us on WhatsApp for a personalized estimate.",
    rate_limit:
      "You've reached the limit of 3 requests per 24h. Please try again tomorrow or contact us directly on WhatsApp.",
    error: "An error occurred. Please try again or contact us on WhatsApp.",
  },
}

export function getResponse(key: keyof typeof responses.fr, language: Language = "fr"): string {
  return responses[language][key] || responses.fr[key]
}
