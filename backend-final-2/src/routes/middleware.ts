import { Request, Response, NextFunction } from "express"

import { UserRoles } from "../models/user.model"
import { cookieProps } from "./auth.router"
import jwtUtil from "../util/jwt-util"

export const StatusCodes = {
	OK: 200,
	CREATED: 201,
	REDIRECT: 300,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const
// Constants
const { UNAUTHORIZED } = StatusCodes
const jwtNotPresentErr = "JWT not present in signed cookie."

/**
 * Middleware to verify if user is an admin.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function adminMw(req: Request, res: Response, next: NextFunction) {
	try {
		// Get json-web-token
		const jwt = req.signedCookies[cookieProps.key]
		if (!jwt) {
			throw Error(jwtNotPresentErr)
		}
		// Make sure user role is an admin
		const clientData = await jwtUtil.decode(jwt)
		if (
			typeof clientData === "object" &&
			clientData.role === UserRoles.Admin
		) {
			res.locals.sessionUser = clientData
			next()
		} else {
			throw Error(jwtNotPresentErr)
		}
	} catch (err) {
		return res.status(UNAUTHORIZED).json({
			error: "You are not authorized to access this resource.",
		})
	}
}
