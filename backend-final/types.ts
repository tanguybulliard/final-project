// import { Sequelize, Model, DataTypes, Optional } from "sequelize"

// type AccountAttributes = {
// 	id?: number
// 	email: string
// 	passwordHash: string
// 	title: string
// 	firstName: string
// 	lastName: string
// 	acceptTerms: boolean
// 	role: string
// 	verificationToken: string
// 	verified: Date
// 	resetToken: string
// 	resetTokenExpires: Date
// 	passwordReset: Date
// 	created: Date
// 	updated: Date
// 	isVerified: boolean
// }

// type AccountCreationAttributes = Optional<AccountAttributes, "id">

// export type AccountModel = Model<AccountAttributes, AccountCreationAttributes>

// export interface DoctorAttributes extends AccountAttributes {
// 	address: string
// }

// type DoctorCreationAttributes = Optional<DoctorAttributes, "id">

// export type DoctorModel = Model<DoctorAttributes, DoctorCreationAttributes>

// export interface RefreshTokenAttributes {
// 	id: number
// 	token: string
// 	expires: Date
// 	created: Date
// 	createdByIp: string
// 	revoked: Date
// 	revokedByIp: string
// 	replacedByToken: string
// }

// type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, "id">

// export type RefreshTokenModel = Model<
// 	RefreshTokenAttributes,
// 	RefreshTokenCreationAttributes
// >

// export interface AppointmentAttributes {
// 	id: number
// 	hour: Date
// }

// type AppointmentCreationAttributes = Optional<AppointmentAttributes, "id">

// export type AppointmentModel = Model<
// 	AppointmentAttributes,
// 	AppointmentCreationAttributes
// >
