import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export interface CommunityUpdate {
  title: string
  href: string
  image?: string
}

export function CommunityUpdateCard({ update }: { update?: CommunityUpdate }) {
  return <Link className="community-update-card" href={update?.href ?? '/monthly-press'}>
    <div className="community-update-image" aria-hidden="true">{update?.image && <img src={update.image} alt="" />}</div>
    <div className="community-update-copy">
      <p className="community-update-label">Latest community update</p>
      <h3>{update?.title ?? 'Our next update is on its way.'}</h3>
      <span className="community-update-link">{update ? 'Read update' : 'Community updates'}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </div>
  </Link>
}
