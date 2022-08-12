import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import config from "../config"

async function sendEmail({
	to,
	subject,
	html,
	from = config.emailFrom,
}: Mail.Options) {
	try {
		const transporter = nodemailer.createTransport(config.smtpOptions)
		await transporter.sendMail({ from, to, subject, html })
	} catch (error) {
		console.log(error)
	}
}

export default sendEmail
