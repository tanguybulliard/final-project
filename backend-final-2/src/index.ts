import server from "./server"
import { initialize } from "./util/db"

// Constants
const serverStartMsg = "Express server started on port: ",
	port = 4000

export const start = async () => {
	try {
		// await connect()
		await initialize()
		console.log("CONNECTED TO DB")
		server.listen(port, () => {
			console.log(`${serverStartMsg}${port}`)
		})
	} catch (e) {
		console.error(e as string)
		throw e
	}
}

start()
