import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

import { doctorService, alertService, authService } from "../_services"

function LoginDoctor() {
	const navigate = useNavigate()
	const location = useLocation()
	const initialValues = {
		email: "philip.hamelink@gmail.com",
		password: "123456",
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
			.login(email, password, "Doctor")
			.then(() => {
				// const { from } = location.state || { from: { pathname: "/doctor" } }
				navigate("/doctor", { replace: true })
				// history.push(from)
			})
			.catch((error) => {
				setSubmitting(false)
				console.log(error)
				// alertService.error(error)
			})
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
								<Link
									to="/account/register-doctor"
									className="btn btn-link">
									Register
								</Link>
							</div>
							<div className="form-group col text-right">
								<Link
									to="/account/forgot-password-doctor"
									className="btn btn-link pr-0">
									Forgot Password?
								</Link>
								<Link to="/account/login" className="btn btn-link pr-0">
									I am a patient
								</Link>
							</div>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export { LoginDoctor }
