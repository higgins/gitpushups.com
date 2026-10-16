import React from 'react'
import { Buffer } from 'node:buffer'
import { ImageResponse } from 'next/og'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { ProfileSocialCard } from '@/components/profile/ProfileSocialCard'
import { getProfileAvatar, getProfileCardData, isGitHubUsername, readBoundedBody, PROFILE_CARD_HEIGHT, PROFILE_CARD_TTL, PROFILE_CARD_VERSION, PROFILE_CARD_WIDTH, PROFILE_FONT, PROFILE_LOGO, PROFILE_TEMPLATE, SITE_ORIGIN } from '@/lib/profile-social'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function asset(path: string, request: Request) {
  // Production reads the same deployment's assets, never the old live website.
  const { env } = await getCloudflareContext({ async: true })
  if (env.ASSETS) return env.ASSETS.fetch(new Request(`${SITE_ORIGIN}${path}`))
  const origin = new URL(request.url)
  if (process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
    return fetch(new URL(path, origin), { signal: AbortSignal.timeout(3000) })
  }
  throw new Error('Static asset binding unavailable')
}

export async function GET(request: Request, { params }: { params: { username: string } }) {
  if (!isGitHubUsername(params.username)) return new Response('Not found', { status: 404 })
  const username = params.username.toLowerCase()
  // The pinned Wrangler/OpenNext versions predate Workers Cache. Cache API needs no new binding.
  // Ignore query parameters and cookies: one public image per username and template version.
  const cacheKey = new Request(`${SITE_ORIGIN}/social/profile/${username}?v=${PROFILE_CARD_VERSION}`)
  let cache: Cache | null = null
  try {
    cache = typeof caches === 'undefined' ? null : await caches.open('profile-social')
    const cached = await cache?.match(cacheKey)
    if (cached) return cached
  } catch { console.warn('Profile image cache read failed') }
  try {
    const data = await getProfileCardData(username)
    if (!data) return new Response('Profile unavailable', { status: 404, headers: { 'Cache-Control': 'no-store' } })
    const [template, font, avatar, logo] = await Promise.all([
      asset(PROFILE_TEMPLATE, request).then(response => readBoundedBody(response, 1024 * 1024)),
      asset(PROFILE_FONT, request).then(response => readBoundedBody(response, 256 * 1024)),
      getProfileAvatar(data.avatarUrl),
      asset(PROFILE_LOGO, request).then(response => readBoundedBody(response, 256 * 1024)),
    ])
    const templateUrl = `data:image/png;base64,${Buffer.from(template).toString('base64')}`
    const logoUrl = `data:image/png;base64,${Buffer.from(logo).toString('base64')}`
    const render = (avatarImage: string | null) => new ImageResponse(
      <ProfileSocialCard data={data} template={templateUrl} avatar={avatarImage} logo={logoUrl} />,
      { width: PROFILE_CARD_WIDTH, height: PROFILE_CARD_HEIGHT, fonts: [{ name: 'Barlow Condensed', data: font, weight: 700, style: 'normal' }] },
    ).arrayBuffer()
    let png: ArrayBuffer
    try { png = await render(avatar) } catch (error) {
      if (!avatar) throw error
      console.warn('Profile avatar rendering failed', { error: error instanceof Error ? error.message : 'Unknown error' })
      // A corrupt or unsupported avatar must not break the person's preview.
      png = await render(null)
    }
    const response = new Response(png, { headers: {
      'Content-Type': 'image/png', 'Cache-Control': `public, max-age=${PROFILE_CARD_TTL}`,
      'X-Content-Type-Options': 'nosniff',
    } })
    if (cache) {
      const { ctx } = await getCloudflareContext({ async: true })
      ctx.waitUntil(cache.put(cacheKey, response.clone()).catch(() => console.warn('Profile image cache write failed')))
    }
    return response
  } catch (error) {
    console.error('Profile image rendering failed', { username, error: error instanceof Error ? error.message : 'Unknown error' })
    // A transient rendering failure uses the existing site card, without caching the redirect.
    return new Response(null, { status: 302, headers: { Location: `${SITE_ORIGIN}/social/no-pushups-no-code-og-v3.png`, 'Cache-Control': 'no-store' } })
  }
}
