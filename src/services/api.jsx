import axios from "axios"
import { useLogout } from "../shared/hooks/useLogout"


const apiClient = axios.create({
    baseURL : 'http://127.0.0.1:3000/bankingSystem',
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