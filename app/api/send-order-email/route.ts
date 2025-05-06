import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getOrderById } from '@/utils/orderService';

// Simple function to send an email document directly to Firebase
async function sendEmailToFirebase(to: string, subject: string, htmlContent: string) {
  try {
    const emailDoc = {
      to,
      message: {
        subject,
        html: htmlContent,
        text: subject // Fallback plain text
      }
    };

    const mailRef = await addDoc(collection(db, 'mail'), emailDoc);
    console.log('Email document created with ID:', mailRef.id);
    return true;
  } catch (error) {
    console.error('Error creating email document:', error);
    return false;
  }
}

// Handler for GET requests
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    if (!order.shippingAddress?.email) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Order Confirmation</h1>
        <p>Dear ${order.shippingAddress.firstName},</p>
        <p>Thank you for your order! We have received your order and it is being processed.</p>
        <p><strong>Order Number:</strong> ${order.id}</p>
        <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
        <p>You will receive updates on your order status shortly.</p>
      </div>
    `;
    
    const emailSent = await sendEmailToFirebase(
      order.shippingAddress.email,
      `Order Confirmation #${order.id}`,
      emailHtml
    );
    
    return NextResponse.json({
      success: emailSent,
      message: emailSent ? 'Email sent successfully' : 'Failed to send email'
    });
    
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ 
      error: 'Failed to send order email',
      message: error.message || String(error)
    }, { status: 500 });
  }
}

// Handler for POST requests
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { orderNumber, customerName, customerEmail, total, items, shippingAddress } = data;
    
    if (!customerEmail || !orderNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Order Confirmation</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! We have received your order and it is being processed.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> $${total?.toFixed(2) || '0.00'}</p>
        
        ${items && items.length > 0 ? `
          <h2>Items Ordered</h2>
          <ul>
            ${items.map((item: any) => `
              <li>${item.name} - Quantity: ${item.quantity} - $${item.price?.toFixed(2) || '0.00'}</li>
            `).join('')}
          </ul>
        ` : ''}
        
        <p>You will receive updates on your order status shortly.</p>
      </div>
    `;
    
    const emailSent = await sendEmailToFirebase(
      customerEmail,
      `Order Confirmation #${orderNumber}`,
      emailHtml
    );
    
    return NextResponse.json({
      success: emailSent,
      message: emailSent ? 'Email sent successfully' : 'Failed to send email'
    });
    
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ 
      error: 'Failed to send order email',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
