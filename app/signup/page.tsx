import { GitHubSignupButton } from '@/components/landing/GitHubSignupButton'

export const metadata = { title: 'Join GitPushups', robots: { index: false, follow: false } }
const errors: Record<string, string> = {
  cancelled: 'GitHub signup was cancelled. You can try again when you’re ready.',
  expired: 'Your sign-in link expired. Please start again.',
  failed: 'We couldn’t finish signing you in. Please try again.',
  unavailable: 'Browser signup is temporarily unavailable. Please try again later.',
  configuration: 'Browser signup is not available at this address yet.',
}

export default function SignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  return <main className="content-page"><h1 className="page-heading">One account. More reps.</h1>
    <p>Sign up with GitHub to connect your coding routine with GitPushups.</p>
    {searchParams?.error && <p className="account-error" role="alert">{errors[searchParams.error] || errors.failed}</p>}
    <GitHubSignupButton />
  </main>
}
