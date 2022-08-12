import {
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	DataTypes,
	ModelOptions,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	NonAttribute,
} from "sequelize"
import { AppointmentModel } from "./appointment.model"

export enum UserRoles {
	Admin = "Admin",
	User = "User",
	Doctor = "Doctor",
}

// order of InferAttributes & InferCreationAttributes is important.
export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	// 'CreationOptional' is a special type that marks the field as optional
	// when creating an instance of the model (such as using Model.create()).
	declare id: CreationOptional<number>
	declare email: string
	declare passwordHash: string
	declare title: string
	declare firstName: string
	declare lastName: string
	declare acceptTerms: boolean
	declare role: UserRoles
	declare verificationToken: CreationOptional<string | null>
	declare verified: CreationOptional<Date | null>
	declare resetToken: CreationOptional<string | null>
	declare resetTokenExpires: CreationOptional<Date | null>
	declare passwordReset: CreationOptional<Date>
	declare created: CreationOptional<Date>
	declare updated: CreationOptional<Date>

	declare getAppointments: HasManyGetAssociationsMixin<AppointmentModel> // Note the null assertions!
	declare addAppointment: HasManyAddAssociationMixin<AppointmentModel, number>
	declare addAppointments: HasManyAddAssociationsMixin<
		AppointmentModel,
		number
	>
	declare setAppointments: HasManySetAssociationsMixin<
		AppointmentModel,
		number
	>
	declare removeAppointment: HasManyRemoveAssociationMixin<
		AppointmentModel,
		number
	>
	declare removeAppointments: HasManyRemoveAssociationsMixin<
		AppointmentModel,
		number
	>
	declare hasAppointment: HasManyHasAssociationMixin<AppointmentModel, number>
	declare hasAppointments: HasManyHasAssociationsMixin<
		AppointmentModel,
		number
	>
	declare countAppointments: HasManyCountAssociationsMixin
	declare createAppointment: HasManyCreateAssociationMixin<
		AppointmentModel,
		"id"
	>

	declare appointments?: NonAttribute<AppointmentModel[]>
}

export const UserAttributes = {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, allowNull: false },
	passwordHash: { type: DataTypes.STRING, allowNull: false },
	title: { type: DataTypes.STRING, allowNull: false },
	firstName: { type: DataTypes.STRING, allowNull: false },
	lastName: { type: DataTypes.STRING, allowNull: false },
	acceptTerms: { type: DataTypes.BOOLEAN },
	role: { type: DataTypes.STRING, allowNull: false },
	verificationToken: { type: DataTypes.STRING },
	verified: { type: DataTypes.DATE },
	resetToken: { type: DataTypes.STRING },
	resetTokenExpires: { type: DataTypes.DATE },
	passwordReset: { type: DataTypes.DATE },
	created: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
	updated: { type: DataTypes.DATE },
}

export const UserOptions: ModelOptions<UserModel> = {
	// disable default timestamp fields (createdAt and updatedAt)
	timestamps: false,
	defaultScope: {
		// exclude password hash by default
		attributes: { exclude: ["passwordHash"] },
	},
	scopes: {
		// include hash with this scope
		withHash: {
			include: {
				all: true,
			},
		},
	},
}

export function getBasicDetails(user: UserModel) {
	return {
		id: user.id,
		email: user.email,
		title: user.title,
		firstName: user.firstName,
		lastName: user.lastName,
		role: user.role,
	}
}
