import { COMMUNITY_TESTIMONIALS, type Testimonial } from '@/lib/testimonials'
import { TestimonialMarquee } from './TestimonialMarquee'
import { CommunityUpdateCard, type CommunityUpdate } from './CommunityUpdateCard'

export function CommunitySection({ testimonials = COMMUNITY_TESTIMONIALS, latestUpdate }: { testimonials?: Testimonial[]; latestUpdate?: CommunityUpdate }) {
  return <section className="community-section" aria-labelledby="community-title">
    <h2 id="community-title" className="page-heading">Active community</h2>
    <div className="community-columns">
      <TestimonialMarquee testimonials={testimonials} />
      <CommunityUpdateCard update={latestUpdate} />
    </div>
  </section>
}
