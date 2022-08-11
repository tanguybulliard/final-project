const express = require("express")
const router = express.Router()
const Joi = require("joi")
const validateRequest = require("_middleware/validate-request")
const authorize = require("_middleware/authorize")
const Role = require("_helpers/role")
const doctorService = require("./doctor.service")
const db = require("../_helpers/db")

router.use((req, res, next) => {
	console.log(
		"########################################################\n\n\n IN THE DOCTOR",
		req.url,
		db
	)
	next()
})

// routes
router.post("/authenticate", authenticateSchemaDoctor, authenticateDoctor)
router.post("/refresh-token", refreshToken)
router.post("/revoke-token", authorize(), revokeTokenSchema, revokeToken)
router.post(
	"/register-doctor",
	(req, res, next) => {
		console.log("IN REGISTER DOCTOR")
		next()
	},
	registerSchemaDoctor,
	registerDoctor
)
router.post("/verify-email-doctor", verifyEmailSchema, verifyEmail)
router.post("/forgot-password-doctor", forgotPasswordSchema, forgotPassword)
router.post(
	"/validate-reset-token",
	validateResetTokenSchema,
	validateResetToken
)
router.post("/doctor-reset-password", resetPasswordSchema, resetPassword)
router.get("/", authorize(Role.Admin), getAll)
router.get("/all-doctors", getAll)
router.get("/:id", authorize(), getById)
router.post("/", authorize(Role.Admin), createSchema, create)
router.put("/:id", authorize(), updateSchema, update)
router.delete("/:id", authorize(), _delete)

module.exports = router

function authenticateSchemaDoctor(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required(),
	})
	validateRequest(req, next, schema)
}

function authenticateDoctor(req, res, next) {
	//TODO
	const { email, password } = req.body
	const ipAddress = req.ip
	console.log("AUTHENTICATING THE DOCTOR 1234\n", email, password, ipAddress)
	doctorService
		.authenticate({ email, password, ipAddress })
		.then(({ refreshToken, ...account }) => {
			console.log("OK\n\n", refreshToken, account)
			setTokenCookie(res, refreshToken)
			res.json(account)
		})
		.catch((e) => {
			console.log("!!!!!!\n\nAUTHENTICATE DOCTOR ERROR\n", e)
			next(e)
		})
}

function refreshToken(req, res, next) {
	const token = req.cookies.refreshToken
	console.log("\n\nREFREHS EHEHE \n\n\n\n", token)
	const ipAddress = req.ip
	if (!token) return res.status(200)
	doctorService
		.refreshToken({ token, ipAddress })
		.then(({ refreshToken, ...account }) => {
			setTokenCookie(res, refreshToken)
			res.json(account)
		})
		.catch((e) => {
			console.log("!!!!!!\n\nREFRESH TOKEN ERROR\n", e)
			next(e)
		})
}

function revokeTokenSchema(req, res, next) {
	const schema = Joi.object({
		token: Joi.string().empty(""),
	})
	validateRequest(req, next, schema)
}

function revokeToken(req, res, next) {
	// accept token from request body or cookie
	const token = req.body.token || req.cookies.refreshToken
	const ipAddress = req.ip

	if (!token) return res.status(400).json({ message: "Token is required" })

	// users can revoke their own tokens and admins can revoke any tokens
	if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	doctorService
		.revokeToken({ token, ipAddress })
		.then(() => res.json({ message: "Token revoked" }))
		.catch(next)
}

function registerSchemaDoctor(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().email().required(),
		address: Joi.string().required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
		acceptTerms: Joi.boolean().valid(true).required(),
	})
	validateRequest(req, next, schema)
}
function registerDoctor(req, res, next) {
	doctorService
		.register(req.body, req.get("origin"))
		.then(() =>
			res.json({
				message:
					"Registration successful, please check your email for verification instructions",
			})
		)
		.catch((e) => {
			console.log(e)
			next(e)
		})
}

function verifyEmailSchema(req, res, next) {
	const schema = Joi.object({
		token: Joi.string().required(),
	})
	validateRequest(req, next, schema)
}

function verifyEmail(req, res, next) {
	console.log("VERIFY EMAIL", req.query)
	doctorService
		.verifyEmail(req.body)
		.then(() =>
			res.json({ message: "Verification successful, you can now login" })
		)
		.catch(next)
}

function forgotPasswordSchema(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
	})
	validateRequest(req, next, schema)
}

function forgotPassword(req, res, next) {
	console.log(req.body)
	doctorService
		.forgotPassword(req.body, req.get("origin"))
		.then(() =>
			res.json({
				message: "Please check your email for password reset instructions",
			})
		)
		.catch(next)
}

function validateResetTokenSchema(req, res, next) {
	const schema = Joi.object({
		token: Joi.string().required(),
	})
	validateRequest(req, next, schema)
}

function validateResetToken(req, res, next) {
	doctorService
		.validateResetToken(req.body)
		.then(() => res.json({ message: "Token is valid" }))
		.catch(next)
}

function resetPasswordSchema(req, res, next) {
	const schema = Joi.object({
		token: Joi.string().required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
	})
	validateRequest(req, next, schema)
}

function resetPassword(req, res, next) {
	doctorService
		.resetPassword(req.body)
		.then(() =>
			res.json({ message: "Password reset successful, you can now login" })
		)
		.catch(next)
}

function getAll(req, res, next) {
	doctorService
		.getAll()
		.then((accounts) => res.json(accounts))
		.catch(next)
}

function getById(req, res, next) {
	// users can get their own account and admins can get any account
	if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	doctorService
		.getById(req.params.id)
		.then((account) => (account ? res.json(account) : res.sendStatus(404)))
		.catch(next)
}

function createSchema(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().email().required(),
		address: Joi.string().required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
		role: Joi.string().valid(Role.Admin, Role.User).required(),
	})
	validateRequest(req, next, schema)
}

function create(req, res, next) {
	doctorService
		.create(req.body)
		.then((account) => res.json(account))
		.catch(next)
}

function updateSchema(req, res, next) {
	const schemaRules = {
		title: Joi.string().empty(""),
		firstName: Joi.string().empty(""),
		lastName: Joi.string().empty(""),
		email: Joi.string().email().empty(""),
		address: Joi.string().empty(""),
		password: Joi.string().min(6).empty(""),
		confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
	}

	// only admins can update role
	if (req.user.role === Role.Admin) {
		schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty("")
	}

	const schema = Joi.object(schemaRules).with("password", "confirmPassword")
	validateRequest(req, next, schema)
}

function update(req, res, next) {
	// users can update their own account and admins can update any account
	if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	doctorService
		.update(req.params.id, req.body)
		.then((account) => res.json(account))
		.catch(next)
}

function _delete(req, res, next) {
	// users can delete their own account and admins can delete any account
	if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	doctorService
		.delete(req.params.id)
		.then(() => res.json({ message: "Account deleted successfully" }))
		.catch(next)
}

// helper functions

function setTokenCookie(res, token) {
	// create cookie with refresh token that expires in 7 days
	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	}
	res.cookie("refreshToken", token, cookieOptions)
}
