// @ts-nocheck
import Link from 'next/link'
import { FaWhatsapp, FaPhone } from 'react-icons/fa'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Onyibest</span>
            <span className="text-gray-600 ml-1">Properties</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/properties" className="text-gray-600 hover:text-blue-600">
              Properties
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </Link>
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://wa.me/2348135013890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-600 hover:text-green-700"
            >
              <FaWhatsapp className="h-5 w-5 mr-1" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+2348135013890"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <FaPhone className="h-4 w-4 mr-1" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
}

export default Navbar 