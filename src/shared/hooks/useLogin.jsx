import { useState } from "react";
import {useNavigate} from "react-router-dom"
import { login as loginService, solicitarRecuperacion, resetPassword } from "../../services/api";
import Swal from "sweetalert2";


export const useLogin = async () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (usernameOrEmail, password) => {
        setIsLoading(true);
        try {
             const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);
            const response = await loginService({
                [isEmail ? "email" : "username"]: usernameOrEmail,
                password
            })

            const {userDetails} = response.data;

            localStorage.setItem("user", JSON.stringify(userDetails));
            await Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido de nuevo!',
                timer: 3000,
                showConfirmButton: false
            });
            navigate("/dashboard", {state: {"message" : "Inicio de sesión exitoso"}});
        } catch (error) {
            const errorMsg = error.response?.data;
            
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: errorMsg?.error || errorMsg?.msg || 'Ocurrió un error inesperado. Por favor, intenta de nuevo',
            });
        } finally {
            setIsLoading(false);
        }
    } 

    const handleRecuperacion = async (data) => {
        try {
            const response = await solicitarRecuperacion(data);
            console.log("Recuperación solicitada:", response);
            navigate("/recuperacion", {state: {"message" : "Recuperación de contraseña solicitada, revisa tu correo electrónico"}});
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al solicitar recuperación";
            setLoginError(errorMsg);

            setTimeout(() => {
                setLoginError("");
            }, 1000);
        }
    }

    const handleResetPassword = async (codigoGenerado, data) => {
        try {
            const response = await resetPassword(codigoGenerado, data);
            console.log("Contraseña restablecida:", response);
            navigate("/login", {state: {"message" : "Contraseña restablecida exitosamente"}});
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al restablecer la contraseña";
            setLoginError(errorMsg);

            setTimeout(() => {
                setLoginError("");
            }, 1000);
        }
    }
    return { handleLogin, loginError, loginSucces, handleRecuperacion, handleResetPassword };
}