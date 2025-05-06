import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendDirectEmail } from '@/utils/emailService';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Sending test email to:', email);

    // Try both methods to identify what's working
    const regularResult = await sendOrderConfirmationEmail({
      orderNumber: 'TEST-' + new Date().getTime(),
      customerName: 'Test Customer',
      customerEmail: email,
      total: 199.99,
      items: [{
        name: 'Test Product 1',
        quantity: 1,
        price: 99.99
      }, {
        name: 'Test Product 2',
        quantity: 2,
        price: 49.99
      }],
      shippingAddress: {
        address: '123 Test Street',
        city: 'Singapore',
        state: 'Singapore',
        pincode: '123456'
      },
      paymentStatus: 'confirmed'
    });

    const directResult = await sendDirectEmail(
      email,
      'Test Email - Direct Method',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Test Email</h1>
          <p>This is a test email sent from your website to verify the email functionality.</p>
          <p>If you received this, your email system is working.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    );

    return NextResponse.json({ 
      success: regularResult || directResult,
      regularMethodSuccess: regularResult,
      directMethodSuccess: directResult,
      timeStamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
