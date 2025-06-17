import axios from "axios"
import { logout } from "../shared/hooks/useLogout"


const apiClient = axios.create({
    baseURL : 'http://127.0.0.1:3000/',
    timeout : 5000
})


apiClient.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user")

        if(storedUser) {
           try {
             const {token} = JSON.parse(storedUser)
            if (token ) {
                config.headers["x-token"] = token;
            }
           } catch (error) {
            console.error("Error al parsear el usuario en localStorage:", error)
           }
        } 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


export const login = async (data) => {
    return await apiClient.post('users/login', data);
}

export const register = async (data) => {
    return await apiClient.post('users/register', data);
}

export const resetPassword = async ( data) => {
    return await apiClient.post('users/reset', data);
}

export const solicitarRecuperacion = async (data) => {
    return await apiClient.post('users/recuperacion', data);
}

export const getBanking = async () => {
    return await apiClient.get('/bancos/');
}



export const AprobarCuentaBancaria = async (numeroCuenta) => {
    return await apiClient.put(`cuentas/${numeroCuenta}/aprobar`);
}

export const getClientesByAdmin = async () => {
    return await apiClient.get('users/clientes');
}

export const AprobarCliente = async (id) => {
    return await apiClient.put(`users/${id}/aprobar`);
}

export const deleteCliente = async (id) => {
    return await apiClient.delete(`users/${id}`);
}

export const deleteAccounts = async (id) => {
    return await apiClient.delete(`cuentas/${id}`);
}

export const addAccountBanking = async (data) => {
    return await apiClient.post('cuentas/', data);
}

export const getAccountUserBanking = async () => {
    return await apiClient.get('cuentas/usuario');
}

export const getOpciones = async () => {
  return await apiClient.get('cuentas/opciones');
}

export const getAccountsBanking = async () => {
    return await apiClient.get('/cuentas/todas');
}


const checkResponseStatus = (e) => {
    const responseStatus = e?.response?.status;

    if (responseStatus) {
        (responseStatus === 401 || responseStatus === 403) && logout();
    } else {
        console.error("Error inesperado:", e);
    }
}