import Image from 'next/image'
import type { CommunityMember } from '@/lib/community'
import { HeroAccountButton } from './HeroAccountButton'
import { AnimatedCount } from './AnimatedCount'

const HERO_MEMBERS: CommunityMember[] = ['higgins', 'LoganWeir', 'runtologist', 'Tristarnus', 'caplis'].map(login => ({
  login,
  avatarUrl: `https://github.com/${login}.png`,
}))

export function UserAvatarStack({ members }: { members: CommunityMember[] }) {
  if (!members.length) return null
  return <ul className="avatar-stack" aria-label="Developers doing the reps">
    {members.map(member => <li key={member.login}>
      <a href={`https://github.com/${member.login}`} title={`@${member.login}`}>
        <img src={`${member.avatarUrl}${member.avatarUrl.includes('?') ? '&' : '?'}s=96`} alt={`@${member.login}`} width={48} height={48} />
      </a>
    </li>)}
  </ul>
}

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
        <UserAvatarStack members={HERO_MEMBERS} />
        <HeroAccountButton />
      </div>
    </div>
    <HeroAnimationSlot />
  </section>
}
