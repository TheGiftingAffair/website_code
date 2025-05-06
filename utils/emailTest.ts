import { sendOrderConfirmationEmail, sendAdminNotification } from './emailService';

// Replace with your actual test email
const EMAIL_TO_TEST = 'your-test-email@example.com'; 

async function testEmail() {
  try {
    console.log('Starting email tests...');
    
    // Test #1: Standard customer email
    console.log('\nTest #1: Standard customer email');
    const result = await sendOrderConfirmationEmail({
      orderNumber: 'TEST123',
      customerName: 'Test User',
      customerEmail: EMAIL_TO_TEST,
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
    console.log('Standard email test result:', result);
    
    // Test #2: Email with payment confirmation
    console.log('\nTest #2: Email with payment confirmation');
    const paymentConfirmedResult = await sendOrderConfirmationEmail({
      orderNumber: 'TEST123-PAID',
      customerName: 'Test User',
      customerEmail: EMAIL_TO_TEST,
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
      paymentStatus: 'confirmed'
    });
    console.log('Payment confirmed email test result:', paymentConfirmedResult);
    
    // Test #3: Admin notification
    console.log('\nTest #3: Admin notification');
    const adminResult = await sendAdminNotification({
      orderId: 'TEST123-ADMIN',
      total: 100,
      subtotal: 100,
      customerName: 'Test User',
      customerEmail: EMAIL_TO_TEST,
      items: [{
        name: 'Test Item',
        quantity: 1,
        price: 100
      }],
      deliveryDate: new Date(),
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        email: EMAIL_TO_TEST,
        phone: '87654321',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      specialInstructions: 'This is a test order',
      paymentStatus: 'Payment Confirmed'
    });
    console.log('Admin notification test result:', adminResult);
    
    console.log('\nEmail tests completed.');
  } catch (error) {
    console.error('Email test error:', error);
  }
}

// Run this file directly to test: node emailTest.js
if (require.main === module) {
  console.log('==== Email Test Utility ====');
  console.log('Testing email to:', EMAIL_TO_TEST);
  testEmail();
}
