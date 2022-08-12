import config from "../config"
import mysql from "mysql2/promise"
import { ModelStatic, Sequelize } from "sequelize"
import { UserModel, UserAttributes, UserOptions } from "../models/user.model"
import {
	AppointmentAttributes,
	AppointmentModel,
} from "../models/appointment.model"
import { AppointmentError } from "../services/appointment.service"

type DB = {
	User: ModelStatic<UserModel>
	Appointment: ModelStatic<AppointmentModel>
}

export const db = {} as DB

export async function initialize() {
	try {
		// create db if it doesn't already exist
		const { host, port, user, password, database } = config.database
		const connection = await mysql.createConnection({
			host,
			port,
			user,
			password,
		})
		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)

		// connect to db
		const sequelize = new Sequelize(database, user, password, {
			dialect: "mysql",
		})

		db.User = sequelize.define<UserModel>("user", UserAttributes, UserOptions)
		db.Appointment = sequelize.define<AppointmentModel>(
			"appointment",
			AppointmentAttributes
		)

		db.User.belongsToMany(db.Appointment, {
			as: "appointments",
			through: "appointment_user",
			onDelete: "cascade",
		})

		db.Appointment.belongsToMany(db.User, {
			as: "users",
			through: "appointment_user",
		})

		const users = await db.User.findAll()

		console.log(users.map((u) => u.firstName + " " + u.email + u.verified))

		// db.Appointment.belongsTo(db.User, {
		// 	as: "doctor",
		// })

		// const app = await db.Appointment.findOne({
		// 	include: [{ model: db.User, as: "users" }],
		// })

		// const d = new Date()
		// d.setMinutes(0)
		// d.setSeconds(0)

		// const app = await db.Appointment.findOne({
		// 	include: [{ model: db.User, as: "users" }],
		// })

		// const app = await db.Appointment.create({
		// 	hour: d,
		// })

		// console.log(app?.users, "\n\n#############################\n\n")
		// const users = await app?.users

		// console.log(users, app)

		// await app?.destroy()

		// if (users?.length) {
		// 	const u = await db.User.findOne({ where: { id: users?.[0]?.id } })

		// 	console.log(u)
		// }
		// const doctor = await db.User.findOne({
		// 	where: { role: "Doctor" },
		// 	include: [{ model: db.Appointment, as: "appointments" }],
		// })

		// const a = await doctor?.getAppointments({
		// 	where: { hour: app.hour },
		// })

		// console.log("\n\n#####################################\n\n", a)

		// console.log(doctor?.appointments)

		// if (app) {
		// 	await doctor?.addAppointment(app)
		// }

		// console.log(app, doctor)

		// init models and add them to the exported db object
		// db.Account = require("../accounts/account.model")(sequelize)
		// db.RefreshToken = require("../accounts/refresh-token.model")(sequelize)
		// db.Doctor = require("../accounts/doctor.model")(sequelize)
		// db.Appointement = require("../accounts/appointement.model")(sequelize)

		// // define relationships
		// db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" })
		// db.RefreshToken.belongsTo(db.Account)
		// db.Doctor.hasMany(db.RefreshToken, { onDelete: "CASCADE" })
		// db.RefreshToken.belongsTo(db.Doctor)
		// // sync all models with database

		// db.Account.hasMany(db.Appointement, { onDelete: "CASCADE" })
		// db.Doctor.hasMany(db.Appointement, { onDelete: "CASCADE" })
		// db.Appointement.belongsTo(db.Account)
		// db.Appointement.belongsTo(db.Doctor)

		await sequelize.sync()

		// const users = await db.User.findOne()

		// const doctor = await db.Doctor.findAll()

		// console.log(doctor)

		// const acc = await db.Account.findAll()

		// console.log(acc)

		// doctor.verified = new Date()

		// await doctor.save()

		// console.log(doctor)

		// console.log(Object.keys(db.Appointement))

		// const appointments = await db.Appointement.findAll({
		// 	where: { doctorId: 1 },
		// })

		// console.log(
		// 	appointments.map((x) => ({
		// 		id: x.id,
		// 		hour: x.hour,
		// 		DoctorId: x.doctorId,
		// 		AccountId: x.accountId,
		// 	}))
		// )

		// const appointment = new db.Appointement({ hour: new Date() })
		// appointment.doctorId = 1
		// appointment.accountId = 2
		// await appointment.save()
	} catch (e) {
		console.error("PROBLEM CONNECTING WITH DATABASE", e)
		throw e
	}
}
