import { BehaviorSubject } from "rxjs"

import config from "config"
import { fetchWrapper, history } from "@/_helpers"

const userSubject = new BehaviorSubject(null)
const baseUrl = `${config.apiUrl}/doctor`

export const doctorService = {
	loginDoctor,
	logoutDoctor,
	refreshToken,
	registerDoctor,
	verifyEmail,
	forgotPasswordDoctor,
	validateResetToken,
	resetPassword,
	getAll,
	getDoctors,
	getById,
	create,
	update,
	delete: _delete,
	user: userSubject.asObservable(),
	get userValue() {
		return userSubject.value
	},
}

function loginDoctor(email, password) {
	return fetchWrapper
		.post(`${baseUrl}/authenticate`, { email, password })
		.then((user) => {
			console.log(user)
			// publish user to subscribers and start timer to refresh token
			userSubject.next(user)
			startRefreshTokenTimer()
			return user
		})
		.catch((e) => console.error("Could not login doctor", e))
}

function logoutDoctor() {
	// revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
	fetchWrapper.post(`${baseUrl}/revoke-token`, {})
	stopRefreshTokenTimer()
	userSubject.next(null)
	history.push("/account/login")
}

function refreshToken() {
	return fetchWrapper.post(`${baseUrl}/refresh-token`, {}).then((user) => {
		// publish user to subscribers and start timer to refresh token
		console.log("REFRESHED USER", user)
		userSubject.next(user)
		startRefreshTokenTimer()
		return user
	})
}

function registerDoctor(params) {
	console.log(params)
	return fetchWrapper.post(`${baseUrl}/register-doctor`, params)
}

function verifyEmail(token) {
	return fetchWrapper.post(`${baseUrl}/verify-email-doctor`, { token })
}

function forgotPasswordDoctor(email) {
	return fetchWrapper.post(`${baseUrl}/forgot-password-doctor`, { email })
}
function validateResetToken(token) {
	return fetchWrapper.post(`${baseUrl}/validate-reset-token-doctor`, { token })
}

function resetPassword({ token, password, confirmPassword }) {
	return fetchWrapper.post(`${baseUrl}/reset-password-doctor`, {
		token,
		password,
		confirmPassword,
	})
}

function getAll() {
	return fetchWrapper.get(baseUrl)
}

function getDoctors() {
	return fetchWrapper.get(`${baseUrl}/get-all`)
}

function getById(id) {
	return fetchWrapper.get(`${baseUrl}/${id}`)
}

function create(params) {
	return fetchWrapper.post(baseUrl, params)
}

function update(id, params) {
	return fetchWrapper.put(`${baseUrl}/${id}`, params).then((user) => {
		// update stored user if the logged in user updated their own record
		if (user.id === userSubject.value.id) {
			// publish updated user to subscribers
			user = { ...userSubject.value, ...user }
			userSubject.next(user)
		}
		return user
	})
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
	return fetchWrapper.delete(`${baseUrl}/${id}`).then((x) => {
		// auto logout if the logged in user deleted their own record
		if (id === userSubject.value.id) {
			logout()
		}
		return x
	})
}

// helper functions

let refreshTokenTimeout

function startRefreshTokenTimer() {
	// parse json object from base64 encoded jwt token
	const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split(".")[1]))

	// set a timeout to refresh the token a minute before it expires
	const expires = new Date(jwtToken.exp * 1000)
	const timeout = expires.getTime() - Date.now() - 60 * 1000
	refreshTokenTimeout = setTimeout(refreshToken, timeout)
}

function stopRefreshTokenTimer() {
	clearTimeout(refreshTokenTimeout)
}
