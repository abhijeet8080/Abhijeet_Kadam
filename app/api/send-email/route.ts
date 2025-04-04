import { NextRequest, NextResponse } from "next/server"
import { sendMailRequest } from "@/controller/Email"

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `

    await sendMailRequest({
      from: process.env.SMTP_MAIL!,
      to: process.env.RECIPIENT_EMAIL!, // set your receiving email in .env
      subject: "New Contact Form Submission",
      html,
    })

    return NextResponse.json({ success: true, message: "Email sent successfully!" })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
} 