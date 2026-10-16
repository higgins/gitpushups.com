import { FaqItems } from '@/components/FaqItems'

export function FaqSection() {
  return <section id="faq" className="faq-section section-divider" aria-labelledby="faq-title">
    <h2 id="faq-title" className="page-heading">FAQ</h2>
    <FaqItems landing />
  </section>
}
