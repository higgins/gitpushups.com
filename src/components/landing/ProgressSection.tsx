import { ProgressPreview } from './ProgressPreview'

export function ProgressSection() {
  return <section id="apps" className="progress-section section-divider" aria-labelledby="progress-title">
    <div className="progress-copy">
      <h2 id="progress-title" className="page-heading">Track your progress</h2>
      <p>Set your daily goal. Track your pushups.<br />Watch your contribution graph fill in and see where you are on the global leaderboard.</p>
    </div>
    <ProgressPreview />
  </section>
}
