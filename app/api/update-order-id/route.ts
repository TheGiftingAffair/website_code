import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { temporaryOrderId, newOrderId } = await request.json();

    // Get the existing order
    const tempOrderRef = doc(db, 'orders', temporaryOrderId);
    const orderDoc = await getDoc(tempOrderRef);

    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    // Create new document with HitPay's reference number
    const newOrderRef = doc(db, 'orders', newOrderId);
    await setDoc(newOrderRef, {
      ...orderDoc.data(),
      id: newOrderId,
    });

    // Delete the temporary order
    await deleteDoc(tempOrderRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order ID:', error);
    return NextResponse.json(
      { message: 'Failed to update order ID' },
      { status: 500 }
    );
  }
}
