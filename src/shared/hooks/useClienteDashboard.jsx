import {useState} from 'react';
import {getUltimaTransaccion, getSaldoTotal, getVerMisOrdenes, getVerMisPuntos} from '../../services/api';

export const useClienteDashboard = () => {
    const [ultimaTransaccion, setUltimaTransaccion] = useState([]);
    const [saldoTotal, setSaldoTotal] = useState([]);
    const [misPuntos, setMisPuntos] = useState([]);
    const [misOrdenes, setMisOrdenes] = useState([]);

    const handleUltimaTransaccion = async () => {
        try {
            const response = await getUltimaTransaccion();
            console.log(response, "ultima transaccion");
            setUltimaTransaccion(response.data.monto);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleSaldoTotal = async () => {
        try {
            const response = await getSaldoTotal();
            console.log(response, "saldo total");
            setSaldoTotal(response.data.saldo);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleMisPuntos = async () => {
        try {
            const response = await getVerMisPuntos();
            console.log(response, "mis puntos");
            setMisPuntos(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }

    const handleMisOrdenes = async () => {
        try {
            const response = await getVerMisOrdenes();
            console.log(response, "mis ordenes");
            setMisOrdenes(response.data);
        } catch (error) {
            const backendError = error.response?.data;
            console.log(backendError);
        }
    }


    return {ultimaTransaccion, saldoTotal, misOrdenes, misPuntos, handleUltimaTransaccion, handleSaldoTotal, handleMisPuntos, handleMisOrdenes};
}