import { fetchWrapper } from "../_helpers"
import { BehaviorSubject } from "rxjs"

const userSubject = new BehaviorSubject(null)

export const authService = {
	getUser,
	login,
	register,
	logout,
	verifyEmail,
	user: userSubject.asObservable(),
}

function getUser() {
	return fetchWrapper
		.get("/auth")
		.then((user) => {
			userSubject.next(user)
			return user
		})
		.catch(console.error)
}

function login(email, password, role) {
	return fetchWrapper
		.post(`/auth/signin/${role}`, { email, password })
		.then((user) => {
			// publish user to subscribers and start timer to refresh token
			userSubject.next(user)
			return user
		})
		.catch(console.error)
}

function register(params, role) {
	console.log("/register", params, role)
	return fetchWrapper
		.post(
			`/auth/signup${
				role === "Admin" ? "/admin" : role === "Doctor" ? "/doctor" : ""
			}`,
			params
		)
		.then((user) => {
			console.log(user)
			userSubject.next(user)
			return user
		})
		.catch(console.error)
}

function verifyEmail(token) {
	return fetchWrapper.post(`/auth/verify-email`, { token })
}

// function forgotPassword(email) {
// 	return fetchWrapper.post(`${baseUrl}/forgot-password`, { email })
// }

// function validateResetToken(token) {
// 	return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token })
// }

// function resetPassword({ token, password, confirmPassword }) {
// 	return fetchWrapper.post(`${baseUrl}/reset-password`, {
// 		token,
// 		password,
// 		confirmPassword,
// 	})
// }

function logout() {
	// revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
	fetchWrapper
		.get("/auth/logout")
		.then(() => {
			userSubject.next(null)
		})
		.catch(console.error)
}
