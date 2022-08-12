import { AppointmentModel } from "../models/appointment.model"
import { UserModel, UserRoles } from "../models/user.model"
import { db } from "../util/db"

export enum AppointmentError {
	WeekendsNotAllowed = "Weekends are not allowed",
	AppointmentsCanOnlyBeMadeBetween8And17 = "Appointments can only be made between 8 and 17",
	DoctorIsNotAvailable = "Doctor is not available",
	UserIsNotAvailable = "User is not available",
}

export async function createAppointment(
	userId: number,
	doctorId: number,
	appointmentHour: Date
) {
	try {
		// Make sure the time is on the full hour
		const hour = new Date(appointmentHour)
		hour.setMinutes(0)
		hour.setSeconds(0)

		if (hour.getDay() === 0 || hour.getDay() === 6) {
			return AppointmentError.WeekendsNotAllowed
		}

		if (hour.getHours() < 8 || hour.getHours() > 17) {
			return AppointmentError.AppointmentsCanOnlyBeMadeBetween8And17
		}

		const doctor = await db.User.findOne({
			where: { id: doctorId },
			include: [{ model: db.Appointment, as: "appointments" }],
		})

		if (!doctor) {
			throw new Error("Doctor not found")
		}

		const user = await db.User.findOne({
			where: { id: userId },
			include: [{ model: db.Appointment, as: "appointments" }],
		})

		if (!user) {
			throw new Error("User not found")
		}

		if (user.role !== UserRoles.User) {
			throw new Error("User is not a patient")
		}
		if (doctor.role !== UserRoles.Doctor) {
			throw new Error("Doctor is not a doctor")
		}

		const appointmentsDoctor = await doctor.getAppointments({
			where: { hour: hour },
		})

		if (appointmentsDoctor.length > 0) {
			return AppointmentError.DoctorIsNotAvailable
		}

		const appointmentsUser = await user.getAppointments({
			where: { hour: hour },
		})
		if (appointmentsUser.length > 0) {
			return AppointmentError.UserIsNotAvailable
		}

		const appointment = await db.Appointment.create({
			hour,
			title: `Doctor: ${doctor.firstName} ${doctor.lastName} Patient: ${user.firstName} ${user.lastName}`,
		})

		await user.addAppointment(appointment)
		await doctor.addAppointment(appointment)

		return appointment
	} catch (error) {
		console.error("\n\nERROR CREATING APPOINTMENT\n\n", error)
		return null
	}
}

export async function getAppointments(userId: number) {
	try {
		const user = await db.User.findOne({
			where: { id: userId },
			include: [{ model: db.Appointment, as: "appointments" }],
		})

		if (!user) {
			throw new Error("User not found")
		}

		const appointments = user.appointments

		if (!appointments) {
			return []
		}

		return appointments
	} catch (error) {
		console.error("\n\nERROR GETTING APPOINTMENTS\n\n", error)
		return null
	}
}

export function deleteAppointment(appointment: AppointmentModel) {
	return appointment.destroy()
}
