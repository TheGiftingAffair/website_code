import { NextResponse } from 'next/server';

// This endpoint is being completely disabled to prevent customer emails
export async function POST(request: Request) {
  console.warn('send-order-email endpoint used - this is disabled to prevent customer emails');
  return NextResponse.json({ 
    success: true, 
    message: 'Customer emails are disabled. Only admin notifications are sent after payment.'
  });
}

export async function GET(request: Request) {
  console.warn('send-order-email GET endpoint used - this is disabled to prevent customer emails');
  return NextResponse.json({ 
    success: true,
    message: 'Customer emails are disabled. Only admin notifications are sent after payment.'
  });
}
