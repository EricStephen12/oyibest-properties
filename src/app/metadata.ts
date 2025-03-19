// @ts-nocheck
import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  title: {
    default: 'Onyibest Properties - Real Estate in Nigeria',
    template: '%s | Onyibest Properties'
  },
  description: 'Find your dream home with Onyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
  keywords: [
    'real estate',
    'properties',
    'houses for sale',
    'houses for rent',
    'land for sale',
    'nigeria real estate',
    'property listing',
    'real estate agency',
    'onyibest properties'
  ],
  authors: [{ name: 'Onyibest Properties' }],
  creator: 'Onyibest Properties',
  publisher: 'Onyibest Properties',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    url: 'https://onyibest-properties.com',
    siteName: 'Onyibest Properties',
    title: 'Onyibest Properties - Real Estate in Nigeria',
    description: 'Find your dream home with Onyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Onyibest Properties'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onyibest Properties - Real Estate in Nigeria',
    description: 'Find your dream home with Onyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
    images: ['/twitter-image.jpg'],
    creator: '@onyibestproperties'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://onyibest-properties.com',
  },
}

export default defaultMetadata 