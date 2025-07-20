import { useState } from 'react';
import { getByClienteNumber, getByNumeroCuentasActivas, getByNumeroTransaccionesHoy, getIngresos, getIngresosByPromedio, getTransfersByMoneda } from '../../services/api';

export const useAdminDashboard = () => {
    const [clienteNumber, setClienteNumber] = useState([]);
    const [cuentasActivas, setCuentasActivas] = useState([]);
    const [transaccionesHoy, setTransaccionesHoy] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [ingresosByPromedio, setIngresosByPromedio] = useState([]);
    const [transfersByMoneda, setTransfersByMoneda] = useState([]);

    const handleClienteNumber = async () => {
        try {
            const response = await getByClienteNumber();
            setClienteNumber(response.data.cantidadClientes);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleCuentasActivas = async () => {
        try {
            const response = await getByNumeroCuentasActivas();
            setCuentasActivas(response.data.numeroCuentas);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleTransaccionesHoy = async () => {
        try {
            const response = await getByNumeroTransaccionesHoy();
            setTransaccionesHoy(response.data.total);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleIngresos = async () => {
        try {
            const response = await getIngresos();
            setIngresos(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleIngresosByPromedio = async () => {
        try {
            const response = await getIngresosByPromedio();
            setIngresosByPromedio(response.data.promedio);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleTransfersByMoneda = async () => {
        try {
            const response = await getTransfersByMoneda();
            setTransfersByMoneda(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }
    return { clienteNumber, cuentasActivas, transaccionesHoy, ingresos, ingresosByPromedio, transfersByMoneda, handleClienteNumber, handleCuentasActivas, handleTransaccionesHoy, handleIngresos, handleIngresosByPromedio, handleTransfersByMoneda };
}
