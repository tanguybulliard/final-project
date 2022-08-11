import React from "react"
import { Route, Router } from "react-router-dom"

import { Overview } from "./Overview"
import { Users } from "./users"

function Admin({ match }) {
	const { path } = match

	return (
		<div className="p-4">
			<div className="container">
				<Router>
					<Route exact path={path} component={Overview} />
					<Route path={`${path}/users`} component={Users} />
				</Router>
			</div>
		</div>
	)
}

export { Admin }
