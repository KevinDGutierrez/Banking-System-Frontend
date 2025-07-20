import { useState } from "react";
import { updateClienteAdmin, getDatosPendientes } from "../../services/api";
import Swal from "sweetalert2";


export const useClientsAdminHook = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDatosPendientes = async () => {
        try {
            const response = await getDatosPendientes();
            setClients(response.data.datosPendientes)
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    }
    const handleUpdateClientAdmin = async (id, data) => {
        const confirm = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea actualizar los datos de este cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: 'white',
            customClass: {
                popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
            }
        });

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await updateClienteAdmin(id, data);
                console.log(response, "datos recibidos");

                await Swal.fire({
                    title: 'Datos Actualizados',
                    text: 'Los datos de este cliente han sido actualizados exitosamente',
                    icon: 'success',
                    timer: 1500,
                    background: '#1f2937',
                    color: 'white',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
                    }
                });
                await handleDatosPendientes();
            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error',
                    icon: 'error',
                    customClass: {
                         popup: 'swal-custom-zindex'
                    }
                });
            } finally {
                setLoading(false);
            }
        }
    }
    return {
        clients,
        loading,
        handleDatosPendientes,
        handleUpdateClientAdmin
    }
}





