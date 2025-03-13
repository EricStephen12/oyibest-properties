// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import SearchFilter from "./components/SearchFilter";
import PropertyCard from "./components/PropertyCard";
import { FaSearch, FaHome, FaHandshake } from "react-icons/fa";
import { Property, PropertyFilter } from '@/types/property'
import { getFeaturedProperties } from '@/lib/firebase/properties'
import { motion } from 'framer-motion'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Something went wrong:</h2>
      <pre className="text-red-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}

function HomeContent() {
  const router = useRouter()
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const properties = await getFeaturedProperties()
        setFeaturedProperties(properties)
      } catch (error) {
        console.error('Error loading featured properties:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProperties()
  }, [])

  const handleSearch = (filters: PropertyFilter) => {
    // Convert filters to URL parameters
    const params = new URLSearchParams()
    
    if (filters.type) params.append('type', filters.type)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.location) params.append('location', filters.location)
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
    
    // Redirect to properties page with filters
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
          alt="Luxury Home"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Find Your Dream Property or Land
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              Discover prime properties, lands, and real estate investments across Nigeria
            </p>
            <div className="max-w-3xl mx-auto w-full">
              <SearchFilter onFilter={handleSearch} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Oyibest Properties?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Property Search</h3>
              <p className="text-gray-600">
                Find your ideal property or land with our advanced search filters
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Properties & Land</h3>
              <p className="text-gray-600">
                Carefully selected properties and prime land plots in choice locations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Professional support throughout your property or land acquisition journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link
              href="/properties"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Properties
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md h-96 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured properties available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today and let us help you find your dream property
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://wa.me/2348135013890"
          target="_blank"
          rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HomeContent />
    </ErrorBoundary>
  )
}
