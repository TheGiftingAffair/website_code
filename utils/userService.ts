import { db } from '@/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserData } from '@/types/user';

export const createUserDocument = async (
  uid: string,
  userData: Omit<UserData, 'uid' | 'orderIds' | 'createdAt' | 'updatedAt'>
) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: UserData = {
        uid,
        ...userData,
        orderIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userRef, newUser);
      return newUser;
    }

    return userSnap.data() as UserData;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserData = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }
  return null;
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If document doesn't exist, create it first
      await createUserDocument(uid, {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        ...data
      });
    } else {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};
