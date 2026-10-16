export type Contribution = { reps: number; goal: number }
export type Contributions = Record<string, Contribution>
export const CONTRIBUTION_COLORS = ['#e5e7eb', '#fee2e2', '#fca5a5', '#ef4444', '#b91c1c']

export function contributionLevel({ reps, goal }: Contribution) {
  const ratio = reps / (goal || 1)
  return ratio >= 1 ? 4 : ratio >= .75 ? 3 : ratio >= .5 ? 2 : ratio > 0 ? 1 : 0
}

export function contributionCalendar(year: number, contributions: Contributions) {
  const first = new Date(Date.UTC(year, 0, 1))
  const days: Array<Contribution & { date: string; week: number; weekday: number; month: number; monthStart: boolean }> = []
  for (let day = new Date(first); day.getUTCFullYear() === year; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10)
    const index = days.length + first.getUTCDay()
    days.push({ date, week: Math.floor(index / 7), weekday: day.getUTCDay(), month: day.getUTCMonth(), monthStart: day.getUTCDate() === 1, ...(contributions[date] || { reps: 0, goal: 0 }) })
  }
  return days
}
