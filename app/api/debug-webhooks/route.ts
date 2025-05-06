import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    // Check if the request includes an authorization header
    const url = new URL(request.url);
    const authKey = url.searchParams.get('key');
    
    // Simple auth to prevent public access
    if (authKey !== process.env.WEBHOOK_DEBUG_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get limit from query params or default to 10
    const limitParam = parseInt(url.searchParams.get('limit') || '10');
    const maxLimit = Math.min(limitParam, 50); // Cap at 50 to prevent large queries
    
    // Get recent webhook logs
    const logsQuery = query(
      collection(db, 'webhookLogs'),
      orderBy('timestamp', 'desc'),
      limit(maxLimit)
    );
    
    const logsSnapshot = await getDocs(logsQuery);
    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.().toISOString() || null
    }));
    
    // Get recent email errors
    const errorsQuery = query(
      collection(db, 'emailErrors'),
      orderBy('timestamp', 'desc'),
      limit(maxLimit)
    );
    
    const errorsSnapshot = await getDocs(errorsQuery);
    const errors = errorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.().toISOString() || null
    }));
    
    return NextResponse.json({
      webhookLogs: logs,
      emailErrors: errors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug webhook error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve webhook logs',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
