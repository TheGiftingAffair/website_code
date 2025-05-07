import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/utils/emailService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure we have payment status before sending admin notification
    if (!data.paymentStatus) {
      console.warn('No payment status provided for admin notification');
      return NextResponse.json({ warning: 'No payment status provided' }, { status: 200 });
    }
    
    const success = await sendAdminNotification({
      orderId: data.orderId,
      total: data.total,
      subtotal: data.subtotal,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      items: data.items,
      deliveryDate: new Date(data.deliveryDate),
      shippingAddress: data.shippingAddress,
      specialInstructions: data.specialInstructions,
      paymentStatus: data.paymentStatus
    });

    if (!success) {
      return NextResponse.json({ error: 'Failed to send admin notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin notification API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
