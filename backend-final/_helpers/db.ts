import { Model, ModelCtor, Optional, Sequelize } from "sequelize"
// import {
// 	AccountModel,
// 	AppointmentModel,
// 	DoctorModel,
// 	RefreshTokenModel,
// } from "../types"

const config = require("config.json")
const mysql = require("mysql2/promise")

type DB = {
	Account: ModelCtor<Model>
	RefreshToken: ModelCtor<Model>
	Doctor: ModelCtor<Model>
	Appointement: ModelCtor<Model>
}

let db: DB = {} as DB

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
	const sequelize: Sequelize = new Sequelize(database, user, password, {
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
	// sync all models with database

	db.Account.hasMany(db.Appointement, { onDelete: "CASCADE" })
	db.Doctor.hasMany(db.Appointement, { onDelete: "CASCADE" })
	db.Appointement.belongsTo(db.Account)
	db.Appointement.belongsTo(db.Doctor)

	await sequelize.sync()
}

export default db as DB
