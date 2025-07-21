import { useState } from 'react';
import { getAccountsBanking, AprobarCuentaBancaria, deleteAccounts, getAccountUserBanking, addAccountBanking, getOpciones } from '../../services/api';
import Swal from 'sweetalert2';

export const useAccountBanking = () => {
    const [accountBanking, setAccountBanking] = useState([]);
    const [accountBankingUser, setAccountBankingUser] = useState([]);
    const [tiposCuenta, setTiposCuenta] = useState([]);
    const [monedas, setMonedas] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleGetAccountBanking = async () => {
        try {
            const response = await getAccountsBanking();
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

    const handleGetAccountBankingUser = async () => {
        try {
            const response = await getAccountUserBanking();
            setAccountBankingUser(response.data)
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error',
            });
        }

    }

    const handleAddAccountBanking = async (data) => {
        try {
            setLoading(true);
            const response = await addAccountBanking(data);

            await Swal.fire({
                title: 'Cuenta Agregada',
                text: 'La cuenta ha sido agregada exitosamente',
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

    const handleGetOpciones = async () => {
        try {
            const response = await getOpciones();
            setTiposCuenta(response.data.tiposCuentas);
            setMonedas(response.data.monedasCuentas);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error',
                icon: 'error',
            });
        }
    }



    return { accountBankingUser, accountBanking, handleGetAccountBanking, handleAprobarCuenta, handleDeleteCuenta, handleGetAccountBankingUser, handleAddAccountBanking, handleGetOpciones, tiposCuenta, monedas, loading };
}
