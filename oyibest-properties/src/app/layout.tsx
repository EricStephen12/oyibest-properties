// @ts-nocheck
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Onyibest Properties & Rentals',
  description: 'Find your dream property with Onyibest Properties & Rentals - Your trusted real estate partner.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.svg', type: 'image/svg+xml' },
      { url: '/icon-512.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon-192.svg', type: 'image/svg+xml' },
      { url: '/icon-512.svg', type: 'image/svg+xml' }
    ]
  }
}

export const viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the current path is an admin route
  const isAdminRoute = typeof window !== 'undefined' ? window.location.pathname.startsWith('/admin') : false

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-512.svg" sizes="512x512" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.svg" sizes="192x192" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {!isAdminRoute && <Navbar />}
          <main className={`flex-grow ${!isAdminRoute ? '' : 'pt-0'}`}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
