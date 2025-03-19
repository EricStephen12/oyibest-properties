// @ts-nocheck
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaBed, FaBath, FaRuler, FaWhatsapp, FaHeart, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa'
import { Property } from '@/types/property'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Cleanup function to clear any existing intervals
  const clearAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Effect to manage hover state
  useEffect(() => {
    if (isHovered) {
      // Don't auto-start rotation - user needs to click play button
    } else {
      // When not hovered, always clear the rotation
      clearAutoRotation()
    }
    
    // Cleanup interval on unmount
    return clearAutoRotation
  }, [isHovered, property.images.length])

  // Separate effect for handling auto-rotation state
  useEffect(() => {
    if (autoRotationEnabled && isHovered && property.images.length > 1) {
      // Start a new interval if auto-rotation is enabled
      clearAutoRotation() // Clear any existing interval first
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === property.images.length - 1 ? 0 : prev + 1
        )
      }, 4000) // Slower rotation - change every 4 seconds
    } else {
      // Stop auto-rotation
      clearAutoRotation()
    }
    
    // Cleanup interval on unmount or state change
    return clearAutoRotation
  }, [autoRotationEnabled, isHovered, property.images.length])

  // Handle manual image navigation
  const handleImageNavigation = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation()
    e.preventDefault()
    
    // Clear any existing rotation
    clearAutoRotation()
    
    // Disable auto-rotation on manual navigation
    setAutoRotationEnabled(false)
    
    // Clear any existing interaction timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    
    // Change the image
    if (direction === 'next') {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    } else {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  const toggleAutoRotation = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setAutoRotationEnabled(prev => !prev)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48 sm:h-56 md:h-64">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority
            />
            
            {/* Image counter badge */}
            {property.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{property.images.length}
              </div>
            )}
            
            {/* Navigation controls - only show when hovered and multiple images */}
            {property.images.length > 1 && isHovered && (
              <div className="absolute inset-x-0 top-0 h-full flex items-center justify-between z-10 px-2">
                <button 
                  onClick={(e) => handleImageNavigation(e, 'prev')}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transform transition-transform hover:scale-110"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="h-3 w-3" />
                </button>
                
                <button 
                  onClick={(e) => handleImageNavigation(e, 'next')}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transform transition-transform hover:scale-110"
                  aria-label="Next image"
                >
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {/* Auto-rotation toggle button */}
            {property.images.length > 1 && isHovered && (
              <button
                onClick={toggleAutoRotation}
                className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transform transition-transform hover:scale-110"
                aria-label={autoRotationEnabled ? "Pause slideshow" : "Play slideshow"}
              >
                {autoRotationEnabled ? 
                  <FaPause className="h-3 w-3" /> : 
                  <FaPlay className="h-3 w-3" />
                }
              </button>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white text-lg font-semibold line-clamp-1 mb-1">
            {property.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-1">{property.location}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(property.price)}
            {property.type === 'rent' && '/year'}
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaHeart className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaBed className="mr-1" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaBath className="mr-1" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.squareFootage && (
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaRuler className="mr-1" />
              <span>{property.squareFootage} sqft</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/${property.contactWhatsapp?.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in the property: ${encodeURIComponent(property.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard 