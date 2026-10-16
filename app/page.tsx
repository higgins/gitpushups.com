import { Buffer } from 'buffer'
import { HeroSection } from '@/components/landing/HeroSection'
import { InstallationSection } from '@/components/landing/InstallationSection'
import { WhyItWorksSection } from '@/components/landing/WhyItWorksSection'
import { ProgressSection } from '@/components/landing/ProgressSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CommunitySection } from '@/components/landing/CommunitySection'
import { getCommunityStats } from '@/lib/community'
import { getCurrentWebUser } from '@/lib/current-web-user'
import { getFrequency, PUSHUP_FREQUENCIES } from '@/lib/installation'
import { LandingExperience } from '@/components/landing/LandingExperience'

export default async function LandingPage({ searchParams }: { searchParams?: { shareId?: string; frequency?: string; welcome?: string; signin?: string } }) {
  if (searchParams?.shareId) {
    try {
      const username = Buffer.from(searchParams.shareId, 'base64').toString('utf8')
      if (/^[a-zA-Z0-9-]{1,39}$/.test(username)) await fetch('https://api.gitpushups.com/shareLink', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), signal: AbortSignal.timeout(5000),
      })
    } catch { console.error('Failed to record share link') }
  }
  const [stats, session] = await Promise.all([getCommunityStats(), getCurrentWebUser()])
  const frequency = getFrequency(searchParams?.frequency || null) || PUSHUP_FREQUENCIES[0]
  return <LandingExperience user={session.user} initialFrequency={frequency.id} welcome={searchParams?.welcome === '1'} authError={searchParams?.signin || (searchParams?.welcome === '1' ? session.error : undefined)}>
  <main className="landing-page page-container" id="main-content">
    <HeroSection {...stats} />
    <InstallationSection />
    <WhyItWorksSection />
    <ProgressSection />
    <CommunitySection />
    <FaqSection />
  </main>
  </LandingExperience>
}
