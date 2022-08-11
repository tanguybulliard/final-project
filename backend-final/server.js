require("rootpath")()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const errorHandler = require("_middleware/error-handler")
const db = require("./_helpers/db")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// allow cors requests from any origin and with credentials
app.use(
	cors({
		origin: (origin, callback) => callback(null, true),
		credentials: true,
	})
)

app.use((err, req, res, next) => {
	console.error(
		"##############################################\n\n\n\n\n",
		err.stack,
		"##############################################\n\n\n\n\n"
	)
	res.status(500).send("Something broke!")
})

app.use((err, req, res, next) => {
	console.error(
		"##############################################\n\n\n\n\n",
		err.stack,
		"##############################################\n\n\n\n"
	)
	res.status(500).send("Something broke!")
})
// api routes
app.use("/accounts", require("./accounts/accounts.controller"))
app.use("/doctor", require("./accounts/doctor.controller"))

app.use((req, res, next) => {
	console.log(req.url)
	next()
})

// api routes
app.use("/accounts", require("./accounts/accounts.controller"))
app.use("/doctor", require("./accounts/doctor.controller"))

// global error handler
app.use(errorHandler)

// start server
const port =
	process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000
app.listen(port, async () => {
	// const doctors = await db.Doctor.findAll()

	// console.log(doctors)

	// console.log(db)

	console.log("Server listening on port " + port)
})
