import { NextResponse } from 'next/server';
import { validateWebhook } from '@/utils/hitpayService';
import { confirmPayment } from '@/utils/orderService';
import { sendOrderConfirmationEmail, sendAdminNotification } from '@/utils/emailService';
import { getOrderById } from '@/utils/orderService';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Received webhook payload:', payload); // Add logging

    const hmac = payload.hmac;
    
    // Add logging for webhook validation
    console.log('Validating webhook with HMAC:', hmac);

    // Validate webhook signature
    if (!validateWebhook(payload, hmac)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log successful validation
    console.log('Webhook signature validated successfully');
    console.log('Payment status:', payload.status);

    if (payload.status === 'completed') {
      // Get reference number which is our orderId
      const orderId = payload.reference;
      
      try {
        // Process the successful payment
        await confirmPayment(orderId);
        
        // Get complete order details for email notifications
        const order = await getOrderById(orderId);
        
        if (order) {
          // Send customer confirmation email
          await sendOrderConfirmationEmail({
            orderNumber: orderId,
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            customerEmail: order.shippingAddress.email,
            total: order.total,
            items: order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            shippingAddress: {
              address: order.shippingAddress.address,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              pincode: order.shippingAddress.pincode
            }
          });
          
          // Send admin notification with payment confirmation
          await sendAdminNotification({
            orderId: orderId,
            total: order.total,
            subtotal: order.subtotal,
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            customerEmail: order.shippingAddress.email,
            items: order.items,
            deliveryDate: order.deliveryDate,
            shippingAddress: order.shippingAddress,
            specialInstructions: order.specialInstructions,
            subtotal: order.subtotal,
            paymentStatus: 'Payment Confirmed'
          });
        }
        
        // Log successful payment
        console.log('Payment completed successfully for reference:', orderId);
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
