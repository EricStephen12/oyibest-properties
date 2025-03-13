// @ts-nocheck
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Oyibest Properties & Rentals',
  description: 'Find your dream property with Oyibest Properties & Rentals - Your trusted real estate partner.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png' },
      { url: '/icon-512.png' }
    ],
    apple: [
      { url: '/icon-192.png' },
      { url: '/icon-512.png' }
    ]
  },
  viewport: {
    themeColor: '#2563EB',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-512.svg" sizes="512x512" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.svg" sizes="192x192" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
