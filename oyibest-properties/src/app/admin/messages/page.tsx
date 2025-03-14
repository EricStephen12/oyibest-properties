// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: Date
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMessages, setExpandedMessages] = useState<string[]>([])

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Message[]
      setMessages(messagesData)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'messages', id))
      toast.success('Message deleted successfully')
      fetchMessages() // Refresh the list
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const toggleMessage = (id: string) => {
    setExpandedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    )
  }

  const isMessageExpanded = (id: string) => expandedMessages.includes(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage contact form submissions.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No messages found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {message.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                          {message.email}
                        </a>
                        <span>•</span>
                        <a href={`tel:${message.phone}`} className="hover:text-blue-600">
                          {message.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <p className={`text-gray-600 whitespace-pre-wrap ${
                        !isMessageExpanded(message.id) ? 'line-clamp-3' : ''
                      }`}>
                        {message.message}
                      </p>
                      {message.message.length > 150 && (
                        <button
                          onClick={() => toggleMessage(message.id)}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          {isMessageExpanded(message.id) ? (
                            <>Show less <FaChevronUp className="w-4 h-4" /></>
                          ) : (
                            <>Show more <FaChevronDown className="w-4 h-4" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {message.createdAt.toLocaleDateString()} {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 