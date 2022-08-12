import { Request, Response } from "express"
import { UserRoles } from "../models/user.model"
import { cookieProps } from "../routes/auth.router"
import { StatusCodes } from "../routes/middleware"
import UserService from "../services/user.service"
import { db } from "../util/db"
import jwtUtil from "../util/jwt-util"

export function signupController(role: UserRoles) {
	return async function signup(req: Request, res: Response) {
		try {
			const user = await UserService.createUser(req.body, role)
			if (!user) {
				return res.status(400).json({
					message: "User already exists",
				})
			}

			const jwt = await jwtUtil.sign({
				id: user.id,
				role: user.role,
			})

			res.cookie(cookieProps.key, jwt, cookieProps.options)

			res.status(StatusCodes.CREATED).json(user)
		} catch (e) {
			res.status(500).json({
				message: "Something went wrong.",
			})
		}
	}
}

export function signinController() {
	return async function signup(req: Request, res: Response) {
		try {
			const user = await UserService.authenticateUser(req.body)
			console.log("\n\nAuthenticate user: ", user, req.body)
			if (!user) {
				return res.status(401).json({
					message: "Invalid credentials",
				})
			}

			const role = req.params.role

			// Check if sign in for doctor or user. If admin let user signin with either permissions
			if (user.role !== UserRoles.Admin && (!role || user.role !== role)) {
				return res.status(401).json({
					message: "Invalid credentials",
				})
			}

			const jwt = await jwtUtil.sign({
				id: user.id,
				role: user.role,
			})

			await res.cookie(cookieProps.key, jwt, cookieProps.options)

			res.status(StatusCodes.CREATED).json(user)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				message: "Something went wrong.",
			})
		}
	}
}

export function getUserController() {
	return async function signup(req: Request, res: Response) {
		try {
			const accessToken = req.cookies[cookieProps.key]
			if (!accessToken) {
				return res.status(401).end()
			}

			const decodedToken = await jwtUtil.decode(accessToken)
			if (typeof decodedToken === "string" || !decodedToken?.id) {
				return res.status(401).end()
			}

			const user = await UserService.getUser(decodedToken.id)

			res.status(user ? StatusCodes.OK : StatusCodes.UNAUTHORIZED).json(user)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				message: "Something went wrong.",
			})
		}
	}
}

export function verifyEmailController() {
	return (req: Request, res: Response) => {
		try {
			const user = UserService.verifyEmail(req.body.token || "")
			if (!user) {
				return res.status(401).json({
					message: "Invalid token",
				})
			}

			res.status(StatusCodes.OK).json(user)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				message: "Something went wrong.",
			})
		}
	}
}

export const getDoctorsController = async (req: Request, res: Response) => {
	try {
		const doctors = await db.User.findAll({
			where: {
				role: UserRoles.Doctor,
			},
		})
		res.status(StatusCodes.OK).json(
			doctors.map((d) => ({
				id: d.id,
				name: `${d.firstName} ${d.lastName}`,
				email: d.email,
			}))
		)
	} catch (e) {
		console.error(e)
		res.status(500).json({
			message: "Something went wrong.",
		})
	}
}
