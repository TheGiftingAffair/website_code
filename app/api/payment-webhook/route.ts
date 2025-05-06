import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment, getOrderById } from '@/utils/orderService';
import { sendAdminNotification, sendDirectEmail } from '@/utils/emailService';
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
          // Try multiple approaches to ensure email is sent
          let emailSent = false;
          
          // 1. Try standard admin notification
          try {
            emailSent = await sendAdminNotification({
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
            
            if (emailSent) {
              console.log('Admin notification sent successfully');
            } else {
              console.warn('Admin notification function returned false');
            }
          } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
          }
          
          // 2. If standard notification failed, try direct email
          if (!emailSent) {
            try {
              const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
              if (adminEmail) {
                emailSent = await sendDirectEmail(
                  adminEmail,
                  `URGENT: New Order Payment - ${order.id}`,
                  `<div style="font-family: Arial, sans-serif;">
                    <h2>New Order Payment Received</h2>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                    <p><strong>Amount:</strong> $${order.total.toFixed(2)}</p>
                    <p>This is a fallback email notification. Please check your admin panel for complete details.</p>
                  </div>`
                );
                
                if (emailSent) {
                  console.log('Fallback admin email sent successfully');
                }
              }
            } catch (fallbackError) {
              console.error('Error sending fallback email:', fallbackError);
            }
          }
          
          // 3. Last resort - try a direct document insert
          if (!emailSent) {
            try {
              const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
              if (adminEmail) {
                await addDoc(collection(db, 'mail'), {
                  to: adminEmail,
                  message: {
                    subject: `URGENT: Order ${order.id} - Direct Insert`,
                    text: `New order received: ${order.id}`,
                    html: `<p>New order with payment: ${order.id}</p>`
                  }
                });
                console.log('Direct mail document created');
              }
            } catch (directError) {
              console.error('Error with direct document insert:', directError);
            }
          }
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
