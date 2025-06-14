
import { useRoutes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoutes.jsx"
import Login from "../../components/Login.jsx"
import Register from "../../components/Register.jsx"
import Solicitud from "../../components/Solicitud.jsx"
import Dashboard from "../../components/Dashboard/Dashboard.jsx"
 export const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/recuperar", element: <Solicitud /> },
        {path : "/dashboard", element : (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute> 
        )}

    ])

    return routes;
}