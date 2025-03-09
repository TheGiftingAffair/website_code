import { NextResponse } from "next/server";
import { sendAdminNotification } from "@/utils/emailService";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const success = await sendAdminNotification(data);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to send admin notification');
    }
  } catch (error) {
    console.error('Admin notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send admin notification' },
      { status: 500 }
    );
  }
}
