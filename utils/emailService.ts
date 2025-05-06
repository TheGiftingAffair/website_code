import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'pranay.rajvanshi@gmail.com';
    
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>New Order Received - Payment Confirmed</h1>
        
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
                  ${item.specialRequest ? `<br><small><strong>Special Request:</strong> ${item.specialRequest}</small>` : ''}
                  ${item.giftMessage ? `<br><small><strong>Gift Message:</strong> ${item.giftMessage}</small>` : ''}
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

        <p>Please process this order at your earliest convenience.</p>
      </div>
    `;

    const emailDoc = {
      to: adminEmail,
      message: {
        subject: `New Order: ${data.orderId} - Payment Confirmed`,
        text: `New order received from ${data.customerName}. Order ID: ${data.orderId}. Total: $${data.total.toFixed(2)}`,
        html: adminEmailHtml,
      }
    };
    
    const mailRef = await addDoc(collection(db, 'mail'), emailDoc);
    return true;
  } catch (error) {
    console.error(`Failed to send admin notification for order ${data.orderId}:`, error);
    return false;
  }
}
