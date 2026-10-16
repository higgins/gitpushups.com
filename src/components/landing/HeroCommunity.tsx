const MEMBERS = ['higgins', 'LoganWeir', 'runtologist', 'Tristarnus', 'caplis']

// An invitation wishlist, not endorsements or a claim about anyone's exercise habits.
const INVITE_LIST = [
  { login: 'ThePrimeagen', name: 'ThePrimeagen', label: 'Primeagen' },
  { login: 'marclou', name: 'Marc Lou', label: 'Marc Lou' },
  { login: 'cassidoo', name: 'Cassidy Williams', label: 'Cassidy Williams' },
  { login: 'stolinski', name: 'Scott Tolinski', label: 'Scott Tolinski' },
  { login: 'levelsio', name: 'Pieter Levels', label: 'Pieter Levels' },
  { login: 'Melkeydev', name: 'Melkey', label: 'Melkey' },
  { login: 't3dotgg', name: 'Theo Browne', label: 'Theo' },
  { login: 'wesbos', name: 'Wes Bos', label: 'Wes Bos' },
  { login: 'jlengstorf', name: 'Jason Lengstorf', label: 'Jason Lengstorf' },
  { login: 'codediodeio', name: 'Fireship (Jeff Delaney)', label: 'Fireship' },
]

function SketchedArrow() {
  return <svg className="hero-community-arrow" viewBox="0 0 112 96" fill="none" aria-hidden="true" focusable="false">
    <path d="M80 84C45 91 8 80 14 58C21 32 77 45 90 10M69 18L90 10L93 33" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M77 88C43 94 5 80 10 58C16 37 55 38 72 29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
  </svg>
}

export function HeroCommunity() {
  return <div className="hero-community" aria-label="The GitPushups community and our invitation wishlist">
    <div className="hero-community-members">
      <ul className="avatar-stack" aria-label="Developers doing the reps">
        {MEMBERS.map(login => <li key={login}>
          <a href={`https://github.com/${login}`} title={`@${login}`} aria-label={`@${login} on GitHub`}>
            <img src={`https://github.com/${login}.png?s=96`} alt="" width={48} height={48} />
          </a>
        </li>)}
      </ul>
      <p className="hero-community-caption">
        <SketchedArrow />
        These GitHub users do<br /><strong>pushups while coding.</strong>
      </p>
    </div>
    <div className="hero-community-invites">
      <ul className="hero-invite-list" aria-label="Developers we would love to invite">
        {INVITE_LIST.map(member => <li key={member.login}>
          <a href={`https://github.com/${member.login}`} title={`${member.name} (@${member.login})`} aria-label={`${member.name} on GitHub`}>
            <img src={`https://github.com/${member.login}.png?s=96`} alt="" width={48} height={48} />
            <span>{member.label}</span>
          </a>
        </li>)}
      </ul>
      <p className="hero-community-caption">
        <SketchedArrow />
        Help us get these developers <strong>doing the reps, too!</strong>
        <span className="hero-community-invitation">Know them? Invite them to join.</span>
      </p>
    </div>
  </div>
}
