// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { uploadToCloudinary } from '@/utils/cloudinary'
import toast from 'react-hot-toast'
import { Property } from '@/types/property'
import { FaCloudUploadAlt, FaSpinner, FaTrash, FaSave } from 'react-icons/fa'
import Image from 'next/image'

interface PropertyFormProps {
  property?: Property
  isEditing?: boolean
}

// Form data storage key for localStorage
const STORAGE_KEY = 'property_form_draft'

export default function PropertyForm({ property, isEditing }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    features: [''],
    images: [] as string[],
    contactPhone: '',
    contactWhatsapp: '',
    featured: false
  })
  const [hasSavedDraft, setHasSavedDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Load saved form data if editing or restore from localStorage
  useEffect(() => {
    if (property && isEditing) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        location: property.location,
        type: property.type,
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        squareFootage: property.squareFootage?.toString() || '',
        features: property.features,
        images: property.images,
        contactPhone: property.contactPhone,
        contactWhatsapp: property.contactWhatsapp,
        featured: property.featured || false
      })
      // Clear any draft when editing an existing property
      localStorage.removeItem(STORAGE_KEY)
    } else {
      // Check for saved draft
      const savedDraft = localStorage.getItem(STORAGE_KEY)
      if (savedDraft) {
        try {
          const parsedData = JSON.parse(savedDraft)
          setFormData(parsedData.formData)
          setHasSavedDraft(true)
          setLastSaved(parsedData.timestamp)
          toast.success('Your draft has been restored')
        } catch (error) {
          console.error('Error parsing saved draft:', error)
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [property, isEditing])

  // Auto-save form data periodically
  useEffect(() => {
    // Skip auto-saving when in edit mode or when form is empty
    if (isEditing || !formData.title) return
    
    // Save form data every 30 seconds if there are changes
    const autoSaveInterval = setInterval(() => {
      saveDraft(true)
    }, 30000)
    
    return () => clearInterval(autoSaveInterval)
  }, [formData, isEditing])

  // Save draft to localStorage
  const saveDraft = (isAuto = false) => {
    try {
      // Don't save if in edit mode
      if (isEditing) return

      // Check if form has some content worth saving
      if (!formData.title && !formData.description && !formData.location && formData.images.length === 0) {
        return
      }

      const timestamp = new Date().toISOString()
      const dataToSave = {
        formData,
        timestamp
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      setLastSaved(timestamp)
      setHasSavedDraft(true)
      
      if (!isAuto) {
        toast.success('Draft saved successfully')
      } else {
        setIsAutoSaving(true)
        setTimeout(() => setIsAutoSaving(false), 2000)
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      if (!isAuto) {
        toast.error('Failed to save draft')
      }
    }
  }

  // Clear saved draft
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setHasSavedDraft(false)
    setLastSaved(null)
    toast.success('Draft cleared')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file))

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.images.length === 0) {
        throw new Error('Please upload at least one image')
      }

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : null,
        features: formData.features.filter(f => f.trim() !== ''),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      if (isEditing && property) {
        await updateDoc(doc(db, 'properties', property.id), propertyData)
        toast.success('Property updated successfully')
      } else {
        await addDoc(collection(db, 'properties'), propertyData)
        toast.success('Property added successfully')
        // Clear draft after successful submission
        localStorage.removeItem(STORAGE_KEY)
      }

      router.push('/admin/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save property')
    } finally {
      setLoading(false)
    }

    console.log('Form Data:', formData);
  }
  
  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null
    try {
      const date = new Date(lastSaved)
      return date.toLocaleString()
    } catch (e) {
      return 'Recently'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Draft management info */}
      {!isEditing && (
        <div className={`flex items-center justify-between p-4 rounded-lg ${hasSavedDraft ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <div>
            {hasSavedDraft ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">
                  <span>{isAutoSaving ? 'Auto-saving...' : 'Draft available'}</span>
                  {lastSaved && !isAutoSaving && (
                    <span className="ml-2 text-blue-600/70">Last saved: {formatLastSaved()}</span>
                  )}
                </p>
                <p className="text-xs text-blue-600/80">Your progress is automatically saved every 30 seconds</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Your progress will be automatically saved as you type</p>
            )}
          </div>
          <div className="flex space-x-2">
            {hasSavedDraft && (
              <button
                type="button"
                onClick={clearDraft}
                className="px-3 py-1 text-xs text-red-600 hover:text-red-800 border border-red-200 rounded-md hover:bg-red-50"
              >
                Clear Draft
              </button>
            )}
            <button
              type="button"
              onClick={() => saveDraft()}
              className={`px-3 py-1 text-xs border rounded-md flex items-center space-x-1 
                ${hasSavedDraft ? 'text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50' : 'text-gray-600 hover:text-gray-800 border-gray-200 hover:bg-gray-100'}`}
            >
              <FaSave className="w-3 h-3" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Feature this property on homepage</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Square Footage</label>
          <input
            type="number"
            name="squareFootage"
            value={formData.squareFootage}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
          <input
            type="tel"
            name="contactWhatsapp"
            value={formData.contactWhatsapp}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter a feature"
            />
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Feature
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {formData.images.map((image, index) => (
            <div key={index} className="relative group bg-gray-100 rounded-lg">
              <div className="relative w-full pt-[75%]">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="rounded-lg object-cover"
                  unoptimized
                />
            <button
              type="button"
              onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
            >
                <FaTrash className="w-4 h-4" />
            </button>
              </div>
          </div>
        ))}
        </div>
        <div className="flex items-center justify-center w-full">
          <label className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border-2 border-dashed cursor-pointer transition-all duration-200 ${
            uploadingImages 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-blue-500 hover:bg-blue-50'
          }`}>
            <div className="flex flex-col items-center">
              <FaCloudUploadAlt className={`w-10 h-10 ${uploadingImages ? 'text-gray-400' : 'text-blue-500'}`} />
              <span className={`mt-2 text-base ${uploadingImages ? 'text-gray-400' : 'text-blue-500'}`}>
                {uploadingImages ? 'Uploading...' : 'Click to upload images'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {uploadingImages ? 'Please wait...' : 'Maximum 10 images (JPG, PNG, WebP)'}
            </span>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              max="10"
            />
          </label>
        </div>
        {uploadingImages && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
              <FaSpinner className="w-5 h-5 animate-spin" />
              <span>Uploading your images...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin mr-2" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>{isEditing ? 'Update Property' : 'Add Property'}</>
          )}
        </button>
      </div>
    </form>
  )
} 