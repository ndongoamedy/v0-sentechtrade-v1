"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, X, Check } from "lucide-react"
import Image from "next/image"

interface PhotoSlot {
  id: string
  label: string
  description: string
  icon: string
  required: boolean
}

const photoSlots: PhotoSlot[] = [
  {
    id: "front",
    label: "Face (écran allumé)",
    description: "Montrez l'écran allumé pour voir l'état",
    icon: "📱",
    required: true,
  },
  {
    id: "back",
    label: "Dos du téléphone",
    description: "Vue complète de l'arrière",
    icon: "🔄",
    required: true,
  },
  {
    id: "no-case",
    label: "Sans coque",
    description: "Retirez la coque pour voir l'état réel",
    icon: "📲",
    required: true,
  },
  {
    id: "edges",
    label: "Bordures/Tranches",
    description: "Montrez les côtés et les coins",
    icon: "🔲",
    required: false,
  },
]

interface PhotoUploadStepProps {
  photos: Record<string, string>
  onPhotosChange: (photos: Record<string, string>) => void
}

export function PhotoUploadStep({ photos, onPhotosChange }: PhotoUploadStepProps) {
  const [dragOver, setDragOver] = useState<string | null>(null)

  const handleFileSelect = (slotId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image")
      return
    }

    // Convert to base64 for preview and storage
    const reader = new FileReader()
    reader.onloadend = () => {
      onPhotosChange({
        ...photos,
        [slotId]: reader.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (slotId: string, e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(slotId, file)
    }
  }

  const handleRemove = (slotId: string) => {
    const newPhotos = { ...photos }
    delete newPhotos[slotId]
    onPhotosChange(newPhotos)
  }

  const requiredPhotosCount = photoSlots.filter((slot) => slot.required).length
  const uploadedRequiredPhotos = photoSlots.filter((slot) => slot.required && photos[slot.id]).length

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos de votre iPhone</h2>
      <p className="text-gray-600 mb-6">
        Ajoutez des photos claires pour une meilleure évaluation ({uploadedRequiredPhotos}/{requiredPhotosCount}{" "}
        obligatoires)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {photoSlots.map((slot) => {
          const hasPhoto = !!photos[slot.id]

          return (
            <div key={slot.id} className="relative">
              <div
                className={`border-2 border-dashed rounded-xl p-4 transition-all ${
                  dragOver === slot.id
                    ? "border-blue-500 bg-blue-50"
                    : hasPhoto
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(slot.id)
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(slot.id, e)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{slot.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{slot.label}</h3>
                      {slot.required && <span className="text-xs text-red-500 font-medium">*</span>}
                      {hasPhoto && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{slot.description}</p>

                    {hasPhoto ? (
                      <div className="relative">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={photos[slot.id] || "/placeholder.svg"}
                            alt={slot.label}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          onClick={() => handleRemove(slot.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <Camera className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Ajouter une photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileSelect(slot.id, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Conseils pour de bonnes photos :</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Prenez les photos dans un endroit bien éclairé</li>
              <li>• Assurez-vous que le téléphone est propre</li>
              <li>• Montrez clairement l'état réel (rayures, impacts, etc.)</li>
              <li>• Les photos aident à obtenir une meilleure estimation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
