"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { iPhoneModels, capacities, conditions, colors, cities, mockListings } from "@/lib/data"
import type { iPhoneModel, Capacity, Condition, Color } from "@/lib/types"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string

  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listing, setListing] = useState<(typeof mockListings)[0] | null>(null)

  // Form state
  const [model, setModel] = useState<iPhoneModel>("iPhone 15 Pro")
  const [capacity, setCapacity] = useState<Capacity>("128GB")
  const [color, setColor] = useState<Color>("Noir")
  const [condition, setCondition] = useState<Condition>("Très bon")
  const [price, setPrice] = useState("")
  const [city, setCity] = useState("Dakar")
  const [description, setDescription] = useState("")
  const [allowExchange, setAllowExchange] = useState(true)
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "SELLER") {
      router.push("/auth/login")
      return
    }
    setCurrentUser(user)

    // Load listing data
    const foundListing = mockListings.find((l) => l.id === listingId)
    if (!foundListing) {
      alert("Annonce introuvable")
      router.push("/seller/dashboard")
      return
    }

    setListing(foundListing)
    setModel(foundListing.model)
    setCapacity(foundListing.capacity)
    setColor(foundListing.color)
    setCondition(foundListing.condition)
    setPrice(foundListing.priceCFA.toString())
    setCity(foundListing.city)
    setDescription(foundListing.description || "")
    setAllowExchange(foundListing.allowExchange)
    setPhotos(foundListing.photos)
  }, [router, listingId])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Generate title
    const title = `${model} ${capacity} ${color}`

    // Update listing
    const updatedListing = {
      ...listing,
      title,
      model,
      capacity,
      color,
      condition,
      priceCFA: Number.parseInt(price),
      city,
      photos,
      description,
      allowExchange,
      updatedAt: new Date(),
    }

    // In real app, this would PATCH to API
    console.log("[v0] Updating listing:", updatedListing)
    const index = mockListings.findIndex((l) => l.id === listingId)
    if (index !== -1) {
      mockListings[index] = updatedListing as any
    }

    alert("Annonce modifiée avec succès!")
    router.push("/seller/dashboard")
  }

  if (!currentUser || !listing) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier l'annonce</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as iPhoneModel)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {iPhoneModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacité *</label>
              <select
                value={capacity}
                onChange={(e) => setCapacity(e.target.value as Capacity)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {capacities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur *</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as Color)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix (CFA) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                step="1000"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
              <div className="space-y-4">
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Cliquez pour ajouter des photos</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Décrivez l'état du téléphone, la santé de la batterie, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Allow Exchange */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowExchange"
                checked={allowExchange}
                onChange={(e) => setAllowExchange(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="allowExchange" className="text-sm text-gray-700">
                Accepter les propositions d'échange
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <Link
                href="/seller/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
