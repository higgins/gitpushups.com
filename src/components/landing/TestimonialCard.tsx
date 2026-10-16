import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Testimonial } from '@/lib/testimonials'
import { TestimonialSourceMark } from './TestimonialSourceMark'

export function TestimonialCard({ testimonial, duplicate = false }: { testimonial: Testimonial; duplicate?: boolean }) {
  return <a className="testimonial-card" data-platform={testimonial.platform} href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}
    aria-label={`${testimonial.author} on ${testimonial.source}: “${testimonial.quote}” Read the original (opens in a new tab).`}>
    <figure>
      <div className="testimonial-source">
        <span><TestimonialSourceMark platform={testimonial.platform} />{testimonial.source}</span>
        <ArrowUpRight className="testimonial-source-arrow" size={17} aria-hidden="true" />
      </div>
      <blockquote cite={testimonial.sourceUrl}>“{testimonial.quote}”</blockquote>
      <figcaption>
        {testimonial.avatar
          ? <Image className="testimonial-avatar" src={testimonial.avatar} alt={`${testimonial.author}’s profile image`} width={44} height={44} />
          : <span className="testimonial-avatar testimonial-initials" aria-hidden="true">{testimonial.initials}</span>}
        <span>
          <span className="testimonial-author">{testimonial.author}</span>
          <span className="testimonial-author-detail">{testimonial.authorDetail}</span>
        </span>
      </figcaption>
    </figure>
  </a>
}
