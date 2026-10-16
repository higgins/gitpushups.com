import Link from 'next/link'

export const metadata = { title: 'Support · GitPushups' }

export default function SupportPage() {
  return <main className="content-page">
    <h1 className="page-heading">Thanks for your support.</h1>
    <p>GitPushups is free forever. A way to support the project here is coming soon.</p>
    <p>In the meantime, <a href="https://github.com/higgins/gitpushups.com">give us a star on GitHub</a>, share it with a friend, or <a href="https://github.com/higgins/gitpushups.com/issues">send a bug report or feature idea</a>.</p>
    <Link className="secondary-button" href="/">Back to GitPushups</Link>
  </main>
}
