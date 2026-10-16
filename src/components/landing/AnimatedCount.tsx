'use client'

import { useEffect, useState } from 'react'

const DURATION_MS = 900
const format = new Intl.NumberFormat('en-US')

export function AnimatedCount({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const startedAt = performance.now()

    function finish() {
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame)
        setDisplayed(value)
      }
    }

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / DURATION_MS, 1)
      // Fast at first, with a gradual slowdown and an exact final value.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(progress === 1 ? value : Math.floor(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    setDisplayed(0)
    if (reducedMotion.matches) finish()
    else frame = requestAnimationFrame(tick)
    reducedMotion.addEventListener('change', finish)
    return () => {
      cancelAnimationFrame(frame)
      reducedMotion.removeEventListener('change', finish)
    }
  }, [value])

  return <span className="animated-count">
    {/* Reserve the final width so the word beside the counter stays still. */}
    <span className="count-width" aria-hidden="true">{format.format(value)}</span>
    <span className="count-value" aria-hidden="true">{format.format(displayed)}</span>
    <span className="sr-only">{format.format(value)}</span>
    <noscript><style>{'.animated-count .count-value{display:none}.animated-count .count-width{visibility:visible}'}</style></noscript>
  </span>
}
