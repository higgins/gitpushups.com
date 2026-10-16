import { createAgentInstructions, getFrequency } from '@/lib/installation'

export function GET(request: Request) {
  const values = new URL(request.url).searchParams.getAll('frequency')
  const frequency = values.length > 1 ? undefined : getFrequency(values[0] ?? 'daily')
  if (!frequency) return new Response('Unknown frequency. Use daily, 8h, 4h, 1h, or 15m.', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  return new Response(createAgentInstructions(frequency), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  })
}
