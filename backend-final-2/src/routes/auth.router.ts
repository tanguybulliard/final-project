import { Request, Response, Router } from "express"
import {
	signupController,
	signinController,
	getUserController,
	verifyEmailController,
} from "../controllers/user.controller"
import { UserRoles } from "../models/user.model"
import { StatusCodes } from "./middleware"

// Constants
const router = Router()
const { OK } = StatusCodes

// Cookie Properties
export const cookieProps = Object.freeze({
	key: "ACCESS_TOKEN",
	options: {
		httpOnly: true,
		maxAge: 60 * 60 * 1000 * 24 * 7, // 1 week
	},
})

router.get("/", getUserController())

/**
 * Login a user.
 */
router.post("/signin/:role", signinController())

router.get("/signup", (req, res) => {
	res.send("Hello World!")
})
/**
 * Regsiter a user.
 */
router.post("/signup", signupController(UserRoles.User))

router.post("/signup/admin", signupController(UserRoles.Admin))

router.post("/signup/doctor", signupController(UserRoles.Doctor))

router.post("/verify-email", verifyEmailController())

/**
 * Logout the user.
 */
router.get("/logout", (_: Request, res: Response) => {
	const { key, options } = cookieProps
	res.cookie(key, { ...options, expires: new Date(0) })
	return res.status(OK).end()
})

// Export router
export default router
