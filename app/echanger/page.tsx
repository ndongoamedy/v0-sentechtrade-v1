"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RefreshCw, CheckCircle2 } from "lucide-react"
import { iPhoneModels, capacities, conditions, cities, mockListings } from "@/lib/data"
import type { iPhoneModel, Capacity, Condition, ExchangeDetails, PhoneConditionDetails } from "@/lib/types"
import { buildWhatsAppLink, formatExchangeMessage } from "@/lib/whatsapp"
import { PhotoUploadStep } from "@/components/photo-upload-step"

type Step = 1 | 2 | 3 | 4 | 5

const getValidCapacities = (model: iPhoneModel): Capacity[] => {
  // This function should return valid capacities for the given model
  // For demonstration, it returns all capacities
  return capacities
}

export default function ExchangePage() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listing")

  const [currentStep, setCurrentStep] = useState<Step>(1)

  // Step 1: Mon iPhone actuel
  const [currentModel, setCurrentModel] = useState<iPhoneModel | "">("")
  const [currentCapacity, setCurrentCapacity] = useState<Capacity | "">("")
  const [currentCondition, setCurrentCondition] = useState<Condition | "">("")

  const [screenStatus, setScreenStatus] = useState<"never_changed" | "changed" | "cracked" | "">("")
  const [batteryHealth, setBatteryHealth] = useState("")
  const [batteryReplaced, setBatteryReplaced] = useState<boolean | null>(null)
  const [faceIdWorking, setFaceIdWorking] = useState<boolean | null>(null)

  const [currentPhotos, setCurrentPhotos] = useState<Record<string, string>>({})

  // Step 3: iPhone souhaité (skipped if coming from listing)
  const [desiredModel, setDesiredModel] = useState<iPhoneModel | "">("")
  const [desiredCapacity, setDesiredCapacity] = useState<Capacity | "">("")
  const [minCondition, setMinCondition] = useState<Condition | "">("")
  const [maxBudget, setMaxBudget] = useState("")

  // Step 4: Mes informations
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientCity, setClientCity] = useState("")

  const [currentValidCapacities, setCurrentValidCapacities] = useState<Capacity[]>(capacities)
  const [desiredValidCapacities, setDesiredValidCapacities] = useState<Capacity[]>(capacities)

  useEffect(() => {
    if (currentModel) {
      const validCaps = getValidCapacities(currentModel)
      setCurrentValidCapacities(validCaps)
      if (currentCapacity && !validCaps.includes(currentCapacity)) {
        setCurrentCapacity("")
      }
    }
  }, [currentModel])

  useEffect(() => {
    if (desiredModel) {
      const validCaps = getValidCapacities(desiredModel)
      setDesiredValidCapacities(validCaps)
      if (desiredCapacity && !validCaps.includes(desiredCapacity)) {
        setDesiredCapacity("")
      }
    }
  }, [desiredModel])

  // Pre-fill desired product if coming from a listing
  useEffect(() => {
    if (listingId) {
      const listing = mockListings.find((l) => l.id === listingId)
      if (listing) {
        setDesiredModel(listing.model)
        setDesiredCapacity(listing.capacity)
        setMinCondition(listing.condition)
        setCurrentStep(1)
      }
    }
  }, [listingId])

  const totalSteps = listingId ? 4 : 5
  const adjustedStep = listingId && currentStep > 2 ? currentStep + 1 : currentStep
  const progress = (adjustedStep / 5) * 100

  const canProceedStep1 =
    currentModel &&
    currentCapacity &&
    currentCondition &&
    screenStatus &&
    batteryHealth &&
    batteryReplaced !== null &&
    faceIdWorking !== null

  const requiredPhotoSlots = ["front", "back", "no-case"]
  const canProceedStep2 = requiredPhotoSlots.every((slot) => currentPhotos[slot])

  const canProceedStep3 = desiredModel && desiredCapacity && minCondition
  const canProceedStep4 = clientName && clientPhone && clientCity

  const handleNext = () => {
    if (listingId && currentStep === 2) {
      setCurrentStep(4 as Step)
    } else if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (listingId && currentStep === 4) {
      setCurrentStep(2 as Step)
    } else if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = () => {
    const listing = listingId ? mockListings.find((l) => l.id === listingId) : null

    if (!listing) {
      alert("Erreur: Annonce introuvable")
      return
    }

    const conditionDetails: PhoneConditionDetails = {
      screenStatus: screenStatus as "never_changed" | "changed" | "cracked",
      batteryHealth: Number.parseInt(batteryHealth),
      batteryReplaced: batteryReplaced!,
      faceIdWorking: faceIdWorking!,
    }

    const exchangeDetails: ExchangeDetails = {
      currentModel: currentModel as iPhoneModel,
      currentCapacity: currentCapacity as Capacity,
      currentCondition: currentCondition as Condition,
      currentPhotos: Object.values(currentPhotos),
      conditionDetails,
      desiredModel: desiredModel as iPhoneModel,
      desiredCapacity: desiredCapacity as Capacity,
      minCondition: minCondition as Condition,
      maxBudgetCFA: maxBudget ? Number.parseInt(maxBudget) : undefined,
    }

    const message = formatExchangeMessage(listing, exchangeDetails, clientName, clientPhone, clientCity)
    const whatsappUrl = buildWhatsAppLink(listing.seller?.whatsapp || "", message)

    console.log("[v0] Exchange lead created:", {
      listingId,
      exchangeDetails,
      clientName,
      clientPhone,
      clientCity,
      photosCount: Object.keys(currentPhotos).length,
    })

    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Échanger mon iPhone</h1>
          <p className="text-gray-600">Remplissez le formulaire en {totalSteps} étapes simples</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Étape {listingId && currentStep > 2 ? currentStep - 1 : currentStep} sur {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border p-6 md:p-8">
          {/* Step 1: Mon iPhone actuel */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon iPhone actuel</h2>
              <p className="text-gray-600 mb-6">Décrivez l'iPhone que vous souhaitez échanger</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Modèle <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentModel}
                    onChange={(e) => setCurrentModel(e.target.value as iPhoneModel)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un modèle</option>
                    {iPhoneModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Capacité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentCapacity}
                    onChange={(e) => setCurrentCapacity(e.target.value as Capacity)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!currentModel}
                  >
                    <option value="">Sélectionnez la capacité</option>
                    {currentValidCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>
                        {capacity}
                      </option>
                    ))}
                  </select>
                  {currentModel && (
                    <p className="text-xs text-gray-500 mt-1">Capacités disponibles pour {currentModel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    État général <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentCondition}
                    onChange={(e) => setCurrentCondition(e.target.value as Condition)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez l'état</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    État de l'écran <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="screenStatus"
                        value="never_changed"
                        checked={screenStatus === "never_changed"}
                        onChange={(e) => setScreenStatus(e.target.value as "never_changed")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Jamais changé / Bon état</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="screenStatus"
                        value="changed"
                        checked={screenStatus === "changed"}
                        onChange={(e) => setScreenStatus(e.target.value as "changed")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Écran changé</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="screenStatus"
                        value="cracked"
                        checked={screenStatus === "cracked"}
                        onChange={(e) => setScreenStatus(e.target.value as "cracked")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Fissuré</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    État de la batterie (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    placeholder="Ex: 85"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Vérifiez dans Réglages → Batterie → État de la batterie</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Batterie changée ? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                      <input
                        type="radio"
                        name="batteryReplaced"
                        checked={batteryReplaced === false}
                        onChange={() => setBatteryReplaced(false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Jamais changée</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                      <input
                        type="radio"
                        name="batteryReplaced"
                        checked={batteryReplaced === true}
                        onChange={() => setBatteryReplaced(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Changée</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Face ID fonctionne ? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                      <input
                        type="radio"
                        name="faceIdWorking"
                        checked={faceIdWorking === true}
                        onChange={() => setFaceIdWorking(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Fonctionne</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                      <input
                        type="radio"
                        name="faceIdWorking"
                        checked={faceIdWorking === false}
                        onChange={() => setFaceIdWorking(false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Ne fonctionne pas</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && <PhotoUploadStep photos={currentPhotos} onPhotosChange={setCurrentPhotos} />}

          {/* Step 3: iPhone souhaité (only if not from listing) */}
          {currentStep === 3 && !listingId && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">iPhone souhaité</h2>
              <p className="text-gray-600 mb-6">Quel iPhone recherchez-vous ?</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Modèle souhaité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={desiredModel}
                    onChange={(e) => setDesiredModel(e.target.value as iPhoneModel)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un modèle</option>
                    {iPhoneModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Capacité souhaitée <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={desiredCapacity}
                    onChange={(e) => setDesiredCapacity(e.target.value as Capacity)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!desiredModel}
                  >
                    <option value="">Sélectionnez la capacité</option>
                    {desiredValidCapacities.map((capacity) => (
                      <option key={capacity} value={capacity}>
                        {capacity}
                      </option>
                    ))}
                  </select>
                  {desiredModel && (
                    <p className="text-xs text-gray-500 mt-1">Capacités disponibles pour {desiredModel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    État minimum accepté <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={minCondition}
                    onChange={(e) => setMinCondition(e.target.value as Condition)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez l'état</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Budget maximum à ajouter (CFA) - Optionnel
                  </label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Ex: 100000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Montant maximum que vous êtes prêt à ajouter pour la différence
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Mes informations */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes informations</h2>
              <p className="text-gray-600 mb-6">Comment pouvons-nous vous contacter ?</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email - Optionnel</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Numéro WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+221 77 XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Ex: Dakar</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Récapitulatif */}
          {currentStep === 5 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Récapitulatif</h2>
                <p className="text-gray-600">Vérifiez vos informations avant envoi</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Mon iPhone actuel</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium">
                      {currentModel} {currentCapacity} - {currentCondition}
                    </p>
                    <div className="text-sm space-y-1 mt-2 pt-2 border-t">
                      <p>
                        <span className="font-medium">Écran:</span>{" "}
                        {screenStatus === "never_changed"
                          ? "Jamais changé"
                          : screenStatus === "changed"
                            ? "Changé"
                            : "Fissuré"}
                      </p>
                      <p>
                        <span className="font-medium">Batterie:</span> {batteryHealth}%
                        {batteryReplaced ? " (Changée)" : " (Jamais changée)"}
                      </p>
                      <p>
                        <span className="font-medium">Face ID:</span>{" "}
                        {faceIdWorking ? "Fonctionne" : "Ne fonctionne pas"}
                      </p>
                      <p>
                        <span className="font-medium">Photos:</span> {Object.keys(currentPhotos).length} ajoutée(s)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">iPhone recherché</h3>
                  <p className="text-gray-700">
                    {desiredModel} {desiredCapacity} - Minimum {minCondition}
                  </p>
                  {maxBudget && (
                    <p className="text-sm text-gray-600 mt-1">
                      Budget différence max : {Number.parseInt(maxBudget).toLocaleString()} CFA
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Mes coordonnées</h3>
                  <div className="space-y-1 text-gray-700">
                    <p>{clientName}</p>
                    {clientEmail && <p>{clientEmail}</p>}
                    <p>{clientPhone}</p>
                    <p>{clientCity}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
            )}
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3) ||
                  (currentStep === 4 && !canProceedStep4)
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continuer
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Envoyer ma demande
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
