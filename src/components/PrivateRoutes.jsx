import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children
};

export default PrivateRoute;