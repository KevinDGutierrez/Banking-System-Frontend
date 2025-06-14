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

export const aprobarCliente = async (id) => {
    return await apiClient.put(`users/${id}/aprobar`);
}

export const updateCliente = async (data) => {
    return await apiClient.put(`users/${data}`);
}

export const deleteCliente = async (id) => {
    return await apiClient.delete(`users/${id}`);
}

export const getClientes = async () => {
    return await apiClient.get('users');
}

export const tipoCuenta = async (numeroCuenta) => {
    return await apiClient.put(`users/cuentas/${numeroCuenta}/tipo`);
}

export const resetPassword = async ( data) => {
    return await apiClient.post('users/reset', data);
}

export const solicitarRecuperacion = async (data) => {
    return await apiClient.post('users/recuperacion', data);
}


const checkResponseStatus = (e) => {
    const responseStatus = e?.response?.status;

    if (responseStatus) {
        (responseStatus === 401 || responseStatus === 403) && logout();
    } else {
        console.error("Error inesperado:", e);
    }
}