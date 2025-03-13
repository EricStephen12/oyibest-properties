// @ts-nocheck
'use client'

import { useState } from 'react'
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { submitContactForm } from '@/lib/firebase/contact'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await submitContactForm(formData)
      toast.success('Message sent successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again later.')
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
            <div className="space-y-6">
              <div className="flex items-start">
                <FaPhone className="h-6 w-6 text-blue-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">+234 813 501 3890</p>
                  <p className="text-gray-600">+234 805 637 6313</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaWhatsapp className="h-6 w-6 text-green-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp</h3>
                  <a
                    href="https://wa.me/2348135013890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-blue-600 hover:text-blue-700"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-6 w-6 text-red-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Office Address</h3>
                  <p className="mt-1 text-gray-600">
                    Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 