'use client'

import { createContext, useContext } from 'react'
import type { PushupFrequency } from '@/lib/installation'

export type WebUser = { login: string; avatarUrl: string | null }
export const TrainingContext = createContext<{
  frequency: PushupFrequency
  setFrequency: (frequency: PushupFrequency) => void
  user: WebUser | null
} | null>(null)

export function useTraining() {
  const context = useContext(TrainingContext)
  if (!context) throw new Error('Training controls require a TrainingContext provider')
  return context
}
