import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService, solicitarRecuperacion, resetPassword } from "../../services/api";
import Swal from "sweetalert2";
import 'animate.css';

export const useLogin = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginSucces, setLoginSucces] = useState(false);

    const alertSettings = {
        success: {
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-200'
        },
        error: {
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            iconColor: 'text-red-500',
            borderColor: 'border-red-200'
        }
    };

    const showAlert = (type, title, text, timer = null) => {
        const settings = alertSettings[type];

        return Swal.fire({
            icon: type,
            title: `<span class="text-xl font-bold ${settings.textColor}">${title}</span>`,
            html: `<div class="${settings.textColor}">${text}</div>`,
            timer: timer,
            showConfirmButton: timer ? false : true,
            background: '#1f2937',
            backdrop: type === 'success' ?
                'rgba(59, 130, 246, 0.15)' :
                'rgba(239, 68, 68, 0.15)',
            customClass: {
                popup: `rounded-xl border ${settings.borderColor} shadow-lg`,
                icon: `${settings.iconColor} border-${type}-100`,
                confirmButton: `px-4 py-2 rounded-lg ${type === 'success' ?
                    'bg-blue-600 hover:bg-blue-700 text-white' :
                    'bg-red-600 hover:bg-red-700 text-white'} focus:ring-2 focus:ring-${type}-300`
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            },
            buttonsStyling: false
        });
    };

    const handleLogin = async (usernameOrCorreo, password) => {
        setIsLoading(true);
        try {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrCorreo);
            const response = await loginService({
                [isEmail ? "correo" : "username"]: usernameOrCorreo,
                password
            });

            const { userDetails } = response.data;
            localStorage.setItem("user", JSON.stringify(userDetails));

            await showAlert(
                'success',
                'Inicio de sesión exitoso',
                'Bienvenido a Banco Innova!',
                3000
            );

            navigate("/dashboard", { state: { "message": "Inicio de sesión exitoso" } });
        } catch (error) {
            const errorMsg = error.response?.data;
            showAlert(
                'error',
                'Error al iniciar sesión',
                errorMsg?.error || errorMsg?.msg || 'Ocurrió un error inesperado. Por favor, intenta de nuevo'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecuperacion = async (data) => {
        try {
            const response = await solicitarRecuperacion(data);

            await showAlert(
                'success',
                'Recuperación solicitada',
                'Hemos enviado un enlace de recuperación a tu correo electrónico',
                3000
            );


        } catch (error) {
            const errorMsg = error.response?.data;
            showAlert(
                'error',
                'Error en recuperación',
                errorMsg?.error || errorMsg?.msg || 'No pudimos procesar tu solicitud. Por favor, intenta de nuevo'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (data) => {
        try {
            const response = await resetPassword(data);
            console.log("Contraseña restablecida:", response);

            await showAlert(
                'success',
                'Contraseña actualizada',
                'Tu contraseña ha sido restablecida exitosamente',
                3000
            );

            navigate("/");
        } catch (error) {
            const errorMsg = error.response?.data;
            showAlert(
                'error',
                'Error al restablecer',
                errorMsg?.error || errorMsg?.msg
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, loginError, loginSucces, handleRecuperacion, handleResetPassword };
};