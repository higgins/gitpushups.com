import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { API_ORIGIN, SESSION_COOKIE } from '@/lib/web-auth'
import { InstallationSection } from '@/components/landing/InstallationSection'
import { ProgressSection } from '@/components/landing/ProgressSection'

export const metadata = { title: 'Your setup · GitPushups', robots: { index: false, follow: false } }

export default async function AccountPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) redirect('/signup')
  let response: Response
  try {
    response = await fetch(`${API_ORIGIN}/protected/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000) })
  } catch { return <main className="content-page"><h1 className="page-heading">We’ll be right back.</h1><p>Your account couldn’t be loaded. Please refresh in a moment.</p></main> }
  if (response.status === 401 || response.status === 404) redirect('/signup?error=expired')
  if (!response.ok) return <main className="content-page"><p role="alert">Your account couldn’t be loaded. Please refresh in a moment.</p></main>
  const { user } = await response.json() as { user?: { login?: unknown; avatarUrl?: unknown } }
  if (typeof user?.login !== 'string' || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(user.login)) redirect('/signup?error=failed')
  return <main className="page-container">
    <div className="account-summary">
      {typeof user.avatarUrl === 'string' && user.avatarUrl.startsWith('https://avatars.githubusercontent.com/') && <img src={user.avatarUrl} alt="" width={56} height={56} />}
      <div><h1>You’re in, @{user.login}.</h1><p>Install your hook, then sign into the app with the same GitHub account to record your reps.</p></div>
      <form action="/auth/logout" method="post"><button className="secondary-button" type="submit">Sign out</button></form>
    </div>
    <InstallationSection username={user.login} />
    <ProgressSection />
  </main>
}
