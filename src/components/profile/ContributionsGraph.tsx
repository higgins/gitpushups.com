'use client'

import { useEffect, useRef, useState } from 'react'
import { contributionCalendar, contributionLevel, CONTRIBUTION_COLORS, type Contributions } from '@/lib/contributions'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export function ContributionsGraph({ year, contributions, today }: { year: number; contributions: Contributions; today: string }) {
  const days = contributionCalendar(year, contributions)
  const available = days.filter(day => day.date <= today)
  const [selected, setSelected] = useState(available.at(-1)?.date || days[0].date)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const scroll = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = scroll.current
    if (!container) return
    const showToday = () => { container.scrollLeft = Math.max(0, (refs.current[today]?.offsetLeft || 0) - container.clientWidth + 40) }
    showToday()
    const observer = new ResizeObserver(showToday)
    observer.observe(container)
    return () => observer.disconnect()
  }, [year, today])
  const day = days.find(day => day.date === selected)!
  const total = available.reduce((sum, day) => sum + day.reps, 0)
  const activeDays = available.filter(day => day.reps > 0).length

  return <section className="profile-contributions" aria-labelledby="contributions-title">
    <h2 className="profile-contribution-total" id="contributions-title"><strong>{total.toLocaleString('en-US')}</strong> pushups in {year}</h2>
    <div className="contribution-scroll" ref={scroll}>
      <div className="contribution-calendar" style={{ gridTemplateColumns: `28px repeat(${days[days.length - 1].week + 1}, var(--contribution-cell-size))` }} role="group" aria-label={`${year} daily pushups. Use arrow keys to explore days.`}>
        {days.filter(day => day.monthStart).map(day => <span className="contribution-month" key={day.month} style={{ gridColumn: day.week + 2, gridRow: 1 }}>{months[day.month]}</span>)}
        {[['Mon', 3], ['Wed', 5], ['Fri', 7]].map(([label, row]) => <span className="contribution-weekday" key={label} style={{ gridColumn: 1, gridRow: row }}>{label}</span>)}
        {days.map((day, index) => day.date > today ? <span key={day.date} className="contribution-cell contribution-future" style={{ gridColumn: day.week + 2, gridRow: day.weekday + 2 }} /> : <button
          key={day.date} type="button" className="contribution-cell" data-selected={selected === day.date}
          style={{ gridColumn: day.week + 2, gridRow: day.weekday + 2, backgroundColor: CONTRIBUTION_COLORS[contributionLevel(day)] }}
          title={`${formatDate(day.date)}: ${day.reps} pushups`} aria-label={`${formatDate(day.date)}: ${day.reps} pushups`}
          tabIndex={selected === day.date ? 0 : -1} ref={element => { refs.current[day.date] = element }}
          onClick={() => setSelected(day.date)} onFocus={() => setSelected(day.date)}
          onKeyDown={event => {
            const offset = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[event.key]
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : offset !== undefined ? Math.max(0, Math.min(available.length - 1, index + offset)) : null
            if (next !== null) { event.preventDefault(); refs.current[days[next].date]?.focus() }
          }}
        />)}
      </div>
    </div>
    <div className="contribution-caption"><p aria-live="polite"><strong>{day.reps.toLocaleString('en-US')} pushups</strong> on {formatDate(day.date)}</p><div className="contribution-key" aria-label="Color intensity shows progress toward each day’s goal"><span>Less</span>{CONTRIBUTION_COLORS.map(color => <span key={color} style={{ backgroundColor: color }} />)}<span>More</span></div></div>
    {activeDays === 0 && <p className="profile-empty">No pushups logged yet this year. Every habit starts with the first set.</p>}
  </section>
}
