
import { useRoutes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoutes.jsx"
import Login from "../../components/Login.jsx"
import Register from "../../components/Register.jsx"
 export const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
    ])

    return routes;
}