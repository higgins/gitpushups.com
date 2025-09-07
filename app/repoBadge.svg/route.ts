import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const LOGO_BASE64 = 'data:image/png;base64,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';

export async function GET() {
  let total: number | null = null

  try {
    // Fetch the total reps
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
    console.error('Failed to fetch data', err)
  }

  const totalText = total !== null ? total.toLocaleString() : 'N/A'
  const labelWidth = 60
  const valueWidth = Math.max(20, totalText.length * 7 + 10)
  const width = labelWidth + valueWidth

  const svg = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="Reps: ${totalText}">
  <defs>
    <linearGradient id="badge-right" x1="0" y1="0" x2="0" y2="100%">
      <stop stop-color="#FC803F" offset="0%"/>
      <stop stop-color="#EA1A72" offset="100%"/>
    </linearGradient>
  </defs>

  <title>Reps: ${totalText}</title>

  <!-- Left (label) background -->
  <rect width="${labelWidth}" height="20" fill="#555"/>

  <!-- Right (value) background with gradient -->
  <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="url(#badge-right)"/>

  <!-- Icon -->
  <image
    x="5"
    y="3"
    width="14"
    height="14"
    href="${LOGO_BASE64}"
  />

  <!-- Label text -->
  <text
    x="23"
    y="14"
    fill="#fff"
    font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
    font-size="11"
  >
    Reps
  </text>

  <!-- Value text -->
  <text
    x="${labelWidth + 5}"
    y="14"
    fill="#fff"
    font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
    font-size="11"
  >
    ${totalText}
  </text>
</svg>
`

  return new Response(svg.trim(), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
}
