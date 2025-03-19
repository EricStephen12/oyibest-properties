// @ts-nocheck
import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  title: {
    default: 'Oyibest Properties - Real Estate in Nigeria',
    template: '%s | Oyibest Properties'
  },
  description: 'Find your dream home with Oyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
  keywords: [
    'real estate',
    'property',
    'nigeria',
    'houses for sale',
    'houses for rent',
    'apartments',
    'real estate agent',
    'property listings',
    'oyibest properties'
  ],
  authors: [{ name: 'Oyibest Properties' }],
  creator: 'Oyibest Properties',
  publisher: 'Oyibest Properties',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://oyibest-properties.com',
    siteName: 'Oyibest Properties',
    title: 'Oyibest Properties - Real Estate in Nigeria',
    description: 'Find your dream home with Oyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oyibest Properties'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oyibest Properties - Real Estate in Nigeria',
    description: 'Find your dream home with Oyibest Properties. Browse through our extensive collection of properties for sale and rent in Nigeria.',
    images: ['/twitter-image.jpg'],
    creator: '@oyibestproperties'
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
    canonical: 'https://oyibest-properties.com',
  },
}

export default defaultMetadata 