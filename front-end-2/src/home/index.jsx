import React, { useContext } from "react"
import { UserContext } from "../_components/AuthProvider"
import { Outlet } from "react-router-dom"

function Home() {
	const user = useContext(UserContext)

	return (
		<div className="p-4">
			<div className="container">hi {user.firstname}</div>
		</div>
	)
}

export { Home }
