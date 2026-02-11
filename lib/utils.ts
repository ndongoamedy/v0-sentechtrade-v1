import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function isFeatured(listing: { featuredUntil?: Date }): boolean {
  if (!listing.featuredUntil) return false
  return new Date(listing.featuredUntil) > new Date()
}
