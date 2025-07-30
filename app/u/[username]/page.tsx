import { getUserStatus } from '@/lib/api'
import { GitHook } from '@/components/GitHook'
import { notFound } from 'next/navigation'
interface Params {
  params: {
    username: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}
export const dynamic = 'force-dynamic'

export default async function UserPage({ params, searchParams }: Params) {
  const d = typeof searchParams.d === 'string' ? searchParams.d : undefined
  const status = await getUserStatus(params.username, d)
  if (!status) {
    notFound()
  }
  const { user, didPushupsToday, localDate } = status
  return (
    <main className="flex items-center justify-center p-4 min-h-[calc(100vh-100px)]">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-xl text-left space-y-4">
        <img
          src={user.avatarUrl}
          alt={user.username}
          width={96}
          height={96}
          className="rounded-full mx-auto"
        />
        {localDate && (
          <p className="text-center font-semibold">{localDate}</p>
        )}
        <p className="font-bold text-lg">
          @{user.username}{' '}
          {didPushupsToday ? (
            <><span className="text-green-600">DID pushups today</span> and can continue coding.</>
          ) : (
            <><span className="text-red-600">DID NOT do pushups today</span> and should not be behind the keyboard.</>
          )}
        </p>
        <p>Block your commits based on their pushups by installing this git-hook</p>
        {/* GitHook component will show instructions */}
        <div className="text-left">
          <GitHook username={user.username} />
        </div>
      </div>
    </main>
  )
}
