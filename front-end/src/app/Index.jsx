import React, { useState, useEffect } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"

import { Role } from "@/_helpers"
import { accountService, doctorService } from "@/_services"
import { Nav, PrivateRoute, Alert } from "@/_components"
import { Home } from "@/home"
import { Profile } from "@/profile"
import { Admin } from "@/admin"
import { Account } from "@/account"
import { Doctor } from "@/Doctor"

function App() {
	const { pathname } = useLocation()
	const [user, setUser] = useState(null)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		console.log(user)
		doctorService
			.refreshToken()
			.then(console.log)
			.finally(() => setLoading(false))
		const subscription = accountService.user.subscribe((x) => setUser(x))
		const subscription2 = doctorService.user.subscribe((x) => setUser(x))
		return () => {
			subscription.unsubscribe
			subscription2.unsubscribe
		}
	}, [])

	useEffect(() => {
		console.log(loading, Home)
	}, [user])

	return (
		<div className={"app-container" + (user && " bg-light")}>
			<Nav />
			<Alert />
			<Switch>
				<Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
				<Route path="/" component={Home} />
				<Route path="/profile" component={Profile} />
				<Route path="/admin" component={Admin} />
				<Route path="/account" component={Account} />
				<Route path="/doctor" component={Doctor} />
				<Redirect from="*" to="/" />
			</Switch>
		</div>
	)

	// return (
	// 	<div className={"app-container" + (user && " bg-light")}>
	// 		<Nav />
	// 		<Alert />
	// 		<Switch>
	// 			<Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
	// 			<PrivateRoute exact path="/" component={Home} />
	// 			<PrivateRoute path="/profile" component={Profile} />
	// 			<PrivateRoute
	// 				path="/admin"
	// 				roles={[Role.Admin]}
	// 				component={Admin}
	// 			/>
	// 			<Route path="/account" component={Account} />
	// 			<Route path="/doctor" component={Doctor} />
	// 			<Redirect from="*" to="/" />
	// 		</Switch>
	// 	</div>
	// )
}

export { App }
