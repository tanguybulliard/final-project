import {
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	DataTypes,
	ModelOptions,
	ForeignKey,
	HasManyHasAssociationMixin,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	NonAttribute,
} from "sequelize"
import { UserModel } from "./user.model"

export class AppointmentModel extends Model<
	InferAttributes<AppointmentModel>,
	InferCreationAttributes<AppointmentModel>
> {
	// 'CreationOptional' is a special type that marks the field as optional
	// when creating an instance of the model (such as using Model.create()).
	declare id: CreationOptional<number>
	declare hour: Date
	declare title: string

	declare getUsers: HasManyGetAssociationsMixin<UserModel> // Note the null assertions!
	declare addUser: HasManyAddAssociationMixin<UserModel, number>
	declare addUsers: HasManyAddAssociationsMixin<UserModel, number>
	declare setUsers: HasManySetAssociationsMixin<UserModel, number>
	declare removeUser: HasManyRemoveAssociationMixin<UserModel, number>
	declare removeUsers: HasManyRemoveAssociationsMixin<UserModel, number>
	declare hasUser: HasManyHasAssociationMixin<UserModel, number>
	declare hasUsers: HasManyHasAssociationsMixin<UserModel, number>
	declare countUsers: HasManyCountAssociationsMixin

	declare users?: NonAttribute<UserModel[]>
}

export const AppointmentAttributes = {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	hour: { type: DataTypes.DATE },
	title: { type: DataTypes.STRING },
}
