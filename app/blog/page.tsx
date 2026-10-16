import Link from 'next/link'

export const metadata = { title: 'Community stories · GitPushups' }

export default function BlogPage() {
  return <main className="content-page"><p className="eyebrow">The GitPushups blog</p><h1 className="page-heading">Stories from the reps.</h1><p>We’re putting together stories from developers building a little movement into their day. Check back for our first post.</p><Link className="text-link" href="/">Back to GitPushups</Link></main>
}
