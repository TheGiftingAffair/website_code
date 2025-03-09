import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/utils/emailService";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing");
      return NextResponse.json(
        { success: false, error: "Email configuration missing" },
        { status: 500 }
      );
    }

    const emailSent = await sendOrderConfirmationEmail(data);

    if (emailSent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Detailed error in email API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details:
          //@ts-ignore
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
