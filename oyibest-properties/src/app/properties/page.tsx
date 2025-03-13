// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchFilter from '../components/SearchFilter'
import PropertyCard from '../components/PropertyCard'
import { Property, PropertyFilter } from '@/types/property'
import { getProperties } from '@/lib/firebase/properties'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Properties() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<PropertyFilter | null>(null)

  // Get initial filters from URL parameters
  useEffect(() => {
    const initialFilters: PropertyFilter = {
      type: searchParams.get('type') as 'sale' | 'rent' || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      location: searchParams.get('location') || undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    }

    // Only fetch with filters if at least one filter is set
    if (Object.values(initialFilters).some(value => value !== undefined)) {
      fetchProperties(initialFilters)
    } else {
      fetchProperties()
    }
  }, [searchParams])

  const fetchProperties = async (filters?: PropertyFilter) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProperties(filters)
      setProperties(data)
      setActiveFilters(filters || null)

      // Show toast if no results found with filters
      if (filters && Object.keys(filters).some(key => filters[key] !== undefined) && data.length === 0) {
        toast.error('No properties found with the selected filters')
      }
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.')
      console.error('Error fetching properties:', err)
      toast.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async (filters: PropertyFilter) => {
    // Update URL with new filters
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.location) params.append('location', filters.location)
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())

    // Update URL without refreshing the page
    router.push(`/properties?${params.toString()}`, { scroll: false })
    
    // Fetch properties with new filters
    await fetchProperties(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Properties
          </h1>
          <SearchFilter onFilter={handleFilter} initialFilters={activeFilters} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? 'loading' : 'results'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
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
            ) : properties.length > 0 ? (
              properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-900">
                  {activeFilters ? 'No properties found with the selected filters' : 'No properties available'}
                </h3>
                {activeFilters && (
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search filters or browse all properties
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}