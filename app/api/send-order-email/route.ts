import { NextResponse } from 'next/server';

// Disable customer email sending
export async function POST(request: Request) {
  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  return NextResponse.json({ success: true });
}
