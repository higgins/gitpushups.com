import Link from 'next/link'
import { createAgentInstructions, getFrequency, PUSHUP_FREQUENCIES } from '@/lib/installation'
import { GitHookCode } from '@/components/landing/InstallationSection'

export const metadata = { title: 'Agent setup · GitPushups' }

export default function AgentSetupPage({ searchParams }: { searchParams?: { frequency?: string | string[] } }) {
  const selected = searchParams?.frequency
  const frequency = getFrequency(typeof selected === 'string' ? selected : selected === undefined ? 'daily' : null)
  return <main className="content-page agent-setup-page">
    <h1 className="page-heading">Set up with your agent</h1>
    <p>Choose your schedule, then have your coding agent follow these instructions. Your agent will ask whether to install globally on this machine or only in the current repository.</p>
    <nav className="setup-frequencies" aria-label="Pushup frequency">
      {PUSHUP_FREQUENCIES.map(option => <Link key={option.id} href={`/agent-setup?frequency=${option.id}`} aria-current={frequency?.id === option.id ? 'page' : undefined}>{option.shortLabel}</Link>)}
    </nav>
    {frequency ? <>
      <h2>{frequency.label}</h2>
      <p>{frequency.seconds === null ? 'Use the local calendar date, not a rolling 24-hour period.' : `Require a recorded set within the last ${frequency.seconds} seconds.`}</p>
      <p><a href={`/agent-setup/prompt.md?frequency=${frequency.id}`}>Open the Markdown instructions for your agent →</a></p>
      <ol className="setup-steps">
        {createAgentInstructions(frequency).split('\n').filter(line => /^\d+\. /.test(line)).map(line => <li key={line}>{line.replace(/^\d+\. /, '')}</li>)}
      </ol>
      <GitHookCode frequency={frequency} />
      <p>Any recorded set qualifies; completing a daily goal is not required. Network errors and timeouts block the commit. Changing this selection does not update an installed hook.</p>
    </> : <p role="alert">Unknown frequency. Choose Daily, 8 hours, 4 hours, 1 hour, or 15 min above.</p>}
  </main>
}
