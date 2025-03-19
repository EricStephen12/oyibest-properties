// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import PropertyForm from '@/app/components/PropertyForm'
import { Property } from '@/types/property'
import Link from 'next/link'

export default function EditProperty() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, 'properties', id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProperty({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate(),
            updatedAt: docSnap.data().updatedAt?.toDate(),
          } as Property)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <Link
          href="/admin/properties"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Properties
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <PropertyForm property={property} isEditing />
      </div>
    </div>
  )
} 