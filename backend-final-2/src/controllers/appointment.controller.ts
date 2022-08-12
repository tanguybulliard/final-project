import { Request, Response } from "express"
import { UserRoles } from "../models/user.model"
import { cookieProps } from "../routes/auth.router"
import { StatusCodes } from "../routes/middleware"
import {
	AppointmentError,
	createAppointment,
	getAppointments,
} from "../services/appointment.service"
import userService from "../services/user.service"
import jwtUtil from "../util/jwt-util"

function getAppointmentsController() {
	return async function getAll(req: Request, res: Response) {
		try {
			const accessToken = req.cookies[cookieProps.key]
			if (!accessToken) {
				return res.status(401).end()
			}

			const decodedToken = await jwtUtil.decode(accessToken)
			if (typeof decodedToken === "string" || !decodedToken?.id) {
				return res.status(401).end()
			}

			const appointments = await getAppointments(decodedToken.id)

			res.status(
				appointments ? StatusCodes.OK : StatusCodes.UNAUTHORIZED
			).json(appointments)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				// @ts-ignore
				message: "Something went wrong." + e.message,
			})
		}
	}
}

function createAppointmentController() {
	return async function create(req: Request, res: Response) {
		try {
			const accessToken = req.cookies[cookieProps.key]
			if (!accessToken) {
				return res.status(401).end()
			}

			const decodedToken = await jwtUtil.decode(accessToken)
			if (typeof decodedToken === "string" || !decodedToken?.id) {
				return res.status(401).end()
			}

			const doctorId = req.params.doctorId

			const hour = req.body.hour

			const appointment = await createAppointment(
				decodedToken.id,
				Number.parseInt(doctorId),
				new Date(hour)
			)

			if (
				typeof appointment === "string" &&
				Object.values(AppointmentError).includes(appointment)
			) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: appointment,
				})
			}

			res.status(StatusCodes.CREATED).json(appointment)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				// @ts-ignore
				message: "Something went wrong." + e.message,
			})
		}
	}
}

export default {
	getAppointmentsController,
	createAppointmentController,
}
