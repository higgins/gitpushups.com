import type { TestimonialPlatform } from '@/lib/testimonials'

export function TestimonialSourceMark({ platform }: { platform: TestimonialPlatform }) {
  return <svg className="testimonial-source-mark" viewBox="0 0 24 24" width={24} height={24} aria-hidden="true">
    {platform === 'app-store' && <>
      <rect width="24" height="24" rx="5" fill="currentColor" />
      <path d="m10 5 8 14M14 5 6 19M5 15h14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </>}
    {platform === 'product-hunt' && <>
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="M8.5 18V6h5a4 4 0 0 1 0 8h-2.5v4Zm2.5-6.5h2.5a1.5 1.5 0 0 0 0-3H11Z" fill="white" />
    </>}
    {platform === 'linkedin' && <>
      <rect width="24" height="24" rx="3" fill="currentColor" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="white" />
      <path d="M5 10h3v9H5zm5 0h3v1.3c.7-1.1 1.7-1.6 3-1.6 2.4 0 3.5 1.5 3.5 4V19h-3v-4.7c0-1.3-.4-2.1-1.6-2.1-1.3 0-1.9.9-1.9 2.3V19h-3Z" fill="white" />
    </>}
    {platform === 'x' && <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.4l7.2-8.3L.8 2h6.4l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" fill="currentColor" />}
  </svg>
}
