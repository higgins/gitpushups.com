import { Github } from 'lucide-react'

export function GitHubSignupButton() {
  return <a className="github-signup" href="/auth/login"><Github size={22} aria-hidden="true" />Sign up with GitHub</a>
}
