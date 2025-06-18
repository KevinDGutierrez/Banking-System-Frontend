import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService, getOpciones } from "../../services/api";
import Swal from "sweetalert2";
import 'animate.css';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tiposCuenta, setTiposCuenta] = useState([]);
    const navigate = useNavigate();

    const showSuccessAlert = async () => {
        await Swal.fire({
            icon: 'success',
            title: '<span class="text-emerald-600 text-2xl font-semibold">Registro exitoso</span>',
            html: `
                <div class="flex items-center justify-center my-4">
                    <svg class="w-10 h-10 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="text-gray-700 text-lg">
                        ¡Bienvenido a Banco Innova Guatemala!
                    </p>
                </div>
                <p class="text-gray-600 mt-2">
                    Tu cuenta ha sido creada exitosamente, espera a que validen tu cuenta.
                </p>
            `,
            background: '#f8fafc',
            timer: 3000,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-xl border border-emerald-100 shadow-xl',
                icon: 'border-emerald-100 text-emerald-500'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        });
    };

    const showErrorAlert = async (error) => {
        const backendError = error.response?.data;
        const errorMessage = backendError?.error || backendError?.msg || 'Ocurrió un error inesperado. Por favor, intenta de nuevo';
        
        Swal.fire({
            icon: 'error',
            title: '<span class="text-red-600 text-2xl font-semibold">Error en el registro</span>',
            html: `
                <div class="border-l-4 border-red-500 pl-4 my-4">
                    <p class="text-gray-700 text-lg">
                        ${errorMessage}
                    </p>
                </div>
                <p class="text-gray-500 text-sm">
                    Por favor verifica tus datos e intenta nuevamente.
                </p>
            `,
            background: '#f8fafc',
            showConfirmButton: true,
            confirmButtonText: '<span class="px-6 py-2">Entendido</span>',
            customClass: {
                popup: 'rounded-xl border border-red-100 shadow-xl',
                icon: 'border-red-100 text-red-500',
                confirmButton: 'bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md focus:ring-2 focus:ring-red-300'
            },
            showClass: {
                popup: 'animate__animated animate__headShake'
            },
            buttonsStyling: false
        });
    };

    const handleRegister = async (name, dpi, direccion, username, correo, celular, password, NameTrabajo, ingresos, tipo) => {
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
                ingresos,
                tipo
            });

            await showSuccessAlert();
            navigate('/');
            window.location.reload();

        } catch (error) {
            await showErrorAlert(error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleGetOpciones = async () => {
        try {
            const response = await getOpciones();
            console.log(response);
            setTiposCuenta(response.data.tiposCuentas);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error',
            });
        }
    }

    return {
        handleRegister,
        isLoading, tiposCuenta, handleGetOpciones
    };
};