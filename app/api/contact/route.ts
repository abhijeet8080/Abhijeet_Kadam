import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'
// Load environment variables
const userEmail = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const recipientEmail = process.env.RECIPIENT_EMAIL; 

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: emailPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Contact Form" <${userEmail}>`,
      to: recipientEmail, // Your email
      subject: "New Contact Form Submission",
      text: `You have received a new message:
      
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
