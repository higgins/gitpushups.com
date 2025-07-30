import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MarqueeGifs } from '@/components/PushupsMarquee';
import { BoltBadge } from '@/components/BoltBadge';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Git Pushups: do pushups or we block your code",
  description: 'A fitness tool for developers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <MarqueeGifs />
        {children}
        <BoltBadge />
      </body>
    </html>
  )
}
