import Image from 'next/image'
import { HeroAccountButton } from './HeroAccountButton'
import { AnimatedCount } from './AnimatedCount'
import { HeroCommunity } from './HeroCommunity'

export function CommunityPushupTotal({ total }: { total: number | null }) {
  return <strong className="hero-total">
    {total === null ? <><span className="sr-only">Total temporarily unavailable. </span>pushups</> : <><AnimatedCount value={total} /> pushups</>}
  </strong>
}

export function HeroAnimationSlot() {
  return <div className="hero-animation-slot">
    <div className="hero-art-frame">
      <Image src="/hero/office-pushups-no-grid.gif" alt="The red GitPushups character doing pushups beside a blocked commit while developers work in an office." unoptimized width={1902} height={828} sizes="(max-width: 600px) 1px, 850px" />
    </div>
  </div>
}

export function HeroSection({ total }: { total: number | null }) {
  return <section className="hero-section section-divider" aria-labelledby="hero-title">
    <div className="hero-copy">
      <h1 id="hero-title" className="hero-headline">Do pushups...<br />or we block<br />your commits.</h1>
      <p className="hero-subtitle">Join developers who have built a pushup habit into their coding routine and logged <CommunityPushupTotal total={total} /> during their workday. <span className="hero-assurance">All free and no ad spam.</span></p>
      <div className="hero-actions">
        <HeroAccountButton />
      </div>
    </div>
    <HeroAnimationSlot />
    <HeroCommunity />
  </section>
}
