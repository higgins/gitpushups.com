'use client'

import { useEffect, useRef } from 'react'
import { SUPPORT_PAYMENT_URL } from '@/lib/support'
import { X } from 'lucide-react'
import { StepNumber } from './StepNumber'
import { InstallationTabs } from './InstallationSection'
import { AppDownloadButtons } from './AppDownloadButtons'
import { GitHubSignupButton } from './GitHubSignupButton'
import { useTraining } from './TrainingContext'

const authErrors: Record<string, string> = {
  cancelled: 'GitHub sign-in was cancelled. Try again whenever you’re ready.',
  expired: 'Your session expired. Sign in again to see your next steps.',
  failed: 'We couldn’t finish signing you in. Please try again.',
  unavailable: 'GitHub sign-in is temporarily unavailable. Please try again shortly.',
  configuration: 'GitHub sign-in isn’t configured for this address yet.',
  profile: 'We couldn’t load your profile. Please refresh to try again.',
}

export function NextStepsModal({ open, onClose, error }: { open: boolean; onClose: () => void; error?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const { user, frequency } = useTraining()

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [open])

  return <dialog ref={dialog} className="next-steps-modal" aria-labelledby="next-steps-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }
  }}>
    <button ref={closeButton} type="button" className="modal-close" onClick={onClose} aria-label="Close next steps"><X size={22} /></button>
    {user ? <>
      <header className="next-steps-welcome">
        {user.avatarUrl && <img src={user.avatarUrl} alt={`@${user.login}`} width={56} height={56} />}
        <div><h2 id="next-steps-title" className="page-heading">You’re in, @{user.login}.</h2><p>Three steps. Then back to your code.</p></div>
      </header>
      <ol className="next-steps-list">
        <li>
          <h3><StepNumber number={1} /><span>Install the hook if you haven’t</span></h3>
          <p>Give this prompt to your coding agent, or use the Git hook tab. Your schedule: <strong>{frequency.label.toLowerCase()}</strong>.</p>
          <InstallationTabs frequency={frequency} username={user.login} />
        </li>
        <li>
          <h3><StepNumber number={2} /><span>Download the app</span></h3>
          <p>Sign in with the same GitHub account, <strong>@{user.login}</strong>, to keep everything connected.</p>
          <AppDownloadButtons />
        </li>
        <li>
          <h3><StepNumber number={3} /><span>Do some pushups!</span></h3>
          <p>Record your first set in the app, then get back to committing.</p>
        </li>
      </ol>
      <footer className="next-steps-thanks">
        <a href="https://github.com/higgins" aria-label="Justin on GitHub"><img src="https://github.com/higgins.png?s=96" alt="Justin (@higgins)" width={48} height={48} /></a>
        <div><p><strong>Thanks for being here. — Justin</strong></p><p>Found a bug or have an idea? <a href="https://github.com/higgins/gitpushups.com/issues">Ping me.</a> GitPushups is free forever, and <a href={SUPPORT_PAYMENT_URL}>your support is always appreciated</a>.</p></div>
      </footer>
    </> : <div className="next-steps-error">
      <h2 id="next-steps-title" className="page-heading">Let’s get you signed in.</h2>
      <p role="alert">{authErrors[error || 'expired'] || authErrors.failed}</p>
      {error === 'profile' ? <button className="github-signup" type="button" onClick={() => window.location.reload()}>Try again</button> : <GitHubSignupButton frequency={frequency} />}
    </div>}
  </dialog>
}
