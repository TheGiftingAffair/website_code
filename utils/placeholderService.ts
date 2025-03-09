import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const getPlaceholderImage = async (imageName: string): Promise<string> => {
  try {
    const docRef = doc(db, 'PlaceHolderImages', imageName);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().link;
    }
    throw new Error('Image not found');
  } catch (error) {
    console.error('Error fetching placeholder image:', error);
    return ''; // Return empty string or a default image URL
  }
};
