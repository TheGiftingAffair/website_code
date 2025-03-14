import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const hmac = payload.hmac;

    // Validate webhook signature
    if (!validateWebhook(payload, hmac)) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      );
    }

    if (payload.status === 'completed') {
      // Retrieve order data from temporary storage using reference_number
      // Process the order here
      
      return NextResponse.json({ message: 'Webhook processed successfully' });
    } else {
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
