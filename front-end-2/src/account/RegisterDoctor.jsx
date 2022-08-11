import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

import { doctorService, alertService, authService } from "../_services"

function RegisterDoctor() {
	const navigate = useNavigate()
	const initialValues = {
		title: "Mr",
		firstName: "Philip",
		lastName: "Hamelink",
		email: "p@h.com",
		// address: "123 rue de egeneve",
		password: "123456",
		confirmPassword: "123456",
		acceptTerms: true,
	}

	const validationSchema = Yup.object().shape({
		title: Yup.string().required("Title is required"),
		firstName: Yup.string().required("First Name is required"),
		lastName: Yup.string().required("Last Name is required"),
		email: Yup.string()
			.email("Email is invalid")
			.required("Email is required"),
		// address: Yup.string().required("address is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
		acceptTerms: Yup.bool().oneOf(
			[true],
			"Accept Terms & Conditions is required"
		),
	})

	function onSubmit(fields, { setStatus, setSubmitting }) {
		setStatus()
		console.log("fields : ", fields, doctorService)
		const { confirmPassword, ...user } = fields
		authService
			.register({ ...user, role: "Doctor" }, "Doctor")
			.then(() => {
				console.log("OK")
				alertService.success(
					"Registration successful, please check your email for verification instructions",
					{ keepAfterRouteChange: true }
				)
				// history.push("login-doctor")
				navigate("/doctor")
			})
			.catch((error) => {
				console.log("NO", error)
				setSubmitting(false)
				alertService.error(error)
			})
	}

	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<h3 className="card-header">Register</h3>
						<div className="card-body">
							<div className="form-row">
								<div className="form-group col">
									<label>Title</label>
									<Field
										name="title"
										as="select"
										className={
											"form-control" +
											(errors.title && touched.title
												? " is-invalid"
												: "")
										}>
										<option value=""></option>
										<option value="Mr">Mr</option>
										<option value="Mrs">Mrs</option>
										<option value="Miss">Miss</option>
										<option value="Ms">Ms</option>
									</Field>
									<ErrorMessage
										name="title"
										component="div"
										className="invalid-feedback"
									/>
								</div>
								<div className="form-group col-5">
									<label>First Name</label>
									<Field
										name="firstName"
										type="text"
										className={
											"form-control" +
											(errors.firstName && touched.firstName
												? " is-invalid"
												: "")
										}
									/>
									<ErrorMessage
										name="firstName"
										component="div"
										className="invalid-feedback"
									/>
								</div>
								<div className="form-group col-5">
									<label>Last Name</label>
									<Field
										name="lastName"
										type="text"
										className={
											"form-control" +
											(errors.lastName && touched.lastName
												? " is-invalid"
												: "")
										}
									/>
									<ErrorMessage
										name="lastName"
										component="div"
										className="invalid-feedback"
									/>
								</div>
							</div>
							<div className="form-group">
								<label>Email</label>
								<Field
									name="email"
									type="text"
									className={
										"form-control" +
										(errors.email && touched.email
											? " is-invalid"
											: "")
									}
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="invalid-feedback"
								/>
							</div>
							{/* <div className="form-group">
								<label>Address</label>
								<Field
									name="address"
									type="text"
									className={
										"form-control" +
										(errors.address && touched.address
											? " is-invalid"
											: "")
									}
								/>
								<ErrorMessage
									name="address"
									component="div"
									className="invalid-feedback"
								/>
							</div> */}
							<div className="form-row">
								<div className="form-group col">
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
								<div className="form-group col">
									<label>Confirm Password</label>
									<Field
										name="confirmPassword"
										type="password"
										className={
											"form-control" +
											(errors.confirmPassword &&
											touched.confirmPassword
												? " is-invalid"
												: "")
										}
									/>
									<ErrorMessage
										name="confirmPassword"
										component="div"
										className="invalid-feedback"
									/>
								</div>
							</div>
							<div className="form-group form-check">
								<Field
									type="checkbox"
									name="acceptTerms"
									id="acceptTerms"
									className={
										"form-check-input " +
										(errors.acceptTerms && touched.acceptTerms
											? " is-invalid"
											: "")
									}
								/>
								<label
									htmlFor="acceptTerms"
									className="form-check-label">
									Accept Terms & Conditions
								</label>
								<ErrorMessage
									name="acceptTerms"
									component="div"
									className="invalid-feedback"
								/>
							</div>
							<div className="form-group">
								<button
									type="submit"
									disabled={isSubmitting}
									className="btn btn-primary">
									{isSubmitting && (
										<span className="spinner-border spinner-border-sm mr-1"></span>
									)}
									Register
								</button>
								<Link
									to="/account/login-doctor"
									className="btn btn-link">
									Cancel
								</Link>
							</div>
						</div>
					</Form>
				)}
			</Formik>

			{/*<button onClick={() => setVisible(true)}>Show Popup</button>
            <Popup visible={visible} setVisible={setVisible}>
              <DatePicker lang="tr" selectedDay={day} setSelectedDay={setDay} timeSelector={true} />
            </Popup>*/}
		</>
	)
}

export { RegisterDoctor }
