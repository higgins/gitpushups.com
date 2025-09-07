import { NextResponse } from 'next/server'

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


  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="Reps: ${totalText}">\n  <linearGradient id="badge-right" x1="0" y1="0" x2="0" y2="100%"><stop stop-color="#FC803F" offset="0%"/><stop stop-color="#EA1A72" offset="100%"/></linearGradient>\n  <title>Reps: ${totalText}</title>\n  <rect width="${labelWidth}" height="20" fill="#555"/>\n  <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="url(#badge-right)"/>\n  <image x="5" y="3" width="14" height="14" href="https://gitpushups.com/favicon.ico?cachebust=1"/>\n  <text x="23" y="14" fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">Reps</text>\n  <text x="${labelWidth + 5}" y="14" fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">${totalText}</text>\n</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
}
