import React, { useContext, useEffect } from "react"
import {
	Route,
	Navigate,
	Outlet,
	useNavigate,
	useLocation,
} from "react-router-dom"

import { AuthProvider, UserContext } from "./AuthProvider"
import { Nav } from "./Nav"

function PrivateRoute() {
	const navigate = useNavigate()

	const location = useLocation()

	const user = useContext(UserContext)

	useEffect(() => {
		console.log("FROM PRIVATYE ROUTE")
	}, [])

	useEffect(() => {
		console.log("FROM PRIVATYE ROUTE", location)
		if (!user && !location.pathname.includes("account")) {
			navigate("/account/login", { replace: true })
		}
		if (!!user && location.pathname.includes("account")) {
			navigate("/", { replace: true })
		}
	}, [location])

	return (
		<AuthProvider>
			<div className="p-4">
				<div className="container">
					<Nav />
					<Outlet />
				</div>
			</div>
		</AuthProvider>
	)
}

export { PrivateRoute }
