
import { useRoutes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoutes.jsx"
 export const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
            path: "/dashboard",
            element : (
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            ),
        }
    ])

    return routes;
}