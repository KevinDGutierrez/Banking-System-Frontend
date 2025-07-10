
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
import CreditoClient from "../../components/creditos/CreditoClient.jsx"
import CreditoAdmin from "../../components/creditos/CreditoAdmin.jsx"
import Favorites from "../../components/Favorites/Favorites.jsx"
import DepositAdmin from "../../components/Deposits/Deposits.jsx"
import DepositUser from "../../components/Deposits/DepositsUser.jsx"
import MyAccount from "../../components/MyAccount/MyAccount.jsx"
import OrdenComponent from "../../components/Ordenes/Orden.jsx"
import ContentTransfer from "../../components/Transfers/ContentTransfer.jsx"
import TransferenciaClient from "../../components/Transfers/TransferenciaClient.jsx"
import TransferenciaInterbancariaClient from "../../components/Transfers/TransferenciaInterbancariaClient.jsx"
import TransferHistorial from "../../components/Transfers/TransferHistorial.jsx"

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
        },
        { 
            path: "/solicitudCredito", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <CreditoClient />
                </PrivateRoute>
            )
        },
        { 
            path: "/aprobarCredito", element: (
                <PrivateRoute roles={["ADMIN"]}>
                    <CreditoAdmin />
                    </PrivateRoute>
            )
        },
        {
            path: "/favoritos", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <Favorites />
                </PrivateRoute>
            )
        },
        {
            path: "/depositos", element: (
                <PrivateRoute>
                    <DepositAdmin />
                </PrivateRoute>
            )
        },
        {
            path: "/misDepositos", element: (
                <PrivateRoute>
                    <DepositUser />
                </PrivateRoute>
            )
        },
        {
            path: "/myAccount", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <MyAccount />
                </PrivateRoute>
            )
        },
        {
            path: "/clienteOrdenes", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <OrdenComponent />
                </PrivateRoute>
            )
        },
        {
            path: "/transfers", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <ContentTransfer />
                </PrivateRoute>
            )
        },
        {
            path: "/transfer", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <TransferenciaClient />
                </PrivateRoute>
            )
        },
        {
            path: "/interTransfer", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <TransferenciaInterbancariaClient />
                </PrivateRoute>
            )
        },
        {
            path: "/histTransfer", element: (
                <PrivateRoute roles={["CLIENTE"]}>
                    <TransferHistorial />
                </PrivateRoute>
            )
        }
    ])

    return routes;
}