import { FaqItems } from '@/components/FaqItems'

export const metadata = { title: "FAQ · GitPushups" }

export default function FAQPage() {
  return <main className="content-page">
    <section id="faq">
      <h1 className="page-heading text-4xl lg:text-5xl mb-8">FAQ</h1>
      <FaqItems />
    </section>
  </main>
}
