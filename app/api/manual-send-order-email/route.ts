import { NextResponse } from 'next/server';
import { getOrderById } from '@/utils/orderService';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Get order details
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
    
    // Create simple HTML email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h1>Order Details: ${order.id}</h1>
        <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
        <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
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
    
    // Create mail document directly
    const docRef = await addDoc(collection(db, 'mail'), {
      to: adminEmail,
      message: {
        subject: `Manual Order Email: ${order.id}`,
        html: emailHtml
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Email sent to admin'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
