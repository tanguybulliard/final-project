import React from "react"
import { Grid, Paper, Typography } from "@material-ui/core"
import { accountService } from "@/_services"

function Home() {
	const user = accountService.userValue

	return (
		<div className="p-4">
			<div className="container">
				<h1>Hi {user.firstName}!</h1>
			</div>
		</div>
	)
}

export { Home }
