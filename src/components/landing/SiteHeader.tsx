import Link from 'next/link'
import { GitHubRepoLink } from './GitHubRepoLink'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/web-auth'

export function SiteHeader() {
  return <header className="site-header">
    <div className="page-container header-content">
      <Link href="/" className="brand-link" aria-label="GitPushups home">
        <img src="/logo.webp" width={116} height={90} alt="GitPushups" fetchPriority="high" />
      </Link>
      <div className="header-actions">
        <GitHubRepoLink />
      {cookies().has(SESSION_COOKIE) ? <Link className="github-signup" href="/account">Your setup</Link> : null}
      </div>
    </div>
  </header>
}
