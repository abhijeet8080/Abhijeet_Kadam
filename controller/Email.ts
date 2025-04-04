import { transporter } from "./Email.config"

interface MailOptions {
  from: string
  to: string
  subject: string
  html: string

}

export const sendMailRequest = async (options: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `<${options.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    console.log(`✅ Successfully sent mail to ${options.to}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("❌ Error sending verification email:", errorMessage)
    throw new Error("Could not send verification email.")
  }
}
