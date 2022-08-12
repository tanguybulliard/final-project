import { Request, Response, Router } from "express"
import appointmentController from "../controllers/appointment.controller"
import { StatusCodes } from "./middleware"

// Constants
const router = Router()
const { OK } = StatusCodes

router.get("/", appointmentController.getAppointmentsController())

router.post("/:doctorId", appointmentController.createAppointmentController())

// Export router
export default router
