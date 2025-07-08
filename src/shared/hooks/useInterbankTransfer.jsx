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
            console.log("Realizando transferencia interbancaria con datos:", transferData);

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
            console.error("Error en la transferencia interbancaria (frontend):", backendError || error.message || error);
            Swal.fire({
                title: 'Error',
                text: backendError?.msg || backendError?.error || 'Error al realizar la transferencia interbancaria',
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
            console.error("Error al obtener transferencias interbancarias:", error.response?.data || error.message);
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
            console.error("Error al obtener transferencia interbancaria por ID:", error.response?.data || error.message);
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
