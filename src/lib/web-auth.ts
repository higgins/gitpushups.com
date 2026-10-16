import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export const API_ORIGIN = process.env.GITPUSHUPS_API_URL || 'https://api.gitpushups.com'
export const SESSION_SECONDS = 7 * 24 * 60 * 60
const production = process.env.NODE_ENV === 'production'
export const SESSION_COOKIE = production ? '__Host-gitpushups-session' : 'gitpushups-session'
export const FLOW_COOKIE = production ? '__Host-gitpushups-oauth' : 'gitpushups-oauth'
export const cookieOptions = { httpOnly: true, secure: production, sameSite: 'lax' as const, path: '/' }

export async function authConfig() {
  const response = await fetch(`${API_ORIGIN}/auth/web`, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('Signup unavailable')
  const value = await response.json() as { clientId?: unknown; redirectUri?: unknown } | null
  if (!value || typeof value.clientId !== 'string' || typeof value.redirectUri !== 'string') throw new Error('Invalid auth configuration')
  return value as { clientId: string; redirectUri: string }
}

function randomToken() {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url')
}

function privateRedirect(url: URL | string) {
  const response = NextResponse.redirect(url, 303)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}

function fail(request: NextRequest, reason: string) {
  const response = privateRedirect(new URL(`/signup?error=${reason}`, request.url))
  response.cookies.set(FLOW_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  return response
}

export async function startLogin(request: NextRequest) {
  try {
    const settings = await authConfig()
    if (settings.redirectUri !== `${request.nextUrl.origin}/auth/callback`) return fail(request, 'configuration')
    const state = randomToken(), verifier = randomToken()
    const challenge = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))).toString('base64url')
    const authorize = new URL('https://github.com/login/oauth/authorize')
    authorize.search = new URLSearchParams({ client_id: settings.clientId, redirect_uri: settings.redirectUri,
      scope: 'read:user user:email', state, code_challenge: challenge, code_challenge_method: 'S256' }).toString()
    const response = privateRedirect(authorize)
    response.cookies.set(FLOW_COOKIE, Buffer.from(JSON.stringify({ state, verifier, createdAt: Date.now() })).toString('base64url'), { ...cookieOptions, maxAge: 600 })
    return response
  } catch { return fail(request, 'unavailable') }
}

export async function finishLogin(request: NextRequest) {
  const params = request.nextUrl.searchParams
  if (params.has('error')) return fail(request, 'cancelled')
  const state = params.get('state'), code = params.get('code')
  try {
    const raw = request.cookies.get(FLOW_COOKIE)?.value
    if (!raw || !state || !code || code.length > 512) return fail(request, 'expired')
    const flow = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    if (typeof flow.state !== 'string' || typeof flow.verifier !== 'string' || !/^[\w-]{43}$/.test(flow.verifier) ||
      typeof flow.createdAt !== 'number' || Date.now() - flow.createdAt > 600000 || flow.createdAt > Date.now() ||
      Buffer.byteLength(state) !== Buffer.byteLength(flow.state) || !timingSafeEqual(Buffer.from(state), Buffer.from(flow.state))) return fail(request, 'expired')
    const settings = await authConfig()
    if (settings.redirectUri !== `${request.nextUrl.origin}/auth/callback`) return fail(request, 'configuration')
    const exchange = await fetch(`${API_ORIGIN}/auth/web`, {
      method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, codeVerifier: flow.verifier, redirectUri: settings.redirectUri }), signal: AbortSignal.timeout(30000),
    })
    if (!exchange.ok) return fail(request, 'failed')
    const result = await exchange.json() as { token?: unknown; expiresIn?: unknown } | null
    if (!result || typeof result.token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(result.token) || result.token.length > 3500 || result.expiresIn !== SESSION_SECONDS) return fail(request, 'failed')
    const response = privateRedirect(new URL('/account', request.url))
    response.cookies.set(FLOW_COOKIE, '', { ...cookieOptions, maxAge: 0 })
    response.cookies.set(SESSION_COOKIE, result.token, { ...cookieOptions, maxAge: SESSION_SECONDS })
    return response
  } catch { return fail(request, 'failed') }
}

export async function signOut(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return new NextResponse('Invalid origin', { status: 403 })
  const response = privateRedirect(new URL('/', request.url))
  response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  response.cookies.set(FLOW_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  return response
}
