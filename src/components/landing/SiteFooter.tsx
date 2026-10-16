import Link from 'next/link'
import { AppStoreBadge } from '@/components/AppStore'
import { PlayStoreBadge } from '@/components/PlayStore'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-stores'
import { getCurrentWebUser } from '@/lib/current-web-user'
import { SUPPORT_PAYMENT_URL } from '@/lib/support'

export async function SiteFooter() {
  const { user } = await getCurrentWebUser()
  return <footer className="site-footer">
    <div className="page-container">
      <div className="footer-downloads">
      <AppStoreBadge appStoreUrl={APP_STORE_URL} />
      <Link href="/" className="footer-brand" aria-label="GitPushups home">
        <img src="/logo.webp" width={116} height={90} alt="GitPushups" />
      </Link>
      <PlayStoreBadge appStoreUrl={PLAY_STORE_URL} />
      </div>
      <nav aria-label="Footer">
        <a href="https://github.com/higgins/gitpushups.com">GitHub</a>
        <Link href="/faq">FAQ</Link>
        <a href={SUPPORT_PAYMENT_URL}>Support This Project</a>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        {user && <form action="/auth/logout" method="post">
          <button className="footer-logout" type="submit">Log out</button>
        </form>}
      </nav>
    </div>
  </footer>
}
