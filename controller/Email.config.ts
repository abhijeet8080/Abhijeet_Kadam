import nodemailer, { Transporter } from "nodemailer"

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with SMTP configuration:", error)
  } else {
    console.log("SMTP configuration is correct:", success)
  }
})

export { transporter }
