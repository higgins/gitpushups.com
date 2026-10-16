'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Testimonial } from '@/lib/testimonials'
import { TestimonialCard } from './TestimonialCard'

export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    const onVisibilityChange = () => setHidden(document.hidden)
    observer.observe(element)
    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  if (!testimonials.length) return null
  // Four cards fill even the widest page container; smaller sets stay scrollable.
  const looping = testimonials.length >= 4
  return <div className="testimonial-marquee" data-looping={looping} data-paused={!visible || hidden}>
    <p id={`${id}-help`} className="sr-only">Focus this row to stop the animation and scroll through the quotes. Each card links to its original source.</p>
    <div ref={viewport} id={id} className="testimonial-window" role="region" aria-label="Community testimonials" aria-describedby={`${id}-help`} tabIndex={0}
      onBlur={event => {
        // Keyboard navigation uses a static scroller. Clear its offset before looping again.
        if (looping && !event.currentTarget.contains(event.relatedTarget) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          event.currentTarget.scrollLeft = 0
        }
      }}>
      <div className="testimonial-track">
        <ul className="testimonial-group">
          {testimonials.map(testimonial => <li key={testimonial.id}><TestimonialCard testimonial={testimonial} /></li>)}
        </ul>
        {looping && <ul className="testimonial-group testimonial-group-copy" aria-hidden="true">
          {testimonials.map(testimonial => <li key={testimonial.id}><TestimonialCard testimonial={testimonial} duplicate /></li>)}
        </ul>}
      </div>
    </div>

  </div>
}
