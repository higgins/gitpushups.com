import Link from 'next/link'
import { GitHubRepoLink } from './GitHubRepoLink'
import { getCurrentWebUser } from '@/lib/current-web-user'

export async function SiteHeader() {
  const { user } = await getCurrentWebUser()
  return <header className="site-header">
    <div className="page-container header-content">
      <Link href="/" className="brand-link" aria-label="GitPushups home">
        <img src="/logo.webp" width={116} height={90} alt="GitPushups" fetchPriority="high" />
      </Link>
      <div className="header-actions">
        <GitHubRepoLink />
        {user && <Link className="header-profile" href={`/@${user.login}`} aria-label={`View @${user.login}’s profile`} title={`@${user.login}`}>
          <img src={user.avatarUrl || `https://github.com/${user.login}.png?size=84`} width={42} height={42} alt="" />
        </Link>}
      </div>
    </div>
  </header>
}
