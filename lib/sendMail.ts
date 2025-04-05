import { transporter } from "./email.config"

interface MailOptions {
  from: string
  to: string
  subject: string
  html: string

}

export const sendMailRequest = async (options: MailOptions) => {
  try {
    const response = await transporter.sendMail({
      from: `<${options.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    console.log(`Successfully sent mail to ${options.to}`)
    return response
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error sending mail:", errorMessage)
    throw new Error("Could not send email.")
  }
}
