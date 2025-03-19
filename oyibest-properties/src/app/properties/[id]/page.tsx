// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { FaBed, FaBath, FaRuler, FaWhatsapp, FaPhone, FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt, FaCalendar, FaTag } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { getPropertyById } from '@/lib/firebase/properties'
import { Property } from '@/types/property'
import { formatPrice } from '@/utils/format'

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await getPropertyById(id as string)
        setProperty(propertyData)
      } catch (err) {
        setError('Failed to load property details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Property not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section with Image Gallery */}
      <div className="relative h-[50vh] md:h-[70vh] w-full bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src={property.images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentImageIndex === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            
            {/* Image Navigation */}
            <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <FaMapMarkerAlt />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                    {formatPrice(property.price)}
                  </span>
                  {property.type === 'rent' && (
                    <span className="text-white/90">/year</span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-white opacity-100'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Click to Zoom Indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/70 text-white px-6 py-3 rounded-lg font-medium">
                Click to view gallery
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors transform hover:scale-110"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors transform hover:scale-110"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <FaBed className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-lg font-semibold text-gray-900">{property.bedrooms}</span>
                  <span className="text-sm text-gray-600">Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <FaBath className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-lg font-semibold text-gray-900">{property.bathrooms}</span>
                  <span className="text-sm text-gray-600">Bathrooms</span>
                </div>
              )}
              {property.squareFootage && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <FaRuler className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-lg font-semibold text-gray-900">{property.squareFootage}</span>
                  <span className="text-sm text-gray-600">Square Feet</span>
                </div>
              )}
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <FaTag className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-lg font-semibold text-gray-900 capitalize">{property.type}</span>
                <span className="text-sm text-gray-600">Type</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Agent</h2>
              <div className="space-y-4">
                <motion.a
                  href={`https://wa.me/${property.contactWhatsapp?.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in the property: ${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-3 bg-green-500 text-white px-6 py-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaWhatsapp className="w-6 h-6" />
                  <span className="text-lg font-medium">Chat on WhatsApp</span>
                </motion.a>

                <motion.a
                  href={`tel:${property.contactPhone?.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-center w-full gap-3 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPhone className="w-6 h-6" />
                  <span className="text-lg font-medium">Call Agent</span>
                </motion.a>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FaCalendar className="w-5 h-5" />
                  <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 z-10"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full" onClick={e => e.stopPropagation()}>
              <Image
                src={property.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all transform hover:scale-110"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all transform hover:scale-110"
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 