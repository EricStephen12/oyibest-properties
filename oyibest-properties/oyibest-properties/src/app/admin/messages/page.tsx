// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'

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
              <div key={message.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-500">{message.email}</p>
                    <p className="text-sm text-gray-500">{message.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-4">
                      {message.createdAt.toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 