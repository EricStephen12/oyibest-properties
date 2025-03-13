// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaChevronRight, FaTimes, FaWhatsapp, FaPhone } from 'react-icons/fa'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <FaChevronRight className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray bg-opacity-5" onClick={() => setIsOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="text-xl font-bold text-blue-600">Oyibest</span>
                  <span className="text-gray-600 ml-1">Properties</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-4">
                <Link
                  href="/"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/properties"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Properties
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              <div className="mt-8 space-y-4">
                <a
                  href="https://wa.me/2348135013890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <FaWhatsapp className="h-5 w-5 mr-2" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+2348135013890"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FaPhone className="h-4 w-4 mr-2" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 