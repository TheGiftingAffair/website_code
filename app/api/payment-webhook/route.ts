import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment, getOrderById } from '@/utils/orderService';
import { sendAdminNotification } from '@/utils/emailService';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log webhook for debugging
    await addDoc(collection(db, 'webhookLogs'), {
      payload,
      timestamp: new Date()
    }).catch(err => console.error('Failed to log webhook:', err));
    
    // Extract hmac for validation
    const hmac = payload.hmac;

    // Validate webhook signature
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
      
      // Get order details
      const order = await getOrderById(orderId);
      
      if (order) {
        console.log(`Payment confirmed for order ${orderId}. Sending admin notification.`);
        
        // Send notification to admin email
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
            subtotal: order.subtotal,
            paymentStatus: 'Payment Confirmed'
          });
          
          // Also create direct admin email as backup
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
          await addDoc(collection(db, 'mail'), {
            to: adminEmail,
            message: {
              subject: `IMPORTANT: New Order ${order.id}`,
              text: `New order received: ${order.id}. Amount: $${order.total.toFixed(2)}`,
              html: `<div>
                <h1>New Order Notification</h1>
                <p>Order ID: ${order.id}</p>
                <p>Customer: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p>This is a backup notification. Check your admin panel for details.</p>
              </div>`
            }
          });
          
          console.log(`Admin notification sent for order ${orderId}`);
        } catch (emailError) {
          console.error('Failed to send admin notification:', emailError);
        }
      } else {
        console.error(`Order not found: ${orderId}`);
      }
      
      return NextResponse.json({ 
        message: 'Payment processed successfully',
        orderId: orderId
      });
    } else {
      return NextResponse.json({ message: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
