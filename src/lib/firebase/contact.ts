// @ts-nocheck
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...formData,
      createdAt: serverTimestamp(),
      status: 'new'
    })
    
    if (!docRef.id) {
      throw new Error('Failed to create document')
    }
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to submit contact form: ${errorMessage}`)
  }
} 