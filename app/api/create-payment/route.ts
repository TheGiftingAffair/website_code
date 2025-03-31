import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/utils/hitpayService';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name, orderData, temporaryOrderId } = await request.json();
    console.log('Processing payment for temporary order:', temporaryOrderId);

    // Validate required fields
    if (!amount || !currency || !email || !name || !temporaryOrderId) {
      console.error('Missing required fields:', { amount, currency, email, name, temporaryOrderId });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('redirect_url', `${baseUrl}/payment/success`);
    formData.append('webhook', `${baseUrl}/api/payment-webhook`);
    formData.append('reference_number', temporaryOrderId); // Use the temporary order ID
    formData.append('currency', currency);
    formData.append('amount', amount.toString()); // Ensure amount is string
    formData.append('name', name);
    formData.append('purpose', `Order ${temporaryOrderId}`);

    try {
      console.log('Creating payment request with data:', Object.fromEntries(formData));
      const paymentRequest = await createPaymentRequest(formData);

      if (!paymentRequest || !paymentRequest.url) {
        console.error('Invalid payment response:', paymentRequest);
        throw new Error('Invalid payment response from HitPay');
      }

      console.log('Payment request created successfully:', {
        url: paymentRequest.url,
        id: paymentRequest.id,
        referenceNumber: paymentRequest.reference_number
      });

      // Update order ID to match HitPay's reference number
      try {
        await fetch('/api/update-order-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temporaryOrderId,
            newOrderId: paymentRequest.reference_number,
          }),
        });
      } catch (updateError) {
        console.error('Failed to update order ID:', updateError);
      }

      return NextResponse.json({
        url: paymentRequest.url,
        paymentId: paymentRequest.id,
        orderId: paymentRequest.reference_number
      });

    } catch (paymentError: any) {
      console.error('Payment creation error details:', paymentError);
      return NextResponse.json(
        { 
          message: 'Payment creation failed',
          error: paymentError.message,
          details: paymentError.response?.data 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { message: 'Failed to process request', error: error.message },
      { status: 400 }
    );
  }
}
