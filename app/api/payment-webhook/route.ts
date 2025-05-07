import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Received webhook payload:', payload); // Add logging

    const hmac = payload.hmac;
    
    // Add logging for webhook validation
    console.log('Validating webhook with HMAC:', hmac);

    // Validate webhook signature
    if (!validateWebhook(payload, hmac)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log successful validation
    console.log('Webhook signature validated successfully');
    console.log('Payment status:', payload.status);

    if (payload.status === 'completed') {
      // Log successful payment
      console.log('Payment completed successfully for reference:', payload.reference);
      return NextResponse.json({ message: 'Webhook processed successfully' });
    } else {
      console.log('Payment not completed. Status:', payload.status);
      return NextResponse.json(
        { message: 'Payment not completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
