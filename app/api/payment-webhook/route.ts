import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment, getOrderById } from '@/utils/orderService';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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
      
      // Get order details
      const order = await getOrderById(orderId);
      
      if (order) {
        // Send admin notification directly - no service function
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
        
        // Create simple HTML email
        const emailHtml = `
          <div style="font-family: Arial, sans-serif;">
            <h1>New Order with Payment Confirmed</h1>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
            <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            
            <h2>Items</h2>
            <ul>
              ${order.items.map(item => `
                <li>
                  ${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(2)}
                  ${item.giftMessage ? `<br>Gift Message: ${item.giftMessage}` : ''}
                  ${item.specialRequest ? `<br>Special Request: ${item.specialRequest}` : ''}
                </li>
              `).join('')}
            </ul>
            
            <h2>Shipping Address</h2>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
            
            ${order.specialInstructions ? `
              <h2>Special Instructions</h2>
              <p>${order.specialInstructions}</p>
            ` : ''}
          </div>
        `;
        
        // Create direct mail document - as simple as possible
        try {
          await addDoc(collection(db, 'mail'), {
            to: adminEmail,
            message: {
              subject: `New Order: ${order.id} - Payment Confirmed`,
              html: emailHtml
            }
          });
          console.log(`Admin email sent for order: ${orderId}`);
        } catch (emailError) {
          console.error('Failed to create admin email:', emailError);
        }
      }
      
      return NextResponse.json({ message: 'Payment processed successfully' });
    } else {
      return NextResponse.json({ message: `Payment not completed (status: ${payload.status})` }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
