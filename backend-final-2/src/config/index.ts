﻿export default {
	database: {
		host: "localhost",
		port: 3306,
		user: "root",
		password: "password",
		database: "projet-final",
	},
	secret: "test",
	emailFrom: "tanguybulliard@gmail.com",
	smtpOptions: {
		service: "gmail",
		auth: {
			user: "tanguybulliard@gmail.com",
			pass: "qdfifwbrumaaxxta",
		},
	},
	baseUrl: "http://localhost:4000",
} as const
