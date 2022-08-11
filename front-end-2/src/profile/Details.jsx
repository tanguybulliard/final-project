import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../_components"
import { UserContext } from "../_components/AuthProvider"

function Details() {
	const user = useContext(UserContext)

	return (
		<div>
			<h1>My Profile</h1>
			<p>
				<strong>Name: </strong> {user.title} {user.firstName}{" "}
				{user.lastName}
				<br />
				<strong>Email: </strong> {user.email}
			</p>
			<p>
				<Link to="/profile/update">Update Profile</Link>
			</p>
		</div>
	)
}

export { Details }
