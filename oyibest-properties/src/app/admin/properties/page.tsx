// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { formatPrice } from '@/utils/format'

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'))
      const propertiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProperties(propertiesData)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'properties', id))
      toast.success('Property deleted successfully')
      fetchProperties() // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Add Property
        </Link>
      </div>

      {/* Table view for larger screens */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property: any) => (
                <tr key={property.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center max-w-md">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          src={property.images[0]}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-[200px]">
                      {property.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(property.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 p-2"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {properties.map((property: any) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start space-x-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={property.images[0]}
                  alt=""
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {property.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 break-words line-clamp-2">
                      {property.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-2"
                    >
                      <FaEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(property.price)}
                  </span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {property.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 