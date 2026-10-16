import Link from 'next/link'

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="page-container">
      <Link href="/" className="footer-brand" aria-label="GitPushups home">
        <img src="/logo.webp" width={116} height={90} alt="GitPushups" />
      </Link>
      <nav aria-label="Footer">
        <a href="https://github.com/higgins/gitpushups.com">GitHub</a>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </div>
  </footer>
}
