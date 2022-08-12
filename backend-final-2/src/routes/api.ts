import { Router } from "express"
import { adminMw } from "./middleware"
import authRouter from "./auth.router"
import appointmentRouter from "./appointment.router"
import userRouter from "./user.router"

// Init
const apiRouter = Router()

// Add api routes
apiRouter.use("/auth", authRouter)
apiRouter.use("/appointment", appointmentRouter)
apiRouter.use("/users", userRouter)
// apiRouter.use("/users", adminMw, userRouter)

// Export default
export default apiRouter
