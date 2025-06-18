
import { useRoutes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoutes.jsx"
import Login from "../../components/Login.jsx"
import Register from "../../components/Register.jsx"
import Solicitud from "../../components/Solicitud.jsx"
import Dashboard from "../../components/Dashboard/Dashboard.jsx"
import Banking from "../../components/Banking/Banking.jsx"
import ClientDashboard from "../../components/Dashboard/ClientDashboard.jsx"
import AdminDashboard from "../../components/Dashboard/AdminDashboard.jsx"
import AccountBankingAdmin from "../../components/AccountBanking/AccoutAdmin.jsx"
import ClienteAdmin from "../../components/Client/ClienteAdmin.jsx"
import ProductosComponent from "../../components/Producto/Producto.jsx"
import AccountClient from "../../components/AccountBanking/AccountClient.jsx"

export const AppRoutes = () => {
    const routes = useRoutes([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/recuperar", element: <Solicitud /> },
        {
            path: "/dashboard", element: (
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            )
        },
        {
            path: "/banking", element: (
                <PrivateRoute>
                    <Banking />
                </PrivateRoute>
            )
        },
        {
            path: "/clientDashboard", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <ClientDashboard />
                </PrivateRoute>
            )
        },
        {
            path: "/adminDashboard", element: (
                <PrivateRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                </PrivateRoute>
            )
        },
        {
            path: "/adminAccounts", element: (
                <PrivateRoute roles={["ADMIN"]}>
                    <AccountBankingAdmin />
                </PrivateRoute>
            )
        },
        {
            path: "/clientesAdmin", element: (
                <PrivateRoute roles={["ADMIN"]}>
                    <ClienteAdmin />
                </PrivateRoute>
            )
        },
        {
            path: "/adminProductos", element: (
                <PrivateRoute roles={["ADMIN"]}>
                    <ProductosComponent />
                </PrivateRoute>
            )
        },
        {
            path: "/accountBanking", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <AccountClient />
                </PrivateRoute>
            )
        }

    ])

    return routes;
}