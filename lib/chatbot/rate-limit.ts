interface RateLimitEntry {
  count: number
  resetAt: Date
}

const RATE_LIMIT_KEY = "chatbot_rate_limit"
const MAX_REQUESTS = 3
const WINDOW_HOURS = 24

export class RateLimiter {
  private getDeviceId(): string {
    if (typeof window === "undefined") return "server"

    let deviceId = localStorage.getItem("device_id")
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem("device_id", deviceId)
    }
    return deviceId
  }

  private getRateLimitData(): Record<string, RateLimitEntry> {
    if (typeof window === "undefined") return {}

    const data = localStorage.getItem(RATE_LIMIT_KEY)
    if (!data) return {}

    try {
      const parsed = JSON.parse(data)
      // Clean up expired entries
      const now = new Date()
      Object.keys(parsed).forEach((key) => {
        if (new Date(parsed[key].resetAt) < now) {
          delete parsed[key]
        }
      })
      return parsed
    } catch {
      return {}
    }
  }

  private saveRateLimitData(data: Record<string, RateLimitEntry>): void {
    if (typeof window === "undefined") return
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
  }

  checkLimit(): { allowed: boolean; remaining: number; resetAt?: Date } {
    const deviceId = this.getDeviceId()
    const data = this.getRateLimitData()
    const entry = data[deviceId]

    if (!entry) {
      return { allowed: true, remaining: MAX_REQUESTS }
    }

    const now = new Date()
    if (new Date(entry.resetAt) < now) {
      // Reset expired limit
      delete data[deviceId]
      this.saveRateLimitData(data)
      return { allowed: true, remaining: MAX_REQUESTS }
    }

    const remaining = MAX_REQUESTS - entry.count
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      resetAt: entry.resetAt,
    }
  }

  incrementCount(): void {
    const deviceId = this.getDeviceId()
    const data = this.getRateLimitData()
    const now = new Date()
    const resetAt = new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000)

    if (!data[deviceId] || new Date(data[deviceId].resetAt) < now) {
      data[deviceId] = { count: 1, resetAt }
    } else {
      data[deviceId].count++
    }

    this.saveRateLimitData(data)
  }
}

export const rateLimiter = new RateLimiter()
