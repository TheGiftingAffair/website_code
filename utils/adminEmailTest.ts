import { sendAdminNotification } from './emailService';

async function testAdminEmail() {
  try {
    console.log('Testing admin notification email...');
    console.log('Admin email configured as:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    
    const result = await sendAdminNotification({
      orderId: 'TEST-ORDER-123',
      total: 150,
      subtotal: 150,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      items: [{
        name: 'Test Product',
        quantity: 2,
        price: 75,
        specialRequest: 'Test special request',
        giftMessage: 'Test gift message'
      }],
      deliveryDate: new Date(),
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '87654321',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      specialInstructions: 'Test special instructions',
      paymentStatus: 'Payment Confirmed'
    });
    
    if (result) {
      console.log('✅ Admin notification email queued successfully!');
      console.log('Check Firebase for the mail collection document.');
    } else {
      console.error('❌ Failed to queue admin notification email.');
    }
  } catch (error) {
    console.error('Error in admin email test:', error);
  }
}

// Run this file directly to test
if (require.main === module) {
  testAdminEmail()
    .then(() => console.log('Test completed'))
    .catch(console.error);
}

export default testAdminEmail;
