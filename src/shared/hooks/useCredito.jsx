import { useState } from 'react';
import { solicitarCredito, aprobarCredito, deleteCredito, getCreditos, getCreditoById } from '../../services/api';
import Swal from 'sweetalert2';

export const useCredito = () => {
    const [creditos, setCreditos] = useState([]);
    const [credito, setCredito] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetCreditos = async () => {
        try {
            const response = await getCreditos();
            console.log("Créditos obtenidos:", response.data.creditos);
            setCreditos(response.data.creditos);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al obtener los créditos',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleSolicitarCredito = async (montoSolicitado, plazo, moneda, numeroCuenta) => {
        try {
            setLoading(true);

            const data = {
                montoSolicitado: Number(montoSolicitado),
                plazo: Number(plazo),
                moneda,
                cuentaId: numeroCuenta
            }

            console.log("Enviando solicitud con datos:", data);

            const response = await solicitarCredito(data);

            await Swal.fire({
                title: 'Crédito Solicitado',
                text: 'El crédito ha sido solicitado exitosamente',
                icon: 'success',
                timer: 1500
            })

            await handleGetCreditos();
        } catch (error) {
            const backendError = error.response?.data;
            console.log("Error al solicitar crédito:", backendError);
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al solicitar el crédito',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handleAprobarCredito = async (id, montoAprobado) => {
        try {
            setLoading(true);
            const response = await aprobarCredito(id, { montoAprobado });
            Swal.fire({
                title: 'Crédito Aprobado',
                text: 'El crédito ha sido aprobado exitosamente',
                icon: 'success',
                timer: 1500
            })
            handleGetCreditos();
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al aprobar el crédito',
                icon: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    const handledeleteCredito = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea eliminar este crédito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await deleteCredito(id);
                Swal.fire({
                    title: 'Crédito Eliminado',
                    text: 'El crédito ha sido eliminado exitosamente',
                    icon: 'success',
                    timer: 1500,
                })
                handleGetCreditos();
            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error al eliminar el crédito',
                    icon: 'error'
                })
            } finally {
                setLoading(false);
            }
        }
    }

    const handleGetCreditoById = async (id) => {
        try {
            const response = await getCreditoById(id);
            setCredito(response.data.credito);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al obtener los detalles del crédito',
                icon: 'error'
            })
        }
    }

    return {
        creditos,
        credito,
        handleGetCreditos,
        handleSolicitarCredito,
        handleAprobarCredito,
        handledeleteCredito,
        handleGetCreditoById,
        loading
    }
}