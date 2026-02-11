"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { mockListings, iPhoneModels, capacities, conditions, cities } from "@/lib/data"
import type { iPhoneModel, Capacity, Condition } from "@/lib/types"

export default function BoutiquePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModels, setSelectedModels] = useState<iPhoneModel[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<Capacity[]>([])
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent")

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let filtered = mockListings.filter((l) => l.status === "PUBLISHED")

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((l) => l.title.toLowerCase().includes(query) || l.model.toLowerCase().includes(query))
    }

    // Model filter
    if (selectedModels.length > 0) {
      filtered = filtered.filter((l) => selectedModels.includes(l.model))
    }

    // Capacity filter
    if (selectedCapacities.length > 0) {
      filtered = filtered.filter((l) => selectedCapacities.includes(l.capacity))
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((l) => selectedConditions.includes(l.condition))
    }

    // City filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter((l) => selectedCities.includes(l.city))
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter((l) => l.priceCFA >= Number.parseInt(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((l) => l.priceCFA <= Number.parseInt(maxPrice))
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.priceCFA - b.priceCFA)
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.priceCFA - a.priceCFA)
    } else {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return filtered
  }, [searchQuery, selectedModels, selectedCapacities, selectedConditions, selectedCities, minPrice, maxPrice, sortBy])

  const toggleFilter = <T,>(value: T, selected: T[], setSelected: (values: T[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedModels([])
    setSelectedCapacities([])
    setSelectedConditions([])
    setSelectedCities([])
    setMinPrice("")
    setMaxPrice("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Boutique</h1>
          <p className="text-gray-600">Découvrez notre sélection d'iPhones vérifiés</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Rechercher</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="iPhone 15 Pro..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Modèle</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {iPhoneModels.slice(0, 12).map((model) => (
                      <label key={model} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model)}
                          onChange={() => toggleFilter(model, selectedModels, setSelectedModels)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Capacité</label>
                  <div className="space-y-2">
                    {capacities.map((capacity) => (
                      <label key={capacity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCapacities.includes(capacity)}
                          onChange={() => toggleFilter(capacity, selectedCapacities, setSelectedCapacities)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{capacity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">État</label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(condition)}
                          onChange={() => toggleFilter(condition, selectedConditions, setSelectedConditions)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Prix (CFA)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Ville</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cities.slice(0, 8).map((city) => (
                      <label key={city} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={() => toggleFilter(city, selectedCities, setSelectedCities)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {/* Sort and count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredListings.length}</span> annonce
                {filteredListings.length > 1 ? "s" : ""} trouvée{filteredListings.length > 1 ? "s" : ""}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="recent">Plus récentes</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            {/* Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">Aucune annonce trouvée</p>
                <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-medium">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
