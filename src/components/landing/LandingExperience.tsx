'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { getFrequency } from '@/lib/installation'
import { TrainingContext, type WebUser } from './TrainingContext'
import { NextStepsModal } from './NextStepsModal'

export function LandingExperience({ user, initialFrequency, welcome, authError, children }: {
  user: WebUser | null
  initialFrequency: string
  welcome: boolean
  authError?: string
  children: ReactNode
}) {
  const [frequency, setFrequency] = useState(getFrequency(initialFrequency)!)
  const [open, setOpen] = useState(welcome || Boolean(authError))
  useEffect(() => {
    setFrequency(getFrequency(initialFrequency)!)
    if (welcome || authError) setOpen(true)
  }, [initialFrequency, welcome, authError])

  function close() {
    setOpen(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('welcome')
    url.searchParams.delete('signin')
    // Keep the chosen schedule if the page is refreshed or shared.
    url.searchParams.set('frequency', frequency.id)
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  return <TrainingContext.Provider value={{ user, frequency, setFrequency }}>
    {children}
    <NextStepsModal open={open} onClose={close} error={authError || (welcome && !user ? 'expired' : undefined)} />
  </TrainingContext.Provider>
}
