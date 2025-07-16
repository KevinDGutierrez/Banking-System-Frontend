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
            console.log(response, "cliente number");
            setClienteNumber(response.data.cantidadClientes);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleCuentasActivas = async () => {
        try {
            const response = await getByNumeroCuentasActivas();
            console.log(response, "cuentas activas");
            setCuentasActivas(response.data.numeroCuentas);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleTransaccionesHoy = async () => {
        try {
            const response = await getByNumeroTransaccionesHoy();
            console.log(response, "transacciones");
            setTransaccionesHoy(response.data.total);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleIngresos = async () => {
        try {
            const response = await getIngresos();
            console.log(response, "ingresos");
            setIngresos(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleIngresosByPromedio = async () => {
        try {
            const response = await getIngresosByPromedio();
            console.log(response, "ingresos promedio");
            setIngresosByPromedio(response.data.promedio);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleTransfersByMoneda = async () => {
        try {
            const response = await getTransfersByMoneda();
            console.log(response, "transferencias");
            setTransfersByMoneda(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }
    return { clienteNumber, cuentasActivas, transaccionesHoy, ingresos, ingresosByPromedio, transfersByMoneda, handleClienteNumber, handleCuentasActivas, handleTransaccionesHoy, handleIngresos, handleIngresosByPromedio, handleTransfersByMoneda };
}
