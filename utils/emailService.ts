import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus?: string; // Add optional payment status
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const isPaymentConfirmed = data.paymentStatus === 'confirmed';
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your order! ${isPaymentConfirmed 
          ? 'Your payment has been successfully processed.' 
          : 'We have received your order and it is currently being processed.'}</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${data.total.toFixed(2)}</p>
          ${isPaymentConfirmed ? '<p style="color: green; font-weight: bold;">Payment Status: Confirmed</p>' : ''}
        </div>

        <h3 style="color: #333;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: right;">Quantity</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
          ${data.items.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
          <p style="margin: 0;">${data.shippingAddress.address}</p>
          <p style="margin: 0;">${data.shippingAddress.city}, ${data.shippingAddress.state}</p>
          <p style="margin: 0;">${data.shippingAddress.pincode}</p>
        </div>

        <p style="color: #666;">If you have any questions, please contact our customer support.</p>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    `;

    await addDoc(collection(db, 'mail'), {
      to: data.customerEmail,
      message: {
        subject: `Order Confirmation #${data.orderNumber}${isPaymentConfirmed ? ' - Payment Confirmed' : ''}`,
        html: emailHtml,
      },
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendAdminNotification(data: {
  orderId: string;
  total: number;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    specialRequest?: string;
    giftMessage?: string;
  }>;
  deliveryDate: Date;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  specialInstructions?: string;
  subtotal: number;
  paymentStatus?: string;
}) {
  try {
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${data.paymentStatus ? 'Payment Confirmed' : 'New Order Received'}</h1>
        ${data.paymentStatus ? `
          <div style="background-color: #e6ffe6; padding: 15px; margin: 20px 0;">
            <h2 style="color: #008000;">Payment Status: ${data.paymentStatus}</h2>
          </div>
        ` : ''}
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Customer Name:</strong> ${data.customerName}</p>
          <p><strong>Customer Email:</strong> ${data.customerEmail}</p>
          <p><strong>Delivery Date:</strong> ${data.deliveryDate.toLocaleDateString()}</p>
          <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> $${data.total.toFixed(2)}</p>
        </div>

        <div style="margin: 20px 0;">
          <h2>Items Ordered</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: right;">Quantity</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
            ${data.items.map(item => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  ${item.name}
                  ${item.specialRequest ? `<br><small>Special Request: ${item.specialRequest}</small>` : ''}
                  ${item.giftMessage ? `<br><small>Gift Message: ${item.giftMessage}</small>` : ''}
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <h2>Shipping Address</h2>
          <p><strong>Name:</strong> ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</p>
          <p><strong>Email:</strong> ${data.shippingAddress.email}</p>
          <p><strong>Phone:</strong> ${data.shippingAddress.phone}</p>
          <p><strong>Address:</strong> ${data.shippingAddress.address}</p>
          <p><strong>City:</strong> ${data.shippingAddress.city}</p>
          <p><strong>State:</strong> ${data.shippingAddress.state}</p>
          <p><strong>Pincode:</strong> ${data.shippingAddress.pincode}</p>
        </div>

        ${data.specialInstructions ? `
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h2>Special Instructions</h2>
            <p>${data.specialInstructions}</p>
          </div>
        ` : ''}

    
        <p>Access your Google Sheets to process this order.</p>
      </div>
    `;

    await addDoc(collection(db, 'mail'), {
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      message: {
        subject: data.paymentStatus 
          ? `Payment Confirmed - Order ${data.orderId}`
          : `New Order Received - ${data.orderId}`,
        html: adminEmailHtml,
      },
    });

    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}
