import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center mt-10 text-center">
      <Link href="/" className="underline">
        <>
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <img src="/404.png" alt="Not found" className="max-w-xs w-full h-auto" />
          <p>Return Home</p>
        </>
      </Link>
    </main>
  )
}
