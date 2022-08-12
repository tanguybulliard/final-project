import { fetchWrapper } from "../_helpers"
import { BehaviorSubject } from "rxjs"

export const appointmentService = {
	getAppointments,
	createAppointment,
	getDoctors,
}

function getAppointments() {
	return fetchWrapper
		.get("/appointment")
		.then((appointments) => {
			console.log(appointments)
			return appointments
		})
		.catch(console.error)
}

function createAppointment(id, date) {
	return fetchWrapper
		.post(`/appointment/${id}`, { hour: date })
		.then((appointments) => {
			console.log("GETIng an appointment", appointments)
			return appointments
		})
		.catch((err) => {
			console.log("ERROR GETIng an appointment", err)
			throw err
		})
}

function getDoctors() {
	return fetchWrapper
		.get("/users")
		.then((doctors) => {
			console.log(doctors)
			return doctors
		})
		.catch(console.error)
}
