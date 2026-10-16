import Link from 'next/link'
import post from '@/content/monthly-press/2026-10.json'

const description = 'Free features, Apple Watch, flexible schedules, and a fresh website. October’s update from Justin at Git Pushups.'

export const metadata = {
  title: post.title,
  description,
  alternates: { canonical: post.url },
  openGraph: { title: post.title, description, url: post.url, type: 'article' },
}

export default function OctoberMonthlyPress() {
  return <main className="content-page monthly-press-post">
    <Link className="monthly-press-back" href="/monthly-press">← The Monthly Press</Link>
    <article>
      <header>
        <h1 className="page-heading">{post.title}</h1>
        <img className="monthly-press-banner" src="/newsletter-assets/2026-10/assets/banner-halloween.png" alt="Git Pushups logo beside the pushup mascot wearing a jack-o-lantern hat" width={1200} height={400} />
      </header>
      {/* Generated from the trusted newsletter issue, with raw HTML disabled. */}
      <div className="monthly-press-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  </main>
}
