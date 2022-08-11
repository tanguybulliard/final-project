const config = require("config.json")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { Op } = require("sequelize")
const sendEmail = require("_helpers/send-email")
const db = require("_helpers/db")
const Role = require("_helpers/role")

module.exports = {
	authenticate,
	refreshToken,
	revokeToken,
	register,
	verifyEmail,
	forgotPassword,
	validateResetToken,
	resetPassword,
	getAll,
	getById,
	create,
	update,
	delete: _delete,
	getDoctorAppointments,
	createDoctorAppointment,
}

async function authenticate({ email, password, ipAddress }) {
	const doctor = await db.Doctor.scope("withHash").findOne({
		where: { email },
	})

	console.log(doctor)

	if (
		!doctor ||
		!doctor.isVerified ||
		!(await bcrypt.compare(password, doctor.passwordHash))
	) {
		throw "Email or password is incorrect"
	}

	// authentication successful so generate jwt and refresh tokens
	const jwtToken = generateJwtToken(doctor)
	const refreshToken = generateRefreshToken(doctor, ipAddress)

	// save refresh token
	await refreshToken.save()

	// return basic details and tokens
	return {
		...basicDetails(doctor),
		jwtToken,
		refreshToken: refreshToken.token,
	}
}

async function refreshToken({ token, ipAddress }) {
	try {
		console.log("567 refresh token", token, ipAddress)
		const refreshToken = await getRefreshToken(token)
		const doctor = await db.Doctor.findByPk(refreshToken.doctorId)

		console.log(
			"\n\n567 refresh token",
			refreshToken.token,
			doctor,
			refreshToken.doctorId
		)
		// replace old refresh token with a new one and save
		const newRefreshToken = generateRefreshToken(doctor, ipAddress)
		refreshToken.revoked = Date.now()
		refreshToken.revokedByIp = ipAddress
		refreshToken.replacedByToken = newRefreshToken.token
		await refreshToken.save()
		await newRefreshToken.save()

		// generate new jwt
		const jwtToken = generateJwtToken(doctor)

		// return basic details and tokens
		return {
			...basicDetails(doctor),
			jwtToken,
			refreshToken: newRefreshToken.token,
		}
	} catch (e) {
		console.log("\n\n\n\n\n NOOOOPE", e, token)
	}
}

async function revokeToken({ token, ipAddress }) {
	const refreshToken = await getRefreshToken(token)

	// revoke token and save
	refreshToken.revoked = Date.now()
	refreshToken.revokedByIp = ipAddress
	await refreshToken.save()
}

async function register(params, origin) {
	console.log(`\n\n REGISTERING \n ${params}`)
	// validate
	if (await db.Doctor.findOne({ where: { email: params.email } })) {
		// send already registered error in email to prevent account enumeration
		return await sendAlreadyRegisteredEmail(params.email, origin)
	}
	console.log("created")
	// create account object
	const doctor = new db.Doctor({ ...params, verified: new Date() })

	// first registered account is an admin
	const isFirstAccount = (await db.Doctor.count()) === 0
	doctor.role = isFirstAccount ? Role.Admin : Role.User
	doctor.verificationToken = randomTokenString()

	// hash password
	doctor.passwordHash = await hash(params.password)

	// save account
	await doctor.save()

	// send email
	await sendVerificationEmail(doctor, origin)
}

async function verifyEmail({ token }) {
	const doctor = await db.Doctor.findOne({
		where: { verificationToken: token },
	})

	if (!doctor) throw "Verification failed"

	doctor.verified = Date.now()
	doctor.verificationToken = null
	await doctor.save()
}

async function forgotPassword({ email }, origin) {
	const doctor = await db.Doctor.findOne({ where: { email } })

	// always return ok response to prevent email enumeration
	if (!doctor) return

	// create reset token that expires after 24 hours
	doctor.resetToken = randomTokenString()
	doctor.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
	await doctor.save()

	// send email
	await sendPasswordResetEmail(doctor, origin)
}

async function validateResetToken({ token }) {
	const doctor = await db.Doctor.findOne({
		where: {
			resetToken: token,
			resetTokenExpires: { [Op.gt]: Date.now() },
		},
	})

	if (!doctor) throw "Invalid token"

	return doctor
}

async function resetPassword({ token, password }) {
	const doctor = await validateResetToken({ token })

	// update password and remove reset token
	doctor.passwordHash = await hash(password)
	doctor.passwordReset = Date.now()
	doctor.resetToken = null
	await doctor.save()
}

async function getAll() {
	const doctor = await db.Doctor.findAll()
	return doctor.map((x) => basicDetails(x))
}

async function getById(id) {
	const doctor = await getAccount(id)
	return basicDetails(account)
}

async function create(params) {
	// validate
	if (await db.Doctor.findOne({ where: { email: params.email } })) {
		throw 'Email "' + params.email + '" is already registered'
	}

	const doctor = new db.Doctor(params)
	doctor.verified = Date.now()

	// hash password
	doctor.passwordHash = await hash(params.password)

	// save account
	await doctor.save()

	return basicDetails(doctor)
}

async function update(id, params) {
	const account = await getAccount(id)

	// validate (if email was changed)
	if (
		params.email &&
		doctor.email !== params.email &&
		(await db.Doctor.findOne({ where: { email: params.email } }))
	) {
		throw 'Email "' + params.email + '" is already taken'
	}

	// hash password if it was entered
	if (params.password) {
		params.passwordHash = await hash(params.password)
	}

	// copy params to account and save
	Object.assign(doctor, params)
	doctor.updated = Date.now()
	await doctor.save()

	return basicDetails(doctor)
}

async function _delete(id) {
	const doctor = await getAccount(id)
	await doctor.destroy()
}

// helper functions

async function getDoctorAppointments(id) {
	const appointments = await db.Appointement.findAll({
		where: { doctorId: doctor.id },
	})
	return appointments.map((x) => basicDetailsAppointment(x))
}

async function createDoctorAppointment(doctorId, accountId, params) {
	const doctor = await getAccount(doctorId)
	const appointment = new db.Appointement(params)
	appointment.doctorId = doctor.id
	appointment.accountId = accountId
	await appointment.save()
	return appointment
}

async function getAccount(id) {
	const doctor = await db.Doctor.findByPk(id)
	if (!doctor) throw "Account not found"
	return doctor
}

async function getRefreshToken(token) {
	console.log("\nREFRESH TOKEN", token)
	const refreshToken = await db.RefreshToken.findOne({ where: { token } })
	console.log("\nREFRESH TOKEN", refreshToken)
	if (!refreshToken || !refreshToken.isActive) throw "Invalid token"
	return refreshToken
}

async function hash(password) {
	return await bcrypt.hash(password, 10)
}

function generateJwtToken(doctor) {
	// create a jwt token containing the account id that expires in 15 minutes
	return jwt.sign({ sub: doctor.id, id: doctor.id }, config.secret, {
		expiresIn: "15m",
	})
}

function generateRefreshToken(doctor, ipAddress) {
	try {
		console.log(doctor)
		// create a refresh token that expires in 7 days
		return new db.RefreshToken({
			doctorId: doctor.id,
			token: randomTokenString(),
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			createdByIp: ipAddress,
		})
	} catch (e) {
		console.log("OOPS CANNOT GENERATE TOKEN", e)
	}
}

function randomTokenString() {
	return crypto.randomBytes(40).toString("hex")
}

function basicDetails(doctor) {
	const {
		id,
		title,
		firstName,
		lastName,
		email,
		address,
		role,
		created,
		updated,
		isVerified,
	} = doctor
	return {
		id,
		title,
		firstName,
		lastName,
		email,
		address,
		role,
		created,
		updated,
		isVerified,
	}
}

function basicDetailsAppointment(appointment) {
	const { id, hour, doctorId, AccountId } = doctor
	return {
		id,
		hour,
		doctorId,
		AccountId,
	}
}

async function sendVerificationEmail(doctor, origin) {
	let message
	if (origin) {
		const verifyUrl = `${origin}/doctor/verify-email?token=${doctor.verificationToken}`
		message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
	} else {
		message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code>  route:</p>
                   <p><code>${doctor.verificationToken}</code></p>`
	}

	await sendEmail({
		to: doctor.email,
		subject: "Sign-up Verification  - Verify Email",
		html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
	})
}

async function sendAlreadyRegisteredEmail(email, origin) {
	let message
	if (origin) {
		message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`
	} else {
		message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code>  route.</p>`
	}

	await sendEmail({
		to: email,
		subject: "Sign-up Verification  - Email Already Registered",
		html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
	})
}

async function sendPasswordResetEmail(doctor, origin) {
	let message
	if (origin) {
		const resetUrl = `${origin}/account/reset-password?token=${doctor.resetToken}`
		message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`
	} else {
		message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code>  route:</p>
                   <p><code>${doctor.resetToken}</code></p>`
	}

	await sendEmail({
		to: doctor.email,
		subject: "Sign-up Verification - Reset Password",
		html: `<h4>Reset Password Email</h4>
               ${message}`,
	})
}
