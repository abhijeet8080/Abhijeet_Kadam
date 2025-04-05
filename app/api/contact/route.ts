import { NextResponse } from "next/server"
import { sendMailRequest } from "@/lib/sendMail"

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  const mailHTML = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `

  try {
    await sendMailRequest({
      from: process.env.SMTP_MAIL || "",
      to: process.env.RECIPIENT_EMAIL || "", 
      subject: "Contact Form Submission",
      html: mailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: `Failed to send email: ${error}` }, { status: 500 })
  }
}
