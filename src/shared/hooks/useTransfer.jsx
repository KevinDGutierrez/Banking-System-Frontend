import { useState } from 'react';
import Swal from 'sweetalert2';
import { realizarTransferencia, getTransfers, getTransferById } from '../../services/api';

export const useTransfer = () => {
    const [transfers, setTransfers] = useState([]);
    const [transfer, setTransfer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetTransfers = async () => {
        try {
            setLoading(true);
            const response = await getTransfers();
            console.log("Transferencias obtenidas:", response.data.transfers);
            setTransfers(response.data.transfers);
        } catch (error) {
            const backendError = error.response?.data;
            console.error("Error al obtener las transferencias:", backendError?.msg || backendError?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRealizarTransferencia = async ({ cuentaEmisor, cuentaReceptor, tipoCuentaReceptor, monto, moneda, aliasReceptor, bancoReceptor }) => {
        try {
            setLoading(true);

            const data = {
                cuentaEmisor,
                cuentaReceptor,
                tipoCuentaReceptor,
                monto: Number(monto),
                moneda,
                aliasReceptor
            };

            console.log("Realizando transferencia con datos:", data);

            const response = await realizarTransferencia(data, bancoReceptor);

            await Swal.fire({
                title: 'Transferencia Exitosa',
                text: 'La transferencia se realizó correctamente',
                icon: 'success',
                timer: 1500
            });

            return response.data.transferencia; 

        } catch (error) {
            const backendError = error.response?.data;
            console.error("Error en la transferencia:", backendError); 
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg ||'Error al realizar la transferencia',
                icon: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetTransferById = async (id) => {
        try {
            const response = await getTransferById(id);
            setTransfer(response.data.transferencia);
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg || 'Error al obtener los detalles de la transferencia',
                icon: 'error'
            });
        }
    };

    return {
        transfers,
        transfer,
        loading,
        handleGetTransfers,
        handleRealizarTransferencia,
        handleGetTransferById,
    };
};
