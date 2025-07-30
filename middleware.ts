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

    // If `?d=` param is present, return JSON response from external API
    if (localDate) {
      const apiUrl = `https://api.gitpushups.com/user/${username}?local_date=${encodeURIComponent(localDate)}`

      try {
        const res = await fetch(apiUrl, {
          headers: { 'Accept': 'application/json' },
          // edge runtime: must set cache policy explicitly
          cache: 'no-store',
        })

        if (!res.ok) {
          return new NextResponse('false', { status: 200 })
        }

        const data = await res.json() as any;
        const didPushups = data?.didPushupsToday === true ? 'true' : 'false'

        return new NextResponse(didPushups, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      } catch (err) {
        return new NextResponse('false', { status: 200 })
      }
    }

    // If no `?d`, rewrite to internal /u/[username] page
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
