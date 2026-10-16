import type { Metadata } from 'next'
import { Buffer } from 'node:buffer'
import { getUserStatus } from './api'
import { getUserContributions } from './user-contributions'
import { contributionCalendar, type Contributions } from './contributions'

export const PROFILE_CARD_VERSION = '5'
export const PROFILE_CARD_WIDTH = 1200
export const PROFILE_CARD_HEIGHT = 630
export const PROFILE_CARD_TTL = 86400
export const SITE_ORIGIN = 'https://gitpushups.com'
export const PROFILE_TEMPLATE = '/social/profile-template-v4.png'
export const PROFILE_LOGO = '/social/gitpushups-logo-v1.png'
export const PROFILE_FONT = '/social/fonts/BarlowCondensed-Bold.ttf'

export function isGitHubUsername(value: string) {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value)
}

export function profileSocialMetadata(username: string): Metadata {
  if (!isGitHubUsername(username)) return {}
  const title = `@${username} on Git Pushups`
  const description = `Follow @${username}'s pushup progress. No pushups? No code.`
  const url = `${SITE_ORIGIN}/@${username}`
  const image = {
    url: `${SITE_ORIGIN}/social/profile/${username.toLowerCase()}?v=${PROFILE_CARD_VERSION}`,
    width: PROFILE_CARD_WIDTH,
    height: PROFILE_CARD_HEIGHT,
    alt: `@${username}'s Git Pushups profile, with their avatar, username, annual pushup total, year, and GitPushups logo beside the mascot.`,
  }
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'profile', siteName: 'Git Pushups', title, description, url, username, images: [{ ...image, type: 'image/png' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function profileContributionSummary(contributions: Contributions | null, today: string) {
  const year = Number(today.slice(0, 4))
  const days = contributions === null ? null : contributionCalendar(year, contributions)
  const available = days?.filter(day => day.date <= today)
  return {
    year, days,
    total: available ? available.reduce((sum, day) => sum + day.reps, 0) : null,
    activeDays: available ? available.filter(day => day.reps > 0).length : null,
  }
}

export async function getProfileCardData(username: string) {
  if (!isGitHubUsername(username)) return null
  const status = await getUserStatus(username)
  if (!status || !isGitHubUsername(status.user.username) || status.user.username.toLowerCase() !== username.toLowerCase()) return null
  const localDate = status.localDate
  const today = localDate && /^\d{4}-\d{2}-\d{2}$/.test(localDate) &&
    Number.isFinite(Date.parse(localDate)) && new Date(localDate).toISOString().slice(0, 10) === localDate
    ? localDate : new Date().toISOString().slice(0, 10)
  const contributions = await getUserContributions(status.user.username, Number(today.slice(0, 4)))
  // A cached preview shows accumulated progress, never today's completion status.
  return { username: status.user.username, avatarUrl: status.user.avatarUrl, today, ...profileContributionSummary(contributions, today) }
}

export type ProfileCardData = NonNullable<Awaited<ReturnType<typeof getProfileCardData>>>

// Read only GitHub's image host. Never turn public profile metadata into an arbitrary URL fetch.
export function githubAvatarUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'avatars.githubusercontent.com' || url.port || url.username || url.password) return null
    url.searchParams.set('s', '192')
    return url.toString()
  } catch { return null }
}

export async function readBoundedBody(response: Response, limit: number): Promise<ArrayBuffer> {
  if (!response.ok || !response.body) throw new Error('Image input unavailable')
  if (Number(response.headers.get('content-length')) > limit) throw new Error('Image input too large')
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > limit) throw new Error('Image input too large')
      chunks.push(value)
    }
  } catch (error) {
    await reader.cancel()
    throw error
  } finally { reader.releaseLock() }
  const result = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength }
  return result.buffer
}

export async function getProfileAvatar(value: unknown): Promise<string | null> {
  const url = githubAvatarUrl(value)
  if (!url) return null
  try {
    // Workers supports manual/follow, not redirect:error. Never follow to another host.
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(3000), next: { revalidate: 86400 } })
    const type = response.headers.get('content-type')?.split(';')[0]
    if (!response.ok || (type !== 'image/png' && type !== 'image/jpeg')) {
      console.warn('Profile avatar response unavailable', { status: response.status, type })
      return null
    }
    const data = await readBoundedBody(response, 512 * 1024)
    return `data:${type};base64,${Buffer.from(data).toString('base64')}`
  } catch (error) {
    console.warn('Profile avatar fetch failed', { error: error instanceof Error ? error.message : 'Unknown error' })
    return null
  }
}
