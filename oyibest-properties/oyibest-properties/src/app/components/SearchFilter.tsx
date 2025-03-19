// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { PropertyFilter } from '@/types/property'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import debounce from 'lodash/debounce'

interface SearchFilterProps {
  onFilter: (filters: PropertyFilter) => void
  initialFilters?: PropertyFilter | null
}

const SearchFilter = ({ onFilter, initialFilters }: SearchFilterProps) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    type: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    location: undefined,
    bedrooms: undefined,
  })
  const [isOpen, setIsOpen] = useState(false)

  // Initialize filters with provided values
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((newFilters: PropertyFilter) => {
      onFilter(newFilters)
    }, 300),
    [onFilter]
  )

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    const newValue = value === '' ? undefined : 
      (name === 'minPrice' || name === 'maxPrice' || name === 'bedrooms') 
        ? Number(value) 
        : value

    const newFilters = {
      ...filters,
      [name]: newValue
    }
    
    setFilters(newFilters)
    debouncedFilter(newFilters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const emptyFilters = {
      type: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      location: undefined,
      bedrooms: undefined,
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined)

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-md"
      >
        <span className="text-gray-700">
          {hasActiveFilters ? 'Filters Applied' : 'Search Filters'}
        </span>
        <FaSearch className="text-gray-500" />
      </button>

      {/* Filter Form */}
      <AnimatePresence>
        <motion.form
          onSubmit={handleSubmit}
          className={`bg-white p-4 rounded-lg shadow-lg md:shadow-md ${
            isOpen ? 'block' : 'hidden md:block'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="type"
                value={filters.type || ''}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleChange}
                placeholder="Min Price"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleChange}
                placeholder="Max Price"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location || ''}
                onChange={handleChange}
                placeholder="Search location..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms || ''}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FaTimes className="mr-2" />
                Clear Filters
              </button>
            )}
            <motion.button
              type="submit"
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSearch className="mr-2" />
              Search Properties
            </motion.button>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}

export default SearchFilter 