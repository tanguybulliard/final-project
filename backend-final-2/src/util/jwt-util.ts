import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import config from "../config"
import { UserRoles } from "../models/user.model"

// Errors
const errors = {
	validation: "JSON-web-token validation failed.",
} as const

// Constants
const secret = config.secret,
	options = { expiresIn: 60 * 60 * 24 * 7 }

// Types
type TDecoded =
	| string
	| JwtPayload
	| undefined
	| { id: number; role: UserRoles }

/**
 * Encrypt data and return jwt.
 *
 * @param data
 */
function sign(data: JwtPayload): Promise<string> {
	return new Promise((resolve, reject) => {
		jsonwebtoken.sign(data, secret, options, (err, token) => {
			err ? reject(err) : resolve(token || "")
		})
	})
}

/**
 * Decrypt JWT and extract client data.
 *
 * @param jwt
 */
function decode(jwt: string): Promise<TDecoded> {
	return new Promise((res, rej) => {
		jsonwebtoken.verify(jwt, secret, (err, decoded) => {
			return err ? rej(errors.validation) : res(decoded)
		})
	})
}

// Export default
export default {
	sign,
	decode,
}
