import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getOrderById } from '@/utils/orderService';

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
    
    // Get admin email from env
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
    
    // Create HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h1>Order Details: ${order.id}</h1>
        <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
        <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
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
    
    // Create mail document
    const mailDoc = {
      to: adminEmail,
      message: {
        subject: `Order Details: ${order.id}`,
        text: `Order details for ${order.id}`,
        html: emailHtml
      }
    };
    
    // Add to mail collection
    const docRef = await addDoc(collection(db, 'mail'), mailDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Admin email sent successfully',
      documentId: docRef.id,
      adminEmail
    });
    
  } catch (error) {
    console.error('Error sending admin email:', error);
    return NextResponse.json({
      error: 'Failed to send admin email',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
