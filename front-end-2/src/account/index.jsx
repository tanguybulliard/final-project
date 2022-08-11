import React, { useEffect } from "react"
import { Route, Router } from "react-router-dom"

import { accountService } from "../_services"

import { Login } from "./Login"
import { LoginDoctor } from "./LoginDoctor"
import { Register } from "./Register"
import { RegisterDoctor } from "./RegisterDoctor"
import { VerifyEmail } from "./VerifyEmail"
import { ForgotPassword } from "./ForgotPassword"
import { ResetPassword } from "./ResetPassword"
import { ResetPasswordDoctor } from "./ResetPasswordDoctor"
import { VerifyEmailDoctor } from "./VerifyEmailDoctor"
import { ForgotPasswordDoctor } from "./ForgotPasswordDoctor"

function Account({ history, match }) {
	const { path } = match

	useEffect(() => {
		// redirect to home if already logged in
		if (accountService.userValue) {
			history.push("/")
		}
	}, [])

	return (
		<div className="container">
			<div className="row">
				<div className="col-sm-8 offset-sm-2 mt-5">
					<div className="card m-3">
						<Router>
							<Route path={`${path}/login`} component={Login} />
							<Route path={`${path}/register`} component={Register} />
							<Route
								path={`${path}/verify-email`}
								component={VerifyEmail}
							/>
							<Route
								path={`${path}/forgot-password`}
								component={ForgotPassword}
							/>
							<Route
								path={`${path}/reset-password`}
								component={ResetPassword}
							/>
							<Route
								path={`${path}/login-doctor`}
								component={LoginDoctor}
							/>
							<Route
								path={`${path}/register-doctor`}
								component={RegisterDoctor}
							/>
							<Route
								path={`${path}/verify-email-doctor`}
								component={VerifyEmailDoctor}
							/>
							<Route
								path={`${path}/reset-password-doctor`}
								component={ResetPasswordDoctor}
							/>
							<Route
								path={`${path}/forgot-password-doctor`}
								component={ForgotPasswordDoctor}
							/>
						</Router>
					</div>
				</div>
			</div>
		</div>
	)
}

export { Account }
