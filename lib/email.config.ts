import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP config error:", error)
  } else {
    console.log("SMTP config success:", success)
  }
})

export { transporter }
