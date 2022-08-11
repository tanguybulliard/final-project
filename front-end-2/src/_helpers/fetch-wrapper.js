import { accountService, doctorService } from "../_services"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api"

export const fetchWrapper = {
	get,
	post,
	put,
	delete: _delete,
}

function get(url) {
	const requestOptions = {
		method: "GET",
		credentials: "include",
	}
	return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse)
}

function post(url, body) {
	console.log(`${BASE_URL}${url}`)
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(body),
	}
	return fetch(`${BASE_URL}${url}`, requestOptions)
		.then(handleResponse)
		.catch((error) => {
			console.error(error)
			throw error
		})
}

function put(url, body) {
	const requestOptions = {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	}
	return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse)
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
	const requestOptions = {
		method: "DELETE",
		credentials: "include",
	}
	return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse)
}

// helper functions

function handleResponse(response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text)

		console.log(text, data)

		if (!response.ok) {
			const error = (data && data.message) || response.statusText
			return Promise.reject(error)
		}

		return data
	})
}
