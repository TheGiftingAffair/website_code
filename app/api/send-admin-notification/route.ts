import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({ 
    error: 'This endpoint is deprecated. Admin notifications are sent automatically after payment confirmation.' 
  }, { status: 400 });
}
