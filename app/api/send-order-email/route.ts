import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Return success without sending email to customer
  return NextResponse.json({ success: true });
}
