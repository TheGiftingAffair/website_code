import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
        <h1>Payment Confirmed - New Order</h1>
        <div style="background-color: #e6ffe6; padding: 15px; margin: 20px 0;">
          <h2 style="color: #008000;">Payment Status: Confirmed</h2>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Customer Name:</strong> ${data.customerName}</p>
          <p><strong>Customer Email:</strong> ${data.customerEmail}</p>
          <p><strong>Delivery Date:</strong> ${new Date(data.deliveryDate).toLocaleDateString()}</p>
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

        <p>Access your admin panel to process this order.</p>
      </div>
    `;

    // Get admin email from environment variable
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('Admin email not configured in environment variables');
      return false;
    }

    // IMPORTANT: Use the exact format expected by the Firebase Email Extension
    // https://github.com/firebase/extensions/blob/master/firestore-send-email/POSTINSTALL.md
    const emailDoc = {
      to: adminEmail,
      message: {
        subject: `New Order with Payment - ${data.orderId}`,
        text: `Payment confirmed for order ${data.orderId}. Customer: ${data.customerName}`,
        html: adminEmailHtml,
      }
    };

    console.log(`Creating email document for admin notification:`, data.orderId);
    
    try {
      const mailCollection = collection(db, 'mail');
      const docRef = await addDoc(mailCollection, emailDoc);
      console.log('Admin notification document created with ID:', docRef.id);
      
      // Log successful email document creation
      await addDoc(collection(db, 'emailLogs'), {
        type: 'admin-notification',
        orderId: data.orderId,
        emailSent: true,
        documentId: docRef.id,
        timestamp: new Date(),
        recipient: adminEmail
      });
      
      return true;
    } catch (error) {
      console.error(`Error creating email document:`, error);
      
      // Log the error
      await addDoc(collection(db, 'emailErrors'), {
        type: 'admin-notification',
        orderId: data.orderId,
        error: error.message || String(error),
        stack: error.stack || null,
        timestamp: new Date()
      });
      
      return false;
    }
  } catch (error) {
    console.error(`Error sending admin notification for order ${data.orderId}:`, error);
    return false;
  }
}

// Add a direct email utility function for testing
export async function sendDirectEmail(to: string, subject: string, htmlContent: string) {
  try {
    if (!to) {
      console.error('Email recipient is required');
      return false;
    }

    const emailDoc = {
      to: to,
      message: {
        subject: subject,
        text: subject, // Fallback plain text
        html: htmlContent,
      }
    };

    const mailCollection = collection(db, 'mail');
    const docRef = await addDoc(mailCollection, emailDoc);
    console.log('Test email document created with ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('Error sending direct test email:', error);
    return false;
  }
}

// Add a customer email confirmation function
export async function sendOrderConfirmationEmail(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus?: string;
}) {
  try {
    // Validate required fields first
    if (!data.customerEmail || !data.orderNumber) {
      console.error('Missing required email fields');
      return false;
    }

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

        ${data.items && data.items.length > 0 ? `
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
        ` : ''}

        ${data.shippingAddress ? `
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
            <p style="margin: 0;">${data.shippingAddress.address}</p>
            <p style="margin: 0;">${data.shippingAddress.city}, ${data.shippingAddress.state}</p>
            <p style="margin: 0;">${data.shippingAddress.pincode}</p>
          </div>
        ` : ''}

        <p style="color: #666;">If you have any questions, please contact our customer support.</p>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    `;

    // Create a simplified email document format
    const emailDoc = {
      to: data.customerEmail,
      message: {
        subject: `Order Confirmation #${data.orderNumber}${isPaymentConfirmed ? ' - Payment Confirmed' : ''}`,
        html: emailHtml,
        text: `Thank you for your order #${data.orderNumber}. ${isPaymentConfirmed ? 'Your payment has been confirmed.' : 'Your order is being processed.'}`
      }
    };
    
    console.log(`Sending customer email for order ${data.orderNumber} to ${data.customerEmail}`);
    const docRef = await addDoc(collection(db, 'mail'), emailDoc);
    console.log('Customer email queued with ID:', docRef.id);

    return true;
  } catch (error) {
    console.error(`Error sending customer email for order ${data.orderNumber}:`, error);
    return false;
  }
}
