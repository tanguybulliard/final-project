import React, { useEffect } from "react"
import { Route, Switch } from "react-router-dom"
import { Calendar } from "./Calendar"
import { doctorService } from "@/_services"

function Doctor({ match }) {
	const { path } = match

	const [doctors, setDoctors] = React.useState([])

	useEffect(() => {
		// console.log(doctorService.userValue)
		doctorService.getDoctors.then(console.log)
	}, [])

	return (
		<div className="p-4">
			<div className="container">
				<h3 className="card-header">Doctor qoq</h3>
				<Switch>
					<Route path={`${path}/calendar`} component={Calendar} />
					<Route path={`${path}/`} component={<div>hi</div>} />
				</Switch>
			</div>
		</div>
	)
}

export { Doctor }
