import "react-big-calendar/lib/css/react-big-calendar.css"
import React, { useMemo, useState, useEffect } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import { appointmentService } from "../_services"
import { UserContext } from "../_components/AuthProvider"
import { useContext } from "react"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import TextField from "@mui/material/TextField"
import {
	Box,
	Button,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	Modal,
	Card,
} from "@mui/material"

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const ColoredDateCellWrapper = ({ children }) =>
	React.cloneElement(React.Children.only(children), {
		style: {
			backgroundColor: "lightblue",
		},
	})

function DoctorCalendar() {
	const user = useContext(UserContext)
	const { components, defaultDate, views } = useMemo(
		() => ({
			components: {
				timeSlotWrapper: ColoredDateCellWrapper,
			},
			defaultDate: new Date(),
			views: Object.keys(Views).map((k) => Views[k]),
		}),
		[]
	)

	const [appointments, setAppointments] = useState([])
	const [doctors, setDoctors] = useState([])

	const [selectedDate, setSelectedDate] = useState(
		new Date(new Date(new Date().setSeconds(0)).setMinutes(0))
	)
	const [selectedDoctor, setSelectedDoctor] = useState(null)
	const [error, setError] = useState(null)

	const [open, setOpen] = useState(false)
	const [modalAppointment, setModalAppointment] = useState(null)

	useEffect(() => {
		appointmentService
			.getAppointments()
			.then((data) => {
				console.log("DATA ", data)
				setAppointments(data.filter((a) => a && a.title && a.hour))
				setError(null)
			})
			.catch((err) => {
				console.log(err)
				setError(err)
			})

		appointmentService
			.getDoctors()
			.then((data) => {
				console.log("DATA ", data)
				setDoctors(data)
				setError(null)
			})
			.catch((err) => {
				console.log(err)
				setError(err)
			})
	}, [])

	function handleSubmit(e) {
		e.preventDefault()
		if (selectedDoctor && selectedDate) {
			appointmentService
				.createAppointment(selectedDoctor, selectedDate)
				.then((app) => {
					app && app.title && app.hour
						? setAppointments((prev) =>
								[...prev, app].filter((a) => a && a.title && a.hour)
						  )
						: setError(app.message ? app.message : "Error")
				})
				.catch((err) => setError(err))
			console.log(e.target)
		}
		setSelectedDoctor(null)
		setSelectedDate(
			new Date(new Date(new Date().setSeconds(0)).setMinutes(0))
		)
	}

	return (
		<div>
			<h3 className="card-header">
				Calendar of appointments with{" "}
				{user.role === "Doctor" ? "your patients" : "your doctors"}
			</h3>
			<Box display="flex" justifyContent="space-between">
				<Modal
					open={open}
					onClose={() => {
						setOpen(false)
						setModalAppointment(null)
					}}>
					<Card
						p={2}
						display="flex"
						flexDirection="column"
						sx={{
							height: "250px",
							width: "500px",
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}>
						<h2>Appointment</h2>
						{modalAppointment && (
							<Box display="flex" justifyContent="space-between" p={3}>
								<Box>
									<h3>{modalAppointment.title}</h3>
									<p>{modalAppointment.hour}</p>
								</Box>
							</Box>
						)}
					</Card>
				</Modal>
				<Calendar
					components={components}
					defaultDate={defaultDate}
					views={views}
					localizer={localizer}
					events={appointments
						.filter((a) => a && a.title && a.hour)
						.map((app) => ({
							title: app.title,
							start: new Date(app.hour),
							end: new Date(
								new Date(app.hour).setHours(
									new Date(app.hour).getHours() + 1
								)
							),
						}))}
					startAccessor="start"
					endAccessor="end"
					onSelectEvent={(e) => {
						setModalAppointment(e)
						setOpen(true)
					}}
					style={{ height: 500, width: "50vw" }}
				/>
				{user.role === "User" && (
					<Box onSubmit={handleSubmit} component="form">
						<FormControl>
							<InputLabel id="label-select">
								Select your doctor
							</InputLabel>
							<Select
								value={selectedDoctor}
								labelId="label-select"
								label="Doctor"
								sx={{ my: 3 }}
								onChange={(e) => setSelectedDoctor(e.target.value)}>
								{doctors.map((doctor) => (
									<MenuItem value={doctor.id}>{doctor.name}</MenuItem>
								))}
							</Select>

							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DateTimePicker
									label="Pick a date and time"
									value={selectedDate}
									onChange={(date) => {
										const d = new Date(date)
										d.setSeconds(0)
										d.setMinutes(0)
										setSelectedDate(d)
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>

							{error && <div style={{ color: "red" }}>{error}</div>}

							<Button type="submit">Submit</Button>
						</FormControl>
					</Box>
				)}
			</Box>
		</div>
	)
}

export default DoctorCalendar
