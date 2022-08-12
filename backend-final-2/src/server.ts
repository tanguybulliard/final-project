import cookieParser from "cookie-parser"
import express, { NextFunction, Request, Response } from "express"

import morgan from "morgan"
import BaseRouter from "./routes/api"
import { cookieProps } from "./routes/auth.router"
import { StatusCodes } from "./routes/middleware"
import cors from "cors"

const app = express()

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
	cors({
		// origin or frontend
		origin: "http://localhost:3000",
		credentials: true,
	})
)

// Show routes called in console during development
app.use(morgan("dev"))
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.path}`)
	next()
})
// Add APIs
app.use("/api", BaseRouter)

app.use("*", (req: Request, res: Response) => {
	res.status(StatusCodes.NOT_FOUND).json({
		message: "Not found",
	})
})

// Error handling
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		error: "There was a problem with the server. Please try again later.",
	})
})

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app
