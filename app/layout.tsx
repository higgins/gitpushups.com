import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MarqueeGifs } from '@/components/PushupsMarquee';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Git Pushups: do pushups or we block your code",
  description: 'A fitness tool for developers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Script async defer src="https://scripts.simpleanalyticscdn.com/latest.js" />
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
        <MarqueeGifs />
        {children}
      </body>
    </html>
  )
}
