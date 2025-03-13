// @ts-nocheck
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaBed, FaBath, FaRuler, FaWhatsapp, FaHeart } from 'react-icons/fa'
import { Property } from '@/types/property'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

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
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
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
            href={`https://wa.me/${property.contactWhatsapp || ''}?text=Hi, I'm interested in the property: ${property.title}`}
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