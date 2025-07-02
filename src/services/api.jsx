import axios from "axios"
import { logout } from "../shared/hooks/useLogout"


const apiClient = axios.create({
    baseURL : 'https://banking-system-backend-production.up.railway.app/',
    timeout: 5000
})


apiClient.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
            try {
                const { token } = JSON.parse(storedUser)
                if (token) {
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
export const resetPassword = async (data) => {
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
export const getFavorites = async () => {
    return await apiClient.get('/favoritos/');
}
export const addFavorite = async (data) => {
    return await apiClient.post('favoritos/', data);
}
export const myAccount = async (data) => {
    console.log(data)
    return await apiClient.put('users/clientes', data)
};

export const myAccountApplication = async (data) => {
    console.log(data)
    return await apiClient.put('users/clientes/solicitud', data)
};

export const myAccountList = async (data) => {
    console.log(data)
    return await apiClient.get('users/myAccount', data)
};

export const updateClienteAdmin = async (id, data) => {
    return await apiClient.put(`users/admin/${id}`, data);
}

export const getDatosPendientes = async () => {
    return await apiClient.get(`users/clientes/datos`);
}

export const solicitarCredito = async (data) => {
    return await apiClient.post('creditos/', data);
}

export const getCreditos = async () => {
    return await apiClient.get('creditos/');
}

export const getCreditoById = async (id) => {
    return await apiClient.get(`creditos/${id}`);
}

export const aprobarCredito = async (id, body) => {
    return await apiClient.put(`creditos/${id}`, body);
}

export const deleteCredito = async (id) => {
    return await apiClient.delete(`creditos/${id}`);
}

export const getDeposits = async () => {
    return await apiClient.get('depositos/');
}

export const getDepositsById = async (id) => {
    return await apiClient.get(`depositos/${id}`);
}

export const getDepositsByAccount = async (cuenta) => {
    return await apiClient.get(`depositos/${cuenta}`);
}

export const postDeposits = async (data) => {
    return await apiClient.post('depositos/', data)
}

export const putDeposits = async (id, data) => {
    return await apiClient.put(`depositos/${id}`, data)
}

export const deleteDeposits = async (id) => {
    return await apiClient.delete(`depositos/${id}`);
}

export const getStatsDeposits = async (id) => {
    return await apiClient.get(`depositos/stats/${id}`)
}

const checkResponseStatus = (e) => {
    const responseStatus = e?.response?.status;

    if (responseStatus) {
        (responseStatus === 401 || responseStatus === 403) && logout();
    } else {
        console.error("Error inesperado:", e);
    }
}