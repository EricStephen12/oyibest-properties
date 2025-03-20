'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBed, FaBath, FaRulerCombined, FaPhone, FaWhatsapp, FaTimes, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export default function PropertyDetails() {
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [error, setError] = useState(null)
  const [showLightbox, setShowLightbox] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const params = useParams()
  const propertyId = params.id

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true)
        const propertyRef = doc(db, 'properties', propertyId)
        const propertySnap = await getDoc(propertyRef)
        
        if (propertySnap.exists()) {
          const data = propertySnap.data()
          console.log('Property Data:', data)
          setProperty({
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          })
        } else {
          setError('Property not found')
        }
      } catch (err) {
        console.error('Error fetching property data:', err)
        setError('Failed to load property data')
      } finally {
        setIsLoading(false)
      }
    }

    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId])

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImage((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLightbox) {
        if (e.key === 'ArrowLeft') {
          prevImage()
        } else if (e.key === 'ArrowRight') {
          nextImage()
        } else if (e.key === 'Escape') {
          setShowLightbox(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox, property?.images])

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current
    const minSwipeDistance = 50 // minimum distance for swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped right - show previous image
        prevImage()
      } else {
        // Swiped left - show next image
        nextImage()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || 'Property not found'}</h1>
        <p>Unable to load property details. Please try again later.</p>
      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) return 'Date not available'
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] bg-gray-900 group cursor-pointer" 
        onClick={() => setShowLightbox(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[activeImage]}
              alt={property.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Navigation arrows on hero image */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:text-gray-300"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:text-gray-300"
            >
              <FaChevronRight />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            No image available
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
          <div className="container mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {property.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4 mb-2"
            >
              <span className="text-xl">{property.location}</span>
              <span className="flex items-center text-sm">
                <FaCalendarAlt className="mr-2" />
                {formatDate(property.createdAt)}
              </span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-blue-400"
            >
              ₦{property.price ? property.price.toLocaleString() : 'Price on request'}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImage(index)
                        setShowLightbox(true)
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg ${
                        activeImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Property view ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-90 transition-opacity"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description || 'No description available'}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <FaBed className="mx-auto text-2xl text-blue-500 mb-2" />
                  <p className="text-gray-600">{property.bedrooms || 0} Beds</p>
                </div>
                <div className="text-center">
                  <FaBath className="mx-auto text-2xl text-blue-500 mb-2" />
                  <p className="text-gray-600">{property.bathrooms || 0} Baths</p>
                </div>
                <div className="text-center">
                  <FaRulerCombined className="mx-auto text-2xl text-blue-500 mb-2" />
                  <p className="text-gray-600">
                    {property.squareFootage ? `${property.squareFootage} sqft` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Contact Agent</h2>
              <div className="space-y-4">
                <a 
                  href={`tel:${property.contactPhone || '+2349013334400'}`}
                  className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaPhone />
                  <span>Call Now</span>
                </a>
                <a 
                  href={`https://wa.me/${property.contactWhatsapp || '+2349013334400'}`}
                  className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && property.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-50"
            >
              <FaTimes />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors z-50 md:opacity-100 opacity-50"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors z-50 md:opacity-100 opacity-50"
            >
              <FaChevronRight />
            </button>
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4">
              <Image
                src={property.images[activeImage]}
                alt={`Property view ${activeImage + 1}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {activeImage + 1} / {property.images.length}
                <p className="text-sm mt-2 hidden md:block">Use arrow keys ← → to navigate</p>
                <p className="text-sm mt-2 md:hidden">Swipe left or right to navigate</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 