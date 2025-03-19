// @ts-nocheck
'use client'

import PropertyForm from '@/app/components/PropertyForm'

export default function NewProperty() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to add a new property listing.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <PropertyForm />
      </div>
    </div>
  )
}