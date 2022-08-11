import { Link } from "react-router-dom"

function AdminNav({ match }) {
	const { path } = match

	return (
		<nav className="admin-nav navbar navbar-expand navbar-light">
			<div className="navbar-nav">
				<Link to={`${path}/users`} className="nav-item nav-link">
					Users
				</Link>
			</div>
		</nav>
	)
}

export default AdminNav
