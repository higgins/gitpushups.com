import { redirect } from 'next/navigation'

export default function SignupPage({ searchParams }: { searchParams?: { error?: string } }) {
  redirect(`/?signin=${encodeURIComponent(searchParams?.error || 'expired')}`)
}
