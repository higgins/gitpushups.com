import { Buffer } from 'buffer'
import { HeroSection } from '@/components/landing/HeroSection'
import { InstallationSection } from '@/components/landing/InstallationSection'
import { WhyItWorksSection } from '@/components/landing/WhyItWorksSection'
import { ProgressSection } from '@/components/landing/ProgressSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CommunitySection } from '@/components/landing/CommunitySection'
import { getCommunityStats } from '@/lib/community'

export default async function LandingPage({ searchParams }: { searchParams?: { shareId?: string } }) {
  if (searchParams?.shareId) {
    try {
      const username = Buffer.from(searchParams.shareId, 'base64').toString('utf8')
      if (/^[a-zA-Z0-9-]{1,39}$/.test(username)) await fetch('https://api.gitpushups.com/shareLink', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), signal: AbortSignal.timeout(5000),
      })
    } catch { console.error('Failed to record share link') }
  }
  const stats = await getCommunityStats()
  return <main className="landing-page page-container" id="main-content">
    <HeroSection {...stats} />
    <InstallationSection />
    <WhyItWorksSection />
    <ProgressSection />
    <CommunitySection />
    <FaqSection />
  </main>
}
