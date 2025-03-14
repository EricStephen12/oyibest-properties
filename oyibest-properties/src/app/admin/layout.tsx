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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 256 : 80,
            transition: { duration: 0.3 }
          }}
          className={`fixed lg:relative top-0 left-0 z-40 h-full bg-white shadow-lg lg:shadow-md transform lg:transform-none transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute right-4 top-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>

          <div className={`p-6 flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            <Link href="/admin/dashboard" className="flex items-center">
              {isSidebarOpen ? (
                <>
                  <h2 className="text-2xl font-bold text-blue-600">Onyibest</h2>
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

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md items-center justify-center text-gray-600 hover:text-gray-900"
          >
            <FaChevronLeft className={`h-4 w-4 transform transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </motion.aside>

        {/* Mobile Menu Button - Fixed at the top left corner */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-50"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 