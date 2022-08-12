import { getBasicDetails, UserModel, UserRoles } from "../models/user.model"
import { db } from "../util/db"
import Joi from "joi"
import bcrypt from "bcrypt"
import crypto from "crypto"
import sendEmail from "../util/sendEmail"
import config from "../config"
import { Op } from "sequelize"

async function createUser(user: object, role: UserRoles) {
	try {
		const createUserSchema = Joi.object<UserModel & { password: string }>({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			title: Joi.string().required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			acceptTerms: Joi.boolean().valid(true).required(),
			role: Joi.string().valid(role).required(),
		})
		const { error, value } = createUserSchema.validate(user)
		if (error) {
			console.log("ERROR:", error)
			throw new Error(error.message)
		}
		console.log("VALUE:", value)
		const userAlreadyExists = await db.User.findOne({
			where: { email: value.email, role: value.role },
		})
		if (userAlreadyExists) {
			throw new Error(
				`User with email ${value.email} and role ${value.role} already exists.`
			)
		}
		const passwordHash = await bcrypt.hash(value.password, 10)
		const verificationToken = crypto.randomBytes(40).toString("hex")
		const newUser = await db.User.create({
			...value,
			passwordHash,
			verificationToken,
		})

		const verifyUrl = `${config.baseUrl}/account/verify-email?token=${newUser.verificationToken}`

		await sendEmail({
			to: newUser.email,
			subject: "Verify your email address",
			html: `<p>Please click the below link to verify your email address:</p>
			<p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
		})

		return newUser
	} catch (error) {
		console.error(error)
		return null
	}
}

async function authenticateUser(body: object) {
	try {
		const authenticateSchema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		})
		const { error, value } = authenticateSchema.validate(body)
		console.log(value)
		if (error) {
			throw new Error(error.message)
		}
		const user = await db.User.scope("withHash").findOne({
			where: { email: value.email },
		})
		console.log(user)
		if (!user || !user.verified) {
			throw new Error("Invalid credentials")
		}
		const valid = await bcrypt.compare(value.password, user.passwordHash)
		if (!valid) {
			throw new Error("Invalid credentials")
		}
		return getBasicDetails(user)
	} catch (error) {
		console.error(error)
		return null
	}
}

async function updateUser(user: object) {
	try {
		const updateUserSchema = Joi.object<UserModel & { password: string }>({
			id: Joi.number().required(),
			title: Joi.string(),
			firstName: Joi.string(),
			lastName: Joi.string(),
		})
		const { error, value } = updateUserSchema.validate(user)
		if (error) {
			throw new Error(error.message)
		}

		const userToUpdate = await db.User.findByPk(value.id)

		if (!userToUpdate) {
			throw new Error(`User not found.`)
		}

		await userToUpdate.update({ ...value })
		return userToUpdate
	} catch (error) {
		console.error(error)
		return null
	}
}

async function getUser(id: number) {
	try {
		const user = await db.User.findByPk(id)
		if (!user || !user.verified) {
			throw new Error(`User not found.`)
		}
		return user
	} catch (error) {
		console.error(error)
		return null
	}
}

async function deleteUser(id: number) {
	try {
		const user = await db.User.findByPk(id)
		if (!user) {
			throw new Error(`User not found.`)
		}
		await user.destroy()
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

async function getUsers() {
	try {
		const users = await db.User.findAll({ where: { role: "User" } })
		return users
	} catch (error) {
		console.error(error)
		return null
	}
}

async function getDoctors() {
	try {
		const users = await db.User.findAll({ where: { role: "Doctor" } })
		return users
	} catch (error) {
		console.error(error)
		return null
	}
}

async function verifyEmail(token: string) {
	try {
		const user = await db.User.findOne({
			where: { verificationToken: token },
		})

		if (!user) {
			throw new Error("Invalid token")
		}

		user.verified = new Date()
		user.verificationToken = null
		await user.save()
		return user
	} catch (error) {
		console.error(error)
		return null
	}
}

async function forgotPassword(email: string) {
	try {
		const user = await db.User.findOne({ where: { email } })

		// always return ok response to prevent email enumeration
		if (!user) {
			throw new Error("User not found")
		}

		// create reset token that expires after 24 hours
		user.resetToken = crypto.randomBytes(40).toString("hex")
		user.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

		await user.save()

		const resetUrl = `${config.baseUrl}/account/reset-password?token=${user.resetToken}`

		// send email
		await sendEmail({
			to: user.email,
			subject: "Password reset",
			html: `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
			<p><a href="${resetUrl}">${resetUrl}</a></p>`,
		})
	} catch (error) {
		console.error(error)
		return null
	}
}

async function validateResetToken(token: string) {
	try {
		const user = await db.User.findOne({
			where: {
				resetToken: token,
				resetTokenExpires: { [Op.gt]: Date.now() },
			},
		})

		if (!user) {
			throw new Error("Invalid token")
		}

		return user
	} catch (error) {
		console.error(error)
		return null
	}
}

async function resetPassword(body: object) {
	try {
		const schema = Joi.object({
			token: Joi.string().required(),
			password: Joi.string().required(),
		})
		const { error, value } = schema.validate(body)
		if (error) {
			throw new Error(error.message)
		}

		const user = await validateResetToken(value.token)

		if (!user) {
			throw new Error("Invalid token")
		}

		// update password and remove reset token
		const passwordHash = await bcrypt.hash(value.password, 10)
		user.passwordHash = passwordHash
		user.passwordReset = new Date()
		user.resetToken = null
		await user.save()
		return user
	} catch (error) {
		console.error(error)
		return null
	}
}

export default {
	createUser,
	authenticateUser,
	updateUser,
	getUser,
	deleteUser,
	getUsers,
	getDoctors,
	verifyEmail,
	forgotPassword,
	resetPassword,
} as const
