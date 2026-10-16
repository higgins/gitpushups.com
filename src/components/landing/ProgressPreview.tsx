import { Trophy } from 'lucide-react'
import Image from 'next/image'

const exampleDevelopers = [
  { name: 'torvalds', avatar: 'torvalds', reps: 120 },
  { name: 'karpathy', avatar: 'karpathy', reps: 108 },
  { name: 'cassidoo', avatar: 'cassidoo', reps: 96 },
  { name: 'gaearon', avatar: 'gaearon', reps: 84 },
  { name: 'sindresorhus', avatar: 'sindresorhus', reps: 72 },
]

// Fixed illustration data keeps the preview consistent between server and client.
const contributionColors = ['#e5e7eb', '#fee2e2', '#fca5a5', '#ef4444', '#b91c1c']
const contributionWeeks = [
  '0231242', '1320433', '2342314', '1342433',
  '2403434', '3342443', '2434344', '4343443',
  '3443434', '4342444', '3434443', '4443444',
].map((week, weekIndex) => [...week].map((level, dayIndex) => weekIndex === 11 && dayIndex === 6 ? 84 : Number(level) * 10))
const examplePushups = contributionWeeks.flat().reduce((total, reps) => total + reps, 0)

function LeaderboardPreview() {
  return <div className="progress-preview-panel leaderboard-preview">
    <div className="progress-preview-heading"><Trophy size={16} aria-hidden="true" /><h3>Global leaderboard</h3></div>
    <div className="leaderboard-preview-labels"><span>Today’s developers</span><span>Reps</span></div>
    <ol className="leaderboard-preview-rows">
      {exampleDevelopers.map((developer, index) => <li key={developer.name}>
        <span className="leaderboard-preview-rank">{index + 1}</span>
        <Image className="progress-avatar" src={`/progress/avatars/${developer.avatar}.webp`} alt="" width={28} height={28} />
        <span className="leaderboard-preview-name">{developer.name}</span>
        <strong>{developer.reps}</strong>
      </li>)}
    </ol>
  </div>
}

function ContributionsPreview() {
  return <div className="progress-preview-panel contributions-preview">
    <div className="progress-preview-heading"><h3>Your contributions</h3></div>
    <p className="contributions-preview-total"><strong>{examplePushups.toLocaleString('en-US')}</strong> pushups</p>
    <svg className="contributions-preview-graph" viewBox="0 0 218 134" aria-hidden="true">
      {['Jul', 'Aug', 'Sep'].map((month, index) => <text key={month} x={29 + index * 64} y="12">{month}</text>)}
      {['Mon', 'Wed', 'Fri'].map((day, index) => <text key={day} x="0" y={43 + index * 28}>{day}</text>)}
      {contributionWeeks.map((week, weekIndex) => week.map((reps, dayIndex) =>
        <rect key={`${weekIndex}-${dayIndex}`} x={29 + weekIndex * 15.5} y={22 + dayIndex * 14} width="12.5" height="11" rx="2" fill={contributionColors[Math.min(4, reps / 10)]} />
      ))}
    </svg>
    <div className="contributions-preview-key"><span>Less</span>{contributionColors.map(color => <span key={color} className="contributions-preview-key-cell" style={{ backgroundColor: color }} />)}<span>More</span></div>
    <div className="contributions-preview-goal"><span>Daily goal</span><strong>40 pushups</strong></div>
  </div>
}

export function ProgressPreview() {
  return <figure className="progress-preview" aria-label="Example app preview showing a global leaderboard and a filled pushup contribution graph. Ranks and rep counts are sample data.">
    <div className="progress-preview-split">
      <LeaderboardPreview />
      <ContributionsPreview />
    </div>
    <figcaption>Sample ranks and rep counts</figcaption>
  </figure>
}
