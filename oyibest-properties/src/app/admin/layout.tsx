// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import Link from 'next/link'
import { FaHome, FaList, FaEnvelope, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaBuilding } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else if (user && pathname === '/admin/login') {
        router.push('/admin/dashboard')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [pathname])

  const menuItems = [
    { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/properties', icon: FaList, label: 'Properties' },
    { path: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return children
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 240 : 72,
            transition: { duration: 0.3 }
          }}
          className="fixed top-0 left-0 z-40 h-full bg-white shadow-lg flex flex-col"
        >
          {/* Logo */}
          <div className="p-4 flex items-center justify-center border-b border-gray-100">
            <Link href="/admin/dashboard" className="flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <FaBuilding className="w-6 h-6" />
              </div>
              {isSidebarOpen && (
                <span className="ml-3 font-semibold text-gray-900">Admin Panel</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              }`}
            >
              <FaSignOutAlt className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
              {isSidebarOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900"
          >
            <FaChevronLeft className={`h-4 w-4 transform transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? 'ml-60' : 'ml-[72px]'
        }`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 