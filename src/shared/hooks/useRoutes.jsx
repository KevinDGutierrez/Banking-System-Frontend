
import { useRoutes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoutes.jsx"
import Login from "../../components/Login.jsx"
import Register from "../../components/Register.jsx"
import Solicitud from "../../components/Solicitud.jsx"
import Dashboard from "../../components/Dashboard/Dashboard.jsx"
import Banking from "../../components/Banking/Banking.jsx"
import ClientDashboard from "../../components/Dashboard/ClientDashboard.jsx"
import AdminDashboard from "../../components/Dashboard/AdminDashboard.jsx"
 export const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/recuperar", element: <Solicitud /> },
        {path : "/dashboard", element : (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute> 
        )},
        {path : "/banking", element : (
            <PrivateRoute>
                <Banking />
            </PrivateRoute> 
        )},
        {path : "/clientDashboard", element : (
            <PrivateRoute>
                <ClientDashboard />
            </PrivateRoute> 
        )},
        {path : "/adminDashboard", element : (
            <PrivateRoute>
                <AdminDashboard />
            </PrivateRoute> 
        )},

    ])

    return routes;
}