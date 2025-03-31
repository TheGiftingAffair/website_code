import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/utils/hitpayService';
import { generateOrderId } from '@/utils/orderService';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name, orderData } = await request.json();

    // Generate synchronized order ID
    const orderId = await generateOrderId();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('redirect_url', `${baseUrl}/payment/success`);
    formData.append('webhook', `${baseUrl}/api/payment-webhook`);
    formData.append('reference_number', orderId);
    formData.append('currency', currency);
    formData.append('amount', amount.toFixed(2));
    formData.append('name', name);
    formData.append('purpose', `Order ${orderId}`);

    try {
      console.log('Creating payment for order:', orderId);
      const paymentRequest = await createPaymentRequest(formData);

      if (!paymentRequest || !paymentRequest.url) {
        throw new Error('Invalid payment response from HitPay');
      }

      return NextResponse.json({
        url: paymentRequest.url,
        paymentId: paymentRequest.id,
        orderId: orderId
      });

    } catch (paymentError: any) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json(
        { message: paymentError.message || 'Payment creation failed' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 400 }
    );
  }
}
