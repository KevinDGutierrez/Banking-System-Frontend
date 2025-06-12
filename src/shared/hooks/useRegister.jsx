import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/api";
import Swal from "sweetalert2";

export const useRegister = () => {

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (name, dpi, direccion, username, correo, celular, password, NameTrabajo, ingresos) => {

        setIsLoading(true);

        try {
            await registerService({
                name,
                dpi,
                direccion,
                username,
                correo,
                celular,
                password,
                NameTrabajo,
                ingresos
            });

            await Swal.fire({
                icon: 'success',
                title: '<span style="color: #10b981; font-size: 1.5rem; font-weight: 600">Registro exitoso</span>',
                html: `
        <div style="display: flex; align-items: center; justify-content: center; margin: 1rem 0">
            <svg style="width: 2.5rem; height: 2.5rem; color: #10b981; margin-right: 0.5rem" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p style="color: #374151; font-size: 1.1rem; margin: 0">
                Usuario registrado exitosamente!!
            </p>
        </div>
    `,
                background: '#f8fafc',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: 'shadow-lg rounded-xl'
                }
            });
            navigate('/');
            window.location.reload();

        } catch (error) {
            const backendError = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: '<span style="color: #ef4444; font-size: 1.5rem; font-weight: 600">Error</span>',
                html: `
        <div style="border-left: 4px solid #ef4444; padding-left: 1rem; margin: 1rem 0">
            <p style="color: #6b7280; font-size: 1.1rem; margin-bottom: 0.5rem">
                ${backendError?.error || backendError?.msg || 'Ocurrió un error inesperado. Por favor, intenta de nuevo'}
            </p>
        </div>
    `,
                background: '#f8fafc',
                showConfirmButton: true,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'shadow-lg rounded-xl'
                }
            });
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleRegister,
        isLoading
    }
}