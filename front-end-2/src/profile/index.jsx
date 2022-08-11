import React from "react"
import { Route, Router } from "react-router-dom"

import { Details } from "./Details"
import { Update } from "./Update"

function Profile({ match }) {
	const { path } = match

	return (
		<div className="p-4">
			<div className="container">
				<Router>
					<Route exact path={path} component={Details} />
					<Route path={`${path}/update`} component={Update} />
				</Router>
			</div>
		</div>
	)
}

export { Profile }
