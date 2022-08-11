import { createContext, useState, useEffect } from "react"
import { accountService, authService, doctorService } from "../_services"

export const UserContext = createContext(null)

// To get user:
// import { UserContect } from ....
// import { useContext } from "react"

// function Component() {
//     const user = useContext(UserContext)

//     return (
//         <div>
//             hi {user.email}
//         </div>
//     )
// }

// Here user will update and rerender component everytime the user changes

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsLoading(true)
		const subscription = authService.user.subscribe((x) => {
			console.log("subscribe", x)
			setUser(x)
		})
		authService.getUser().finally(() => {
			setIsLoading(false)
		})
		return subscription.unsubscribe
	}, [])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
