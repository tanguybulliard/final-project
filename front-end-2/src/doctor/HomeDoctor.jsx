import React, { useContext, useEffect } from "react"
import {
	Route,
	Navigate,
	Outlet,
	useNavigate,
	useLocation,
	Link,
} from "react-router-dom"
import { UserContext } from "../_components/AuthProvider"

function HomeDoctor() {
	// const navigate = useNavigate()

	// const location = useLocation()

	// const user = useContext(UserContext)

	// useEffect(() => {
	// 	console.log("FROM PRIVATYE ROUTE")
	// }, [])

	// useEffect(() => {
	// 	console.log("FROM PRIVATYE ROUTE", location)
	// 	if (!user && !location.pathname.includes("account")) {
	// 		navigate("/account/login", { replace: true })
	// 	}
	// 	if (!!user && location.pathname.includes("account")) {
	// 		navigate("/", { replace: true })
	// 	}
	// }, [location])
	return (
		<div>
			<h1>HomeDoctor</h1>
			<Link to="/doctor/calendar">Calendar</Link>
		</div>
	)
}

export default HomeDoctor
