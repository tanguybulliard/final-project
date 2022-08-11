const { DataTypes } = require("sequelize")

module.exports = model_appointement

function model_appointement(sequelize) {
	const appointement = {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		hour: {
			type: DataTypes.TIME,
		},
	}
	return sequelize.define("appointement", appointement)
}
