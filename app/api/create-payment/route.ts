import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/utils/hitpayService';
import { generateOrderId } from '@/utils/orderService';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name, orderData } = await request.json();
    console.log('Received payment request:', { amount, currency, email, name });

    // Generate synchronized order ID
    const orderId = await generateOrderId();

    // Validate required fields
    if (!amount || !currency || !email || !name) {
      console.error('Missing required fields:', { amount, currency, email, name });
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
    formData.append('reference_number', orderId);
    formData.append('currency', currency);
    formData.append('amount', amount.toString()); // Ensure amount is string
    formData.append('name', name);
    formData.append('purpose', `Order ${orderId}`);

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
        orderId
      });

      return NextResponse.json({
        url: paymentRequest.url,
        paymentId: paymentRequest.id,
        orderId: orderId
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
