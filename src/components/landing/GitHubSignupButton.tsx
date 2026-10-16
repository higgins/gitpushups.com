import { Github } from 'lucide-react'
import { PUSHUP_FREQUENCIES, type PushupFrequency } from '@/lib/installation'

export function GitHubSignupButton({ frequency = PUSHUP_FREQUENCIES[0] }: { frequency?: PushupFrequency }) {
  return <a className="github-signup" href={`/auth/login?frequency=${frequency.id}`}><Github size={22} aria-hidden="true" />Sign in with GitHub</a>
}
