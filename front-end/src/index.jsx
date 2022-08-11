import React from "react"
import { Router } from "react-router-dom"
import { render } from "react-dom"

import { history } from "./_helpers"
import { accountService, doctorService } from "./_services"
import { App } from "./app"

import "./styles.less"

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

// attempt silent token refresh before startup
// TODO:
// Le refresh token doctor marche que avec doctorService et pas accountService.
// accountService.refreshToken().finally(startApp)

function startApp() {
	console.log("STARING APP")
	render(
		<Router history={history}>
			<App />
		</Router>,
		document.getElementById("app")
	)
}

startApp()
