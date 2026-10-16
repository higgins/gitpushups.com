import { API_ORIGIN } from './web-auth'
import type { Contributions } from './contributions'

export async function getUserContributions(username: string, year: number): Promise<Contributions | null> {
  try {
    const response = await fetch(`${API_ORIGIN}/user/${encodeURIComponent(username)}/contributions?year=${year}`, {
      next: { revalidate: 60 }, signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    const data = await response.json() as { contributions?: Record<string, { reps?: unknown; goal?: unknown }> }
    if (!data.contributions || typeof data.contributions !== 'object' || Array.isArray(data.contributions)) return null
    const contributions: Contributions = {}
    for (const [date, value] of Object.entries(data.contributions)) {
      if (!new RegExp(`^${year}-\\d{2}-\\d{2}$`).test(date) || !value) continue
      const reps = Number(value.reps), goal = Number(value.goal)
      if (!Number.isSafeInteger(reps) || reps < 0) return null
      contributions[date] = { reps, goal: Number.isSafeInteger(goal) && goal >= 0 ? goal : 0 }
    }
    return contributions
  } catch {
    return null
  }
}
