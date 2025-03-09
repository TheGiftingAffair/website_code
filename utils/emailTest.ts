import { sendOrderConfirmationEmail } from './emailService';

async function testEmail() {
  try {
    const result = await sendOrderConfirmationEmail({
      orderNumber: 'TEST123',
      customerName: 'Test User',
      customerEmail: 'your-test-email@example.com',
      total: 100,
      items: [{
        name: 'Test Item',
        quantity: 1,
        price: 100
      }],
      shippingAddress: {
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      }
    });
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test error:', error);
  }
}

// Run this file directly to test: node emailTest.js
if (require.main === module) {
  testEmail();
}
