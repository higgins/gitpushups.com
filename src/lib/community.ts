import type { LeaderboardData } from './api'

export type CommunityMember = Pick<LeaderboardData['topUsers'][number], 'login' | 'avatarUrl'>

async function fetchPublicData(path: string) {
  try {
    const response = await fetch(`https://api.gitpushups.com${path}`, {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000),
    })
    const value = response.ok ? await response.json() : null
    return value && typeof value === 'object' ? value as { total?: unknown; topUsers?: unknown } : null
  } catch { return null }
}

export async function getCommunityStats(): Promise<{ total: number | null; members: CommunityMember[] }> {
  const dates = [0, 1, 2].map(daysAgo => new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10))
  const [totals, ...boards] = await Promise.all([
    fetchPublicData('/totalPushups'),
    ...dates.map(date => fetchPublicData(`/leaderboard?local_date=${date}`)),
  ])
  const members = new Map<string, CommunityMember>()
  for (const board of boards) {
    if (!Array.isArray(board?.topUsers)) continue
    for (const item of board.topUsers) {
      if (!item || typeof item !== 'object') continue
      const user = item as { login?: unknown; avatarUrl?: unknown }
      if (typeof user?.login === 'string' && /^[a-zA-Z0-9-]{1,39}$/.test(user.login) &&
        typeof user.avatarUrl === 'string' && user.avatarUrl.startsWith('https://avatars.githubusercontent.com/')) {
        members.set(user.login, { login: user.login, avatarUrl: user.avatarUrl })
      }
    }
  }
  return {
    total: typeof totals?.total === 'number' && Number.isSafeInteger(totals.total) && totals.total >= 0 ? totals.total : null,
    members: [...members.values()].slice(0, 8),
  }
}
