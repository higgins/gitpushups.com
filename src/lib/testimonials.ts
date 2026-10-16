export type TestimonialPlatform = 'app-store' | 'product-hunt' | 'linkedin' | 'x'

export interface Testimonial {
  id: string
  quote: string
  author: string
  initials: string
  avatar?: string
  authorDetail: string
  platform: TestimonialPlatform
  source: string
  sourceUrl: string
}

// Public excerpts collected in “Find Git Pushups testimonials”:
// codex://threads/01a140ea-0ed6-7c93-a430-023dc2be4990
// Keep the original wording and source attribution when editing these cards.
export const COMMUNITY_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tradiopen-app-store',
    quote: 'It makes sense to bake it into something I do everyday: writing code. I’m getting stronger!',
    author: 'tradiopen',
    initials: 'T',
    authorDetail: 'App Store reviewer',
    platform: 'app-store',
    source: 'App Store',
    sourceUrl: 'https://apps.apple.com/us/app/git-pushups/id6747657596',
  },
  {
    id: 'ahyoung-kim-product-hunt',
    quote: 'Git Pushups helps me integrate fitness into my daily workflow.',
    author: 'Ahyoung Kim',
    initials: 'AK',
    avatar: '/testimonials/ahyoung-kim.jpg',
    authorDetail: '@ahyoung_kim1',
    platform: 'product-hunt',
    source: 'Product Hunt',
    sourceUrl: 'https://www.producthunt.com/products/git-pushups/reviews#DetailedReview-373245',
  },
  {
    id: 'logan-weir-linkedin',
    quote: 'Shoutout to Git Pushups for getting me up from my desk everyday!',
    author: 'Logan Weir',
    initials: 'LW',
    avatar: '/testimonials/logan-weir.jpg',
    authorDetail: 'Technical Lead',
    platform: 'linkedin',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/posts/loganweir_shoutout-to-git-pushups-for-getting-me-up-share-7422674998038835200-Cjtf/',
  },
  {
    id: 'clau-design-feedback',
    quote: 'First i love the design, the colors this is crazy good, you are top 1% vibes',
    author: 'Clau',
    initials: 'C',
    avatar: '/testimonials/clau.jpg',
    authorDetail: '@ClarkTota',
    platform: 'x',
    source: 'X',
    sourceUrl: 'https://x.com/ClarkTota/status/1968672962740953185',
  },
]
