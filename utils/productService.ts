import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  components?: string[];
  category?: string[];
  occasion?: string[];
  rating?: number;
  stock?: boolean;
}

export async function getProductById(productId: string | null | undefined): Promise<Product | null> {
  try {
    if (!productId) {
      console.warn('No product ID provided to getProductById');
      return null;
    }

    const productRef = doc(db, 'Products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.warn(`No product found with ID: ${productId} in Products collection`);
      return null;
    }

    const data = productSnap.data();
    
    // Return data exactly as it is in Firestore
    return {
      id: productId,
      name: data.name,
      price: data.price,
      image: data.image,  // Use image URL directly from Firestore
      description: data.description,
      components: data.components,
      category: data.category,
      occasion: data.occasion,
      rating: data.rating,
      stock: data.stock
    };

  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}
