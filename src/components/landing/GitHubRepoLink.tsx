import { Github, Star } from 'lucide-react'

const REPOSITORY_URL = 'https://github.com/higgins/gitpushups.com'

async function getStarCount(): Promise<number | null> {
  try {
    const response = await fetch('https://api.github.com/repos/higgins/gitpushups.com', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    const data = await response.json()
    if (!data || typeof data !== 'object' || !('stargazers_count' in data)) return null
    const stars = data.stargazers_count
    return typeof stars === 'number' && Number.isSafeInteger(stars) && stars >= 0 ? stars : null
  } catch {
    return null
  }
}

export async function GitHubRepoLink() {
  const stars = await getStarCount()
  return <a className="github-repo-link" href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" aria-label={`GitPushups on GitHub${stars === null ? '' : `, ${stars.toLocaleString('en-US')} stars`} (opens in a new tab)`}>
    <Github size={21} aria-hidden="true" />
    <span>GitHub</span>
    <span className="github-repo-stars"><Star size={15} aria-hidden="true" />{stars === null ? 'Star' : stars.toLocaleString('en-US')}</span>
  </a>
}
