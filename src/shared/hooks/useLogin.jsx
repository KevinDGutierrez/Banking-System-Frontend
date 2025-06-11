import { useState } from "react";
import {useNavigate} from "react-router-dom"
import { login as loginService } from "../../services/api";
import Swal from "sweetalert2";


export const login = async () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (usernameOrEmail, password) => {
        setIsLoading(true)
        try {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);
            const response = await loginService({
                [isEmail ? "email" : "username"] : usernameOrEmail,
                password
            });
            const {userDetails} = response.data;

            localStorage.setItem("user", JSON.stringify(userDetails));

            await Swal.fire({
                icon : 'success',
                title : 'Inicio exitoso',
                text : 'Inicio de sesion exitosamente!!',
                timer : 3000,
                showConfirmButton : false
            })
            navigate ('/dashboard')
        } catch (error) {
            const Errormsg = error.response?.data

            Swal.fire({
                icon : 'error',
                title : 'Error',
                text : Errormsg?.error || Errormsg?.msg || 'Ocurrio un error'
            })
        } finally {
            setIsLoading(false)
        }
    } 
    return {
        login,handleLogin
    }
}