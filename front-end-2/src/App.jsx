import React, { useContext, useEffect } from "react"
import {
	Route,
	Navigate,
	Outlet,
	useNavigate,
	useLocation,
} from "react-router-dom"
import { Nav } from "./_components"

import { UserContext } from "./_components/AuthProvider"

function App() {
	const navigate = useNavigate()

	const location = useLocation()

	const user = useContext(UserContext)

	useEffect(() => {
		console.log("FROM PRIVATYE ROUTE", location)
		if (!user && !location.pathname.includes("account")) {
			navigate("/account/login", { replace: true })
		}
		if (!!user && location.pathname.includes("account")) {
			console.log("changing route")
			navigate("/", { replace: true })
		}
	}, [location, user])

	return (
		<div className={"app-container bg-light"}>
			<div className="p-4">
				<div className="container">
					<Nav />
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default App
