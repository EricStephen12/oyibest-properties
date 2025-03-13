// @ts-nocheck
import { FaWhatsapp, FaPhone } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Oyibest Properties</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner in finding the perfect property for your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">Home</a>
              </li>
              <li>
                <a href="/properties" className="text-gray-300 hover:text-white">Properties</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaPhone className="h-5 w-5 mr-2" />
                <div>
                  <p>+234 813 501 3890</p>
                  <p>+234 805 637 6313</p>
                </div>
              </div>
              <a
                href="https://wa.me/2348135013890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white"
              >
                <FaWhatsapp className="h-5 w-5 mr-2" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Oyibest Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer