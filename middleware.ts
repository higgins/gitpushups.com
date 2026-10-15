import { NextResponse, type NextRequest } from 'next/server'

const RESERVED_PATHS = ['api', 'u', 'terms', 'privacy', '_next', 'favicon.ico']

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const path = url.pathname

  if (path.startsWith('/@')) {
    const usernamePath = path.slice(2)
    const segments = usernamePath.split('/')
    const username = segments[0]
    const restOfPath = segments.slice(1).join('/')

    if (RESERVED_PATHS.includes(username)) {
      return NextResponse.next()
    }

    const localDate = url.searchParams.get('d')
    const interval = url.searchParams.get('interval_seconds')
    const reply = (allowed: boolean) => new NextResponse(allowed ? 'true' : 'false', {
      status: 200,
      headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
    })

    if (localDate !== null || interval !== null) {
      // Reject ambiguous/invalid hook requests rather than rendering a profile page.
      if ((localDate !== null && interval !== null) ||
          url.searchParams.getAll('d').length > 1 ||
          url.searchParams.getAll('interval_seconds').length > 1 ||
          !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username) || restOfPath) return reply(false)
      if (interval !== null && (!/^\d+$/.test(interval) || Number(interval) < 300 || Number(interval) > 2147483647)) return reply(false)
      if (localDate !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(localDate) || !Number.isFinite(Date.parse(localDate)) || new Date(localDate).toISOString().slice(0, 10) !== localDate)) return reply(false)
      const apiUrl = new URL(`https://api.gitpushups.com/user/${encodeURIComponent(username)}${interval !== null ? '/push-permission' : ''}`)
      apiUrl.searchParams.set(interval !== null ? 'interval_seconds' : 'local_date', interval ?? localDate!)
      try {
        const res = await fetch(apiUrl, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })
        if (!res.ok) return reply(false)
        const data = await res.json() as { allowed?: unknown; didPushupsToday?: unknown } | null
        return reply((interval !== null ? data?.allowed : data?.didPushupsToday) === true)
      } catch {
        return reply(false)
      }
    }

    // Ordinary profile requests still render the profile page.
    const rewriteUrl = new URL(`/u/${username}/${restOfPath}`, request.url)
    rewriteUrl.search = url.search

    return NextResponse.rewrite(rewriteUrl, {
      headers: new Headers(request.headers),
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/@:path*'],
}
