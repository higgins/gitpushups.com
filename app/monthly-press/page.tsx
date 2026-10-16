import Link from 'next/link'
import post from '@/content/monthly-press/2026-10.json'

export const metadata = { title: 'The Monthly Press · GitPushups' }

export default function MonthlyPressPage() {
  const issueDate = new Date(`${post.month}-01T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  })
  return <main className="content-page">
    <h1 className="page-heading">The Monthly Press</h1>
    <p>Updates from Justin on Git Pushups and the developers getting stronger together.</p>
    <Link className="monthly-press-issue" href="/monthly-press/october-2026">
      <img src="/newsletter-assets/2026-10/assets/banner-halloween.png" alt="Git Pushups Halloween banner" />
      <h2>{issueDate}</h2>
      <p>Free features, Apple Watch, flexible schedules, and a fresh website.</p>
      <span>Read the October update →</span>
    </Link>
  </main>
}
