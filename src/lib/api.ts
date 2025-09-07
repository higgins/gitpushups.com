const API_BASE_URL = 'https://api.gitpushups.com'

export interface LeaderboardData {
  date: string
  topTeams: Array<{
    team: string
    totalReps: number
  }>
  topUsers: Array<{
    userId: string
    login: string
    avatarUrl: string
    totalReps: number
  }>
}

export interface UserStatus {
  user: {
    username: string
    avatarUrl: string
  }
  didPushupsToday: boolean
  localDate?: string
}

export async function getLeaderboard(): Promise<LeaderboardData | null> {
  try {
    const nowDate = new Date()
    const localDate = `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${nowDate
      .getDate()
      .toString()
      .padStart(2, '0')}`

    const response = await fetch(`${API_BASE_URL}/leaderboard?local_date=${localDate}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return null
  }
}

export async function getUserStatus(
  username: string,
  localDate?: string
): Promise<UserStatus | null> {
  try {
    const url = new URL(`${API_BASE_URL}/user/${username}`)
    if (localDate) {
      url.searchParams.set('local_date', localDate)
    }
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch user status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user status:', error)
    return null
  }
}
