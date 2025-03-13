// @ts-nocheck
import { collection, getDocs, query, where, orderBy, DocumentData, doc, getDoc } from 'firebase/firestore'
import { db } from './config'
import { Property, PropertyFilter } from '@/types/property'

const PROPERTIES_COLLECTION = 'properties'

export async function getProperties(filters?: PropertyFilter): Promise<Property[]> {
  try {
    let q = collection(db, PROPERTIES_COLLECTION)
    const constraints = []

    if (filters) {
      if (filters.type) {
        constraints.push(where('type', '==', filters.type))
      }
      if (filters.minPrice) {
        constraints.push(where('price', '>=', filters.minPrice))
      }
      if (filters.maxPrice) {
        constraints.push(where('price', '<=', filters.maxPrice))
      }
      if (filters.bedrooms) {
        constraints.push(where('bedrooms', '>=', filters.bedrooms))
      }
    }

    // Add default ordering
    constraints.push(orderBy('createdAt', 'desc'))

    q = query(q, ...constraints)
    const querySnapshot = await getDocs(q)
    
    let properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Property[]

    // Handle location filtering in memory since Firestore doesn't support partial text search
    if (filters?.location) {
      const searchLocation = filters.location.toLowerCase()
      properties = properties.filter(property => 
        property.location.toLowerCase().includes(searchLocation)
      )
    }

    console.log('Fetching properties with filters:', filters)
    console.log('Filtered properties:', properties)

    return properties
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // First try with the composite index
    try {
      const q = query(
        collection(db, PROPERTIES_COLLECTION),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      console.log('Fetching featured properties');
      console.log('Fetched featured properties:', querySnapshot.docs.map(doc => doc.data()));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Property[]
    } catch (indexError) {
      // If index doesn't exist yet, fallback to simple query
      console.warn('Featured properties index not ready, falling back to simple query')
      const q = query(
        collection(db, PROPERTIES_COLLECTION),
        where('featured', '==', true)
      )
      const querySnapshot = await getDocs(q)
      console.log('Fetching featured properties');
      console.log('Fetched featured properties:', querySnapshot.docs.map(doc => doc.data()));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Property[]
    }
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Property;
    } else {
      console.warn('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return null;
  }
} 