import { getUserStatus } from '@/lib/api'
import { InstallationTabs } from '@/components/landing/InstallationSection'
import { ContributionsGraph } from '@/components/profile/ContributionsGraph'
import { getCurrentWebUser } from '@/lib/current-web-user'
import { getUserContributions } from '@/lib/user-contributions'
import { PUSHUP_FREQUENCIES } from '@/lib/installation'
import { notFound } from 'next/navigation'
interface Params {
  params: {
    username: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}
export const dynamic = 'force-dynamic'

export default async function UserPage({ params, searchParams }: Params) {
  const d = typeof searchParams.d === 'string' ? searchParams.d : undefined
  const [status, session] = await Promise.all([getUserStatus(params.username, d), getCurrentWebUser()])
  if (!status) {
    notFound()
  }
  const { user, didPushupsToday, localDate } = status
  const today = localDate || new Date().toISOString().slice(0, 10)
  const year = Number(today.slice(0, 4))
  const contributions = await getUserContributions(user.username, year)
  return (
    <main className="profile-page page-container">
      <div className="profile-overview">
        <header className="profile-heading">
          <img className="profile-avatar" src={user.avatarUrl} alt="" width={64} height={64} />
          <div><h1 className="page-heading"><a href={`https://github.com/${user.username}`} target="_blank" rel="noopener noreferrer" aria-label={`@${user.username} on GitHub (opens in a new tab)`}>@{user.username}</a></h1><p className="profile-subtitle">{didPushupsToday ? <>has done pushups today <span aria-hidden="true">✅</span></> : <>has not done pushups today <span aria-hidden="true">❌</span></>}</p></div>
        </header>
        {contributions ? <ContributionsGraph year={year} contributions={contributions} today={today} /> : <p className="profile-contributions-error">Contribution history couldn’t load. Please refresh to try again.</p>}
      </div>
      <section className="profile-setup" aria-labelledby="profile-setup-title">
        <div><h2 className="page-heading" id="profile-setup-title">Build your own<br />pushup habit.</h2><p className="section-intro">Add a few reps to your coding routine. Set up your own daily check with your agent or a Git hook.</p></div>
        <InstallationTabs frequency={PUSHUP_FREQUENCIES[0]} username={session.user?.login} />
      </section>
    </main>
  )
}
