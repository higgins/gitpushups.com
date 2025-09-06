import { NextResponse } from 'next/server'

const ICON_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADIElEQVR4AaSSfUzMARjHv7/f7667uuvXoRdCp0iuqJOVkLUMG5eXQ/hH3pvXbF6GTWOmxMpbWOSU9TKrVqiESqXSitLtKlZZdep6Wa/XdafuzXXzB2Jsnj3PP8+e57PP9jwk/jP+CEhDMDVef+NPAAzwdvFuWAc8KuB3ql5ObVNG0f45l+ilOa/ptWGNnGDhr8AJgDhd830ialtIcMJF9oHcOKvKIL7oY7C7KHO/4GYssznZaDL7EfITYJi7265jDkcs9PTEtdt3IJXJsMTHB4u8vHA4NBSjs209+idbuP0W8Ji7OnQjq0JeYuxlODjYw0MgwDy3uXCb64qqmho0NjWjnqHBKl15XTRn+UPjdxOzQQu9fXEFNXRbvH8HOz4+DrK6OlAkib2HjuCeJAFqjQbpWVmIvhUDnbsjUcjs251nrTo5bkKqp4RMT4D8xT69K9NGwEdLWxsI07K3UIiTYUexQSTCiaNHoNVqzf3MlCSsIKZBSgxfLnVasY6U6NrCArS2vHZiCDNd+IiJjUVUzHW4OM/CMj8/VFW/B4OiEODvj8xn2ejs6gYLY9jMsCdesRXhpJ4wfO1kqjHG0EK0fiPEQUEYUipRVPIGW3fuNBuFhh1DSlo6yt5WYN3mTeihhzHIHcEIQ6siAxl21Uro4GGgIWCzscTXF+0KBXwXeSM6MgLepgtcCj+H1IcPzD0vLgUfKyv0WYxglhVVQXrybfP6LDQdNhQJppHCiFqNxLi7yC8qhrOTE3xMoJpaKYpLy+C1YD4msQjYcQ2QsfoNIQ60hMxukm/pJ0endVmqcIpywfldB5B67iJyJYl4mvscktPHjS2p8Z0ZkeGIPH0cK2kO7CbpoWKNkim9g4dIPVPPsCQIVZqhQ1dpHChbw6Kl8YT9whPWNmd6JbFP7vCnzk/+JHdMcOfO2OPMeddu0JRnjPYMKy01StJapyXFfflJEd01vIPEDJsrCunyiC8yoX1Dfu2O+g9XrtZ9FrsWVjbAFLbp0o6z5a2+UZVyf79A58nXyxW8gwWtZ82PRIAwOiqy1aa5f8rAC8U6AjCOD38DAAD//zjyBnIAAAAGSURBVAMA+Ew0MBHD4tkAAAAASUVORK5CYII='

export const dynamic = 'force-dynamic'

export async function GET() {
  let total: number | null = null
  try {
    const res = await fetch('https://api.gitpushups.com/totalPushups', {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = (await res.json()) as { total?: number }
      if (typeof data.total === 'number') {
        total = data.total
      }
    }
  } catch (err) {
    console.error('Failed to fetch total pushups', err)
  }

  const totalText = total !== null ? total.toLocaleString() : 'N/A'
  const labelWidth = 60
  const valueWidth = Math.max(20, totalText.length * 7 + 10)
  const width = labelWidth + valueWidth


  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="Reps: ${totalText}">\n  <linearGradient id="badge-right" x1="0" y1="0" x2="0" y2="100%"><stop stop-color="#FC803F" offset="0%"/><stop stop-color="#EA1A72" offset="100%"/></linearGradient>\n  <title>Reps: ${totalText}</title>\n  <rect width="${labelWidth}" height="20" fill="#555"/>\n  <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="url(#badge-right)"/>\n  <image x="5" y="3" width="14" height="14" href="https://gitpushups.com/favicon.ico"/>\n  <text x="23" y="14" fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">Reps</text>\n  <text x="${labelWidth + 5}" y="14" fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">${totalText}</text>\n</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
}
