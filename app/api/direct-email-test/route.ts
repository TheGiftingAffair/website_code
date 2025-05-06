import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    
    // Security check
    if (secret !== process.env.WEBHOOK_DEBUG_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const email = url.searchParams.get('email') || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const subject = url.searchParams.get('subject') || 'Direct Email Test';
    const message = url.searchParams.get('message') || 'This is a direct test of the email system';
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Create the mail document directly with minimal fields
    try {
      const docRef = await addDoc(collection(db, 'mail'), {
        to: email,
        message: {
          subject: subject,
          text: message,
          html: `<p>${message}</p><p>Sent at: ${new Date().toISOString()}</p>`
        }
      });
      
      return NextResponse.json({
        success: true,
        documentId: docRef.id,
        email: email,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to create mail document:', error);
      return NextResponse.json({
        error: 'Failed to create mail document',
        message: error.message || String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
