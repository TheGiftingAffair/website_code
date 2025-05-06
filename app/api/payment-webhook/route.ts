import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment, getOrderById } from '@/utils/orderService';
import { sendAdminNotification } from '@/utils/emailService';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Validate webhook signature
    const hmac = payload.hmac;
    if (!validateWebhook(payload, hmac)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // Only process completed payments
    if (payload.status === 'completed') {
      const orderId = payload.reference;
      const paymentId = payload.payment_id;
      
      // Update order status to paid
      await confirmPayment(orderId, paymentId);
      
      // Get order details and send admin notification
      const order = await getOrderById(orderId);
      
      if (order) {
        try {
          await sendAdminNotification({
            orderId: order.id,
            total: order.total,
            subtotal: order.subtotal,
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            customerEmail: order.shippingAddress.email,
            items: order.items,
            deliveryDate: order.deliveryDate,
            shippingAddress: order.shippingAddress,
            specialInstructions: order.specialInstructions || '',
            paymentStatus: 'Payment Confirmed'
          });
        } catch (emailError) {
          console.error('Failed to send admin notification:', emailError);
        }
      } else {
        console.error('Order not found:', orderId);
      }
      
      return NextResponse.json({ 
        message: 'Payment processed successfully',
        orderId: orderId
      });
    } else {
      return NextResponse.json({ message: `Payment not completed (status: ${payload.status})` }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
