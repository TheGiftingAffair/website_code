import { NextResponse } from 'next/server';
import { sendDirectEmail } from '@/utils/emailService';
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, query, limit, orderBy } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    const adminKey = process.env.WEBHOOK_DEBUG_KEY; // Reuse the same debug key
    
    if (secret !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const email = url.searchParams.get('email') || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    if (!email) {
      return NextResponse.json({ error: 'No email address specified or configured' }, { status: 400 });
    }
    
    // Get the current mail collection structure
    const mailQuery = query(collection(db, 'mail'), orderBy('timestamp', 'desc'), limit(5));
    const mailDocs = await getDocs(mailQuery);
    const recentMail = mailDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Send test email with the current time
    const timestamp = new Date().toISOString();
    const result = await sendDirectEmail(
      email,
      `Test Email - ${timestamp}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Email System Test</h1>
          <p>This is a test email sent at: ${timestamp}</p>
          <p>If you received this email, the email system is working correctly.</p>
        </div>
      `
    );
    
    // Create a direct mail document as another test approach
    let directDocId = null;
    try {
      const directDoc = await addDoc(collection(db, 'mail'), {
        to: email,
        message: {
          subject: `Direct Test - ${timestamp}`,
          text: `This is a direct test email sent at ${timestamp}`,
          html: `<p>This is a direct test email sent at ${timestamp}</p>`
        }
      });
      directDocId = directDoc.id;
    } catch (directError) {
      console.error('Error creating direct mail document:', directError);
    }
    
    return NextResponse.json({
      success: true,
      email,
      timestamp,
      utilSuccess: result,
      directDocId,
      recentMail: recentMail.length > 0 ? recentMail : 'No recent mail documents found',
      mailCollectionExists: mailDocs.size >= 0
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      message: error.message || String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, secret } = await request.json();
    
    // Basic authentication
    if (secret !== process.env.WEBHOOK_DEBUG_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const targetEmail = email || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!targetEmail) {
      return NextResponse.json({ error: 'No email address specified' }, { status: 400 });
    }
    
    // Send test email directly to the mail collection
    const timestamp = new Date().toISOString();
    try {
      const docRef = await addDoc(collection(db, 'mail'), {
        to: targetEmail,
        message: {
          subject: `POST Test Email - ${timestamp}`,
          text: `This is a test email sent via POST at ${timestamp}`,
          html: `<p>This is a test email sent via POST at ${timestamp}</p>`,
        }
      });
      
      return NextResponse.json({
        success: true,
        documentId: docRef.id,
        email: targetEmail,
        timestamp
      });
    } catch (error) {
      console.error('Error creating mail document:', error);
      return NextResponse.json({
        error: 'Failed to create mail document',
        message: error.message || String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({
      error: 'Error processing request',
      message: error.message || String(error)
    }, { status: 400 });
  }
}
