import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Get order details
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Create mock payload like HitPay would send
    const hitpaySalt = process.env.HITPAY_SALT;
    if (!hitpaySalt) {
      return NextResponse.json({ error: 'HITPAY_SALT not configured' }, { status: 500 });
    }
    
    const paymentId = `test_payment_${Date.now()}`;
    
    // Create mock payload
    const payload = {
      payment_id: paymentId,
      payment_request_id: `pr_${Date.now()}`,
      reference: orderId,
      status: 'completed',
      amount: orderDoc.data().total,
      currency: 'SGD',
      payment_type: 'paynow_online',
      created_at: new Date().toISOString(),
      // other fields HitPay would include
    };
    
    // Calculate HMAC signature
    const hmacSource = Object.keys(payload)
      .sort()
      .reduce((str, key) => `${str}${key}${payload[key]}`, "");
    
    const hmac = crypto
      .createHmac("sha256", hitpaySalt)
      .update(hmacSource)
      .digest("hex");
    
    // Add hmac to payload
    const fullPayload = {
      ...payload,
      hmac
    };
    
    // Call our own webhook endpoint
    const webhookResponse = await fetch(`${url.origin}/api/payment-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPayload),
    });
    
    const webhookResult = await webhookResponse.json();
    
    return NextResponse.json({
      success: webhookResponse.ok,
      webhookResponse: webhookResult,
      payload: fullPayload,
    });
    
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({
      error: 'Failed to test webhook',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
