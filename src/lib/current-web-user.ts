import { cache } from 'react'
import { cookies } from 'next/headers'
import { API_ORIGIN, SESSION_COOKIE } from './web-auth'
import type { WebUser } from '@/components/landing/TrainingContext'

// Share one profile lookup between the layout header and page in each render.
export const getCurrentWebUser = cache(async (): Promise<{ user: WebUser | null; error?: string }> => {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return { user: null }
  try {
    const response = await fetch(`${API_ORIGIN}/protected/me`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000),
    })
    if (response.status === 401 || response.status === 404) return { user: null, error: 'expired' }
    if (!response.ok) return { user: null, error: 'profile' }
    const data = await response.json() as { user?: { login?: unknown; avatarUrl?: unknown } }
    if (typeof data.user?.login !== 'string' || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(data.user.login)) return { user: null, error: 'profile' }
    const avatarUrl = typeof data.user.avatarUrl === 'string' && data.user.avatarUrl.startsWith('https://avatars.githubusercontent.com/') ? data.user.avatarUrl : null
    return { user: { login: data.user.login, avatarUrl } }
  } catch {
    return { user: null, error: 'profile' }
  }
})
