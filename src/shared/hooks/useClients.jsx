import { useState } from "react";
import { AprobarCliente, getClientesByAdmin, deleteCliente } from "../../services/api";
import Swal from "sweetalert2";



export const useClients = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetClientes = async () => {
        try {
            const response = await getClientesByAdmin();
            setClientes(response.data);
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

    const handleAprobarCliente = async (id) => {
        try {
            setLoading(true);
            const response = await AprobarCliente(id);

            Swal.fire({
                title: 'Cliente Aprobado',
                text: 'El cliente ha sido aprobado exitosamente',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            });
            await handleGetClientes();
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




    return { clientes, handleGetClientes, handleAprobarCliente };

}