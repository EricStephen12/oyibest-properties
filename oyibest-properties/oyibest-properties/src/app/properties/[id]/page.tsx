// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { FaBed, FaBath, FaRuler, FaWhatsapp, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
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
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Image Gallery */}
      <div className="relative aspect-[16/9] w-full mb-8 rounded-lg overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={property.images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-baseline gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-2xl font-semibold text-blue-600">
                {formatPrice(property.price)}
              </p>
            </div>

            <p className="text-gray-600 mb-6">{property.location}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <FaBed className="w-5 h-5" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaBath className="w-5 h-5" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaRuler className="w-5 h-5" />
                <span>{property.squareFeet} sqft</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Contact Agent</h2>
            <div className="space-y-4">
              <motion.a
                href={`https://wa.me/234${property.whatsapp}?text=Hi, I'm interested in the property: ${property.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaWhatsapp className="w-5 h-5" />
                Chat on WhatsApp
              </motion.a>

              <motion.a
                href={`tel:+234${property.phone}`}
                className="flex items-center justify-center w-full gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPhone className="w-5 h-5" />
                Call Agent
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 