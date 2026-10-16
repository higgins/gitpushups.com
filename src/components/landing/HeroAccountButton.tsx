'use client'

import { GitHubSignupButton } from './GitHubSignupButton'
import { useTraining } from './TrainingContext'

export function HeroAccountButton() {
  const { user, frequency } = useTraining()
  return user ? null : <GitHubSignupButton frequency={frequency} />
}
