import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 space-y-4 text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <img src="/404.png" alt="Not found" className="max-w-xs w-full h-auto" />
      <p>
        <Link href="/" className="underline">Return home</Link>
      </p>
    </main>
  )
}
