import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

import { authService, alertService } from "../_services"

function Login() {
	const location = useLocation()
	const navigate = useNavigate()
	const initialValues = {
		email: "",
		password: "",
	}

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email("Email is invalid")
			.required("Email is required"),
		password: Yup.string().required("Password is required"),
	})

	function onSubmit({ email, password }, { setSubmitting }) {
		alertService.clear()
		authService
			.login(email, password, "User")
			.then(() => {
				// alertService.success(
				// 	"Registration successful, please check your email for verification instructions",
				// 	{ keepAfterRouteChange: true }
				// )
				// history.push("login")
				navigate("/account/login")
			})
			.catch((error) => {
				console.error(error)
				setSubmitting(false)
				// alertService.error(error)
			})
			.finally(() => setSubmitting(false))
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}>
			{({ errors, touched, isSubmitting }) => (
				<Form>
					<h3 className="card-header">Login</h3>
					<div className="card-body">
						<div className="form-group">
							<label>Email</label>
							<Field
								name="email"
								type="text"
								className={
									"form-control" +
									(errors.email && touched.email ? " is-invalid" : "")
								}
							/>
							<ErrorMessage
								name="email"
								component="div"
								className="invalid-feedback"
							/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<Field
								name="password"
								type="password"
								className={
									"form-control" +
									(errors.password && touched.password
										? " is-invalid"
										: "")
								}
							/>
							<ErrorMessage
								name="password"
								component="div"
								className="invalid-feedback"
							/>
						</div>
						<div className="form-row">
							<div className="form-group col">
								<button
									type="submit"
									disabled={isSubmitting}
									className="btn btn-primary">
									{isSubmitting && (
										<span className="spinner-border spinner-border-sm mr-1"></span>
									)}
									Login
								</button>
								<Link to="/account/register" className="btn btn-link">
									Register
								</Link>
							</div>
							<div className="form-group col text-right">
								<Link
									to="/account/forgot-password"
									className="btn btn-link pr-0">
									Forgot Password?
								</Link>
								<Link
									to="/account/login-doctor"
									className="btn btn-link pr-0">
									I am a doctor
								</Link>
							</div>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export { Login }
