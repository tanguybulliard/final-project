import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import queryString from "query-string"

import { accountService, alertService, authService } from "../_services"

function VerifyEmail() {
	const navigate = useNavigate()
	const EmailStatus = {
		Verifying: "Verifying",
		Failed: "Failed",
	}

	const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying)

	useEffect(() => {
		const { token } = queryString.parse(window.location.search)

		// remove token from url to prevent http referer leakage
		// history.replace(window.location.pathname)

		authService
			.verifyEmail(token)
			.then(() => {
				alertService.success("Verification successful, you can now login", {
					keepAfterRouteChange: true,
				})
				// history.push("login")
				navigate("/account/login")
			})
			.catch(() => {
				setEmailStatus(EmailStatus.Failed)
			})
	}, [])

	function getBody() {
		switch (emailStatus) {
			case EmailStatus.Verifying:
				return <div>Verifying...</div>
			case EmailStatus.Failed:
				return (
					<div>
						Verification failed, you can also verify your account using
						the <Link to="/account/forgot-password">forgot password</Link>{" "}
						page.
					</div>
				)
			default:
				return (
					<div>
						Verification failed, you can also verify your account using
						the <Link to="/account/forgot-password">forgot password</Link>{" "}
						page.
					</div>
				)
		}
	}

	return (
		<div>
			<h3 className="card-header">Verify Email</h3>
			<div className="card-body">{getBody()}</div>
		</div>
	)
}

export { VerifyEmail }
