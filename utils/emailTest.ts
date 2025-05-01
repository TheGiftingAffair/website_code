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
    
    // Testing email with payment confirmation indication
    console.log('Testing confirmation email with payment status...');
    // This would typically be sent from the webhook after payment confirmation
    const paymentConfirmedResult = await sendOrderConfirmationEmail({
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
      },
      paymentStatus: 'confirmed' // Add payment status
    });
    console.log('Payment confirmed email test result:', paymentConfirmedResult);
  } catch (error) {
    console.error('Email test error:', error);
  }
}

// Run this file directly to test: node emailTest.js
if (require.main === module) {
  testEmail();
}
