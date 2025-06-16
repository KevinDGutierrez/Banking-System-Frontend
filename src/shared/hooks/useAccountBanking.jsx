import { useState } from 'react';
import { getAccountsBanking, AprobarCuentaBancaria, deleteAccounts } from '../../services/api';
import Swal from 'sweetalert2';

export const useAccountBanking = () => {
    const [accountBanking, setAccountBanking] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetAccountBanking = async () => {
        try {
            const response = await getAccountsBanking();
            console.log(response);
            setAccountBanking(response.data);
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
    const handleAprobarCuenta = async (numeroCuenta) => {
        const confirm = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea aprobar esta cuenta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: 'white',
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
            }
        });

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await AprobarCuentaBancaria(numeroCuenta);
                console.log(response);

                await Swal.fire({
                    title: 'Cuenta Aprobada',
                    text: 'La cuenta ha sido aprobada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    background: '#1f2937',
                    color: 'white',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                });

                await handleGetAccountBanking();
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
    };


    const handleDeleteCuenta = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Está seguro?',
            text: 'Esta acción eliminará la cuenta permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: 'white',
            customClass: {
                popup: 'animate__animated animate__fadeInDown',
            }
        });

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await deleteAccounts(id);
                console.log(response);

                await Swal.fire({
                    title: 'Cuenta Eliminada',
                    text: 'La cuenta ha sido eliminada exitosamente',
                    icon: 'success',
                    timer: 1500,
                    background: '#1f2937',
                    color: 'white',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown',
                    }
                });

                await handleGetAccountBanking();
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
    };


    return { accountBanking, handleGetAccountBanking, handleAprobarCuenta, handleDeleteCuenta };
}
