const config = require("config.json")
const mysql = require("mysql2/promise")
const { Sequelize } = require("sequelize")

// const doctor = require("../accounts/doctor.service")

module.exports = db = {}

initialize()

async function initialize() {
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

	// init models and add them to the exported db object
	db.Account = require("../accounts/account.model")(sequelize)
	db.RefreshToken = require("../accounts/refresh-token.model")(sequelize)
	db.Doctor = require("../accounts/doctor.model")(sequelize)
	db.Appointement = require("../accounts/appointement.model")(sequelize)

	// define relationships
	db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" })
	db.RefreshToken.belongsTo(db.Account)
	db.Doctor.hasMany(db.RefreshToken, { onDelete: "CASCADE" })
	db.RefreshToken.belongsTo(db.Doctor)
	// sync all models with database

	db.Account.hasMany(db.Appointement, { onDelete: "CASCADE" })
	db.Doctor.hasMany(db.Appointement, { onDelete: "CASCADE" })
	db.Appointement.belongsTo(db.Account)
	db.Appointement.belongsTo(db.Doctor)

	await sequelize.sync()

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
}
