import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWARegister from './components/PWARegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fountain Vitality - Smart Schedule Analysis',
  description: 'Transform your team\'s schedule into actionable insights. Optimize coverage, save time, and make data-driven scheduling decisions with AI-powered analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <PWARegister />
        {children}
      </body>
    </html>
  )
}

