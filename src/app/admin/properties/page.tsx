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
    <div className="w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto justify-center sm:justify-start"
        >
          <FaPlus className="mr-2" />
          Add Property
        </Link>
      </div>

      {/* Table view for larger screens */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property: any) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        src={property.images[0]}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {property.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-[150px]">
                    {property.location}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₦{property.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {property.type}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                    >
                      <FaEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50"
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

      {/* Card view for mobile screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {properties.map((property: any) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={property.images[0]}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₦{property.price.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {property.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 