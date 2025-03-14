// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import Link from 'next/link'
import { FaHome, FaList, FaEnvelope, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm py-4 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <FaChevronRight className={`h-5 w-5 transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 256 : 80,
            transition: { duration: 0.3 }
          }}
          className={`fixed lg:relative top-0 left-0 z-40 h-screen bg-white shadow-lg lg:shadow-md transform lg:transform-none transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className={`p-6 flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            <Link href="/admin/dashboard" className="flex items-center">
              {isSidebarOpen ? (
                <>
                  <h2 className="text-2xl font-bold text-blue-600">Oyibest</h2>
                  <span className="text-gray-600 ml-1">Admin</span>
                </>
              ) : (
                <h2 className="text-2xl font-bold text-blue-600">O</h2>
              )}
            </Link>
          </div>

          <nav className="mt-6 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium ml-3">{item.label}</span>}
              </Link>
            ))}

            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 mt-4 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium ml-3">Sign Out</span>}
            </button>
          </nav>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-gray-900"
          >
            <FaChevronLeft className={`h-4 w-4 transform transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </motion.aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-5 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 