import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/utils/hitpayService';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name, orderData } = await request.json();

    // Generate a unique reference number
    const referenceNumber = `TGA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create URL-encoded body
    const formData = new URLSearchParams();
    formData.append('email', email);
    
    // Use absolute URLs for redirect and webhook
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    formData.append('redirect_url', `${baseUrl}/payment/success`);
    formData.append('webhook', `${baseUrl}/api/payment-webhook`);
    formData.append('reference_number', referenceNumber);
    formData.append('currency', currency);
    formData.append('amount', amount.toFixed(2));
    formData.append('name', name);
    formData.append('purpose', 'Order payment');
    formData.append('payment_methods[]', 'paynow_online');
    formData.append('send_email', 'true');

    try {
      console.log('Making payment request with data:', Object.fromEntries(formData));
      const paymentRequest = await createPaymentRequest(formData);

      if (!paymentRequest || !paymentRequest.url) {
        console.error('Invalid payment request response:', paymentRequest);
        throw new Error('Invalid payment response from HitPay');
      }

      return NextResponse.json({
        url: paymentRequest.url,
        paymentId: paymentRequest.id,
        referenceNumber
      });

    } catch (paymentError: any) {
      console.error('Payment creation error details:', paymentError);
      return NextResponse.json(
        { message: paymentError.message || 'Payment creation failed' },
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
