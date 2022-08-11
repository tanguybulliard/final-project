import React from "react"
import { Route, Router } from "react-router-dom"

import { List } from "./List"
import { AddEdit } from "./AddEdit"

function Users({ match }) {
	const { path } = match

	return (
		<Router>
			<Route exact path={path} component={List} />
			<Route path={`${path}/add`} component={AddEdit} />
			<Route path={`${path}/edit/:id`} component={AddEdit} />
		</Router>
	)
}

export { Users }
