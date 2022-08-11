import React from "react"
import { Link } from "react-router-dom"
import AdminNav from "../_components/AdminNav"

function Overview() {
	return (
		<div>
			<AdminNav />
			<h1>Admin</h1>
			<p>This section can only be accessed by administrators.</p>
			<p>
				<Link to="admin/users">Manage Users</Link>
			</p>
		</div>
	)
}

export { Overview }
