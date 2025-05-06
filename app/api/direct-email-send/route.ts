import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
    const subject = url.searchParams.get('subject') || 'Test Email';
    
    // Create the email document with minimal data
    const timestamp = new Date().toISOString();
    try {
      const docRef = await addDoc(collection(db, 'mail'), {
        to: email,
        message: {
          subject: `${subject} - ${timestamp}`,
          html: `<p>This is a test email sent at ${timestamp}</p>`,
          text: `This is a test email sent at ${timestamp}`
        }
      });
      
      return NextResponse.json({
        success: true,
        documentId: docRef.id,
        email,
        timestamp
      });
      
    } catch (error) {
      console.error('Error creating mail document:', error);
      
      // Additional error details
      let additionalInfo = {};
      
      if (error instanceof Error) {
        additionalInfo = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };
      }
      
      return NextResponse.json({
        error: 'Failed to create mail document',
        details: additionalInfo,
        email,
        timestamp
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
