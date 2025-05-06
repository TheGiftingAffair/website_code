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
    
    // Log webhook receipt
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
        
        // Get complete order details
        const order = await getOrderById(orderId);
        
        if (order) {
          console.log('Payment confirmed for order:', orderId, 'Sending ADMIN-ONLY notification');
          
          // ONLY send admin notification - no customer emails
          try {
            const adminEmailSent = await sendAdminNotification({
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
            
            if (adminEmailSent) {
              console.log('Admin notification sent successfully for order:', orderId);
              
              // Log successful admin email
              await addDoc(collection(db, 'adminEmailLogs'), {
                orderId: order.id,
                timestamp: new Date(),
                success: true
              });
            } else {
              console.error('Failed to send admin notification for order:', orderId);
              
              // Try fallback direct method as last resort
              const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
              if (adminEmail) {
                const mailDoc = {
                  to: adminEmail,
                  message: {
                    subject: `URGENT: New Order Payment - ${order.id}`,
                    text: `New order with payment confirmed: ${order.id}`,
                    html: `
                      <div style="font-family: Arial, sans-serif;">
                        <h1>New Order with Payment Confirmed</h1>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                        <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
                        <p><strong>Amount:</strong> $${order.total.toFixed(2)}</p>
                        <p>Please check your admin panel for complete order details.</p>
                      </div>
                    `
                  }
                };
                
                await addDoc(collection(db, 'mail'), mailDoc);
                console.log('Fallback admin notification attempt for order:', orderId);
              }
            }
          } catch (emailError) {
            console.error('Error during admin email notification:', emailError);
          }
        } else {
          console.error('Order not found:', orderId);
        }
        
        return NextResponse.json({ 
          message: 'Payment processed successfully',
          orderId: orderId
        });
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
