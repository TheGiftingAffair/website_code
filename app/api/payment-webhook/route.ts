import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment, getOrderById } from '@/utils/orderService';
import { sendAdminNotification } from '@/utils/emailService';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    // Parse the payload
    const payload = await request.json();
    
    // Log webhook receipt to a debug collection for troubleshooting
    try {
      await addDoc(collection(db, 'webhookLogs'), {
        payload,
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Failed to log webhook:', logError);
    }
    
    const hmac = payload.hmac;

    // Validate webhook signature
    if (!validateWebhook(payload, hmac)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      );
    }

    if (payload.status === 'completed') {
      // Get reference number which is our orderId
      const orderId = payload.reference;
      const paymentId = payload.payment_id;
      
      try {
        // Process the successful payment
        await confirmPayment(orderId, paymentId);
        
        // Get complete order details for email notifications
        const order = await getOrderById(orderId);
        
        if (order) {
          // Send admin notification directly with payment confirmation
          const adminEmailResult = await sendAdminOrderEmail(order, paymentId);
          
          if (!adminEmailResult) {
            console.error('Failed to send admin email through normal channels, attempting direct write');
            
            // Fallback - Try to manually insert into mail collection
            try {
              const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
              if (adminEmail) {
                await addDoc(collection(db, 'mail'), {
                  to: adminEmail,
                  message: {
                    subject: `URGENT: Payment Confirmed - Order ${orderId}`,
                    html: `<div>
                      <h1>Payment Confirmed</h1>
                      <p>Order ID: ${orderId}</p>
                      <p>Customer: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                      <p>This is a fallback email. Please check your order admin panel.</p>
                    </div>`
                  },
                  timestamp: new Date()
                });
                console.log('Fallback admin email queued');
              }
            } catch (fallbackError) {
              console.error('Even fallback email failed:', fallbackError);
            }
          }
        } else {
          console.error('Order not found:', orderId);
        }
        
        return NextResponse.json({ message: 'Payment processed successfully' });
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        return NextResponse.json(
          { message: 'Error processing payment confirmation' },
          { status: 500 }
        );
      }
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

// Helper function to send admin email directly
async function sendAdminOrderEmail(order: any, paymentId: string) {
  try {
    return await sendAdminNotification({
      orderId: order.id,
      total: order.total,
      subtotal: order.subtotal,
      customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      customerEmail: order.shippingAddress.email,
      items: order.items,
      deliveryDate: order.deliveryDate,
      shippingAddress: order.shippingAddress,
      specialInstructions: order.specialInstructions,
      paymentStatus: 'Payment Confirmed'
    });
  } catch (error) {
    console.error('Error in admin email helper:', error);
    return false;
  }
}
