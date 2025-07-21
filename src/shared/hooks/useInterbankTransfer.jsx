import { useState } from 'react';
import Swal from 'sweetalert2';
import { realizarTransferenciaInterbancaria, getInterbankTransfers, getInterbankTransferById } from '../../services/api';

export const useInterbankTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [interbankTransfers, setInterbankTransfers] = useState([]);
    const [interbankTransfer, setInterbankTransfer] = useState(null);

    const handleRealizarTransferenciaInterbancaria = async (transferData) => {
        try {
            setLoading(true);

            const response = await realizarTransferenciaInterbancaria(transferData);

            await Swal.fire({
                title: 'Transferencia Exitosa',
                text: response.data?.msg || 'La transferencia interbancaria se realizó correctamente',
                icon: 'success',
                timer: 2000
            });

            return response.data.transferencia;

        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al obtener las transferencia interbancaria',
                icon: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetInterbankTransfers = async () => {
        try {
            setLoading(true);
            const response = await getInterbankTransfers();
            setInterbankTransfers(response.data.transferencias);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al realizar la transferencia interbancaria',
                icon: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetInterbankTransferById = async (id) => {
        try {
            setLoading(true);
            const response = await getInterbankTransferById(id);
            setInterbankTransfer(response.data.transferencia);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al obtener la transferencia por id',
                icon: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        interbankTransfers,
        interbankTransfer,
        handleRealizarTransferenciaInterbancaria,
        handleGetInterbankTransfers,
        handleGetInterbankTransferById,
    };
};
