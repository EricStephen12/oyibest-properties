// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'
import { FaPlus, FaHome, FaEnvelope, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Property } from '@/types/property'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: any
}

interface DashboardStats {
  totalProperties: number
  totalMessages: number
  recentProperties: Property[]
  recentMessages: Message[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalMessages: 0,
    recentProperties: [],
    recentMessages: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total properties
        const propertiesSnapshot = await getDocs(collection(db, 'properties'))
        const totalProperties = propertiesSnapshot.size

        // Get total messages
        const messagesSnapshot = await getDocs(collection(db, 'messages'))
        const totalMessages = messagesSnapshot.size

        // Get recent properties
        const recentPropertiesQuery = query(
          collection(db, 'properties'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentPropertiesSnapshot = await getDocs(recentPropertiesQuery)
        const recentProperties = recentPropertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Property[]

        // Get recent messages
        const recentMessagesQuery = query(
          collection(db, 'messages'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentMessagesSnapshot = await getDocs(recentMessagesQuery)
        const recentMessages = recentMessagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[]

        setStats({
          totalProperties,
          totalMessages,
          recentProperties,
          recentMessages
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add Property
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaHome className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalProperties}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaEnvelope className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalMessages}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentProperties.map((property: any) => (
              <Link
                key={property.id}
                href={`/admin/properties/${property.id}/edit`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {property.images?.[0] && (
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {property.location}
                      </p>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        ₦{property.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 bg-gray-50">
            <Link
              href="/admin/properties"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Properties →
            </Link>
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentMessages.map((message: any) => (
              <div key={message.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{message.name}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{message.email}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">{message.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt?.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50">
            <Link
              href="/admin/messages"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Messages →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 