import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/utils/emailService';
import { getOrderById } from '@/utils/orderService';

// This endpoint is only for manual testing and should not be used in production
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const result = await sendAdminNotification({
      orderId: order.id,
      total: order.total,
      subtotal: order.subtotal,
      customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      customerEmail: order.shippingAddress.email,
      items: order.items,
      deliveryDate: order.deliveryDate,
      shippingAddress: order.shippingAddress,
      specialInstructions: order.specialInstructions || '',
      subtotal: order.subtotal,
      paymentStatus: 'Payment Confirmed'
    });
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
