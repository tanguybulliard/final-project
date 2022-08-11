import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import { Route, Routes, BrowserRouter } from "react-router-dom"
import { Home } from "./home"
import { AuthProvider } from "./_components/AuthProvider"
import { Details } from "./profile/Details"
import { Update } from "./profile/Update"
import HomeDoctor from "./doctor/HomeDoctor"
import Calendar from "./doctor/Calendar"
import { Overview } from "./admin/Overview"
import { List } from "./admin/users/List"
import { AddEdit } from "./admin/users/AddEdit"
import { Login } from "./account/Login"
import { Register } from "./account/Register"
import { VerifyEmail } from "./account/VerifyEmail"
import { ForgotPassword } from "./account/ForgotPassword"
import { ResetPassword } from "./account/ResetPassword"
import { LoginDoctor } from "./account/LoginDoctor"
import { RegisterDoctor } from "./account/RegisterDoctor"
import { VerifyEmailDoctor } from "./account/VerifyEmailDoctor"
import { ResetPasswordDoctor } from "./account/ResetPasswordDoctor"
import { ForgotPasswordDoctor } from "./account/ForgotPasswordDoctor"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
	<AuthProvider>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<h1>home</h1>} />
					<Route index element={<Home />} />
					<Route path="profile">
						<Route index element={<Details />} />
						<Route path="update" element={<Update />} />
					</Route>
					<Route path="admin">
						<Route index element={<Overview />} />
						<Route path="users">
							<Route index element={<List />} />
							<Route path="add" element={<AddEdit />} />
							<Route path="edit/:id" element={<AddEdit />} />
						</Route>
					</Route>
					<Route path="account">
						<Route path="login" element={<Login />} />
						<Route path="register" element={<Register />} />
						<Route path="verify-email" element={<VerifyEmail />} />
						<Route
							path="forgot-password"
							component={<ForgotPassword />}
						/>
						<Route path="reset-password" element={<ResetPassword />} />
						<Route path="login-doctor" element={<LoginDoctor />} />
						<Route path="register-doctor" element={<RegisterDoctor />} />
						<Route
							path="verify-email-doctor"
							element={<VerifyEmailDoctor />}
						/>
						<Route
							path="reset-password-doctor"
							element={<ResetPasswordDoctor />}
						/>
						<Route
							path="forgot-password-doctor"
							element={<ForgotPasswordDoctor />}
						/>
					</Route>
					<Route path="doctor">
						<Route index element={<HomeDoctor />} />
						<Route path="calendar" element={<Calendar />} />
					</Route>
					<Route path="*" element={<h1>Wrong route</h1>} />
				</Route>
			</Routes>
		</BrowserRouter>
	</AuthProvider>
)

/* <AuthProvider>
		<App />
	</AuthProvider> */
