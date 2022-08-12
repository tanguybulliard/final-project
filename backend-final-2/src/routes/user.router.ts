// ######################################
// # This was in the template           #
// # Still need to implement pure user  #
// # Routes for user UPDATE, etc        #
// ######################################

import { Request, Response, Router } from "express"
import { getDoctorsController } from "../controllers/user.controller"

import { StatusCodes } from "./middleware"

// Constants
const router = Router()
const { CREATED, OK } = StatusCodes

// // Paths
// export const p = {
// 	get: "/all",
// 	add: "/add",
// 	update: "/update",
// 	delete: "/delete/:id",
// } as const

/**
 * Get all doctors.
 */
router.get("/", getDoctorsController)

// /**
//  * Add one user.
//  */
// router.post(p.add, async (req: Request, res: Response) => {
// 	const { user } = req.body
// 	// Check param
// 	if (!user) {
// 		throw new ParamMissingError()
// 	}
// 	// Fetch data
// 	await userService.addOne(user)
// 	return res.status(CREATED).end()
// })

// /**
//  * Update one user.
//  */
// router.put(p.update, async (req: Request, res: Response) => {
// 	const { user } = req.body
// 	// Check param
// 	if (!user) {
// 		throw new ParamMissingError()
// 	}
// 	// Fetch data
// 	await userService.updateOne(user)
// 	return res.status(OK).end()
// })

// /**
//  * Delete one user.
//  */
// router.delete(p.delete, async (req: Request, res: Response) => {
// 	const { id } = req.params
// 	// Check param
// 	if (!id) {
// 		throw new ParamMissingError()
// 	}
// 	// Fetch data
// 	await userService.delete(Number(id))
// 	return res.status(OK).end()
// })

// // Export default
export default router
