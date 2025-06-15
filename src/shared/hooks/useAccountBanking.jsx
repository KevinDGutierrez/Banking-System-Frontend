import {useState} from 'react';
import { getAccountsBanking, AprobarCuentaBancaria } from '../../services/api';
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
        try {
            setLoading(true);
            const response = await AprobarCuentaBancaria(numeroCuenta);
            console.log(response);

            Swal.fire({
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

    return {accountBanking, handleGetAccountBanking, handleAprobarCuenta};
}
