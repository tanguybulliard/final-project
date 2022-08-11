import React, { useState, useEffect, useContext } from "react"
import { Link, Route } from "react-router-dom"

import { Role } from "../_helpers"
import { accountService, authService } from "../_services"
import AdminNav from "./AdminNav"
import { UserContext } from "./AuthProvider"

function Nav() {
	const user = useContext(UserContext)

	useEffect(() => {
		console.log("Nav: useEffect", user)
	}, [])

	// only show nav when logged in
	if (!user) return null

	return (
		<div>
			<nav className="navbar navbar-expand navbar-dark bg-dark">
				<div className="navbar-nav">
					<Link to="/" className="nav-item nav-link">
						Home
					</Link>
					<Link to="/profile" className="nav-item nav-link">
						Profile
					</Link>
					{user.role === Role.Admin && (
						<Link to="/admin" className="nav-item nav-link">
							Admin
						</Link>
					)}
					<Link to="/doctor" className="nav-item nav-link">
						Appointments
					</Link>
					<Link
						to="/account/login"
						onClick={authService.logout}
						className="nav-item nav-link">
						Logout
					</Link>
				</div>
			</nav>
		</div>
	)
}

export { Nav }
