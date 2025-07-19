import { useState } from "react";
import Swal from "sweetalert2";
import { postOrden, getOrdenesProductos, getOrdenesServicios, getProductos, getServices, getVerMisOrdenes } from "../../services/api";

export const useOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState([]);
    const [services, setServices] = useState([]);

    const showErrorAlert = (error) => {
        const backendError = error?.response?.data;
        const defaultMsg = 'Ocurrió un error inesperado';
        Swal.fire({
            title: 'Error',
            text: backendError?.msg || backendError?.error || defaultMsg,
            icon: 'error',
        });
    }

    const handlePostOrden = async (data, tipo = null) => {
        setLoading(true);
        try {
            await postOrden(data);
            if (tipo === 'producto') await handleGetOrdenesProductos();
            if (tipo === 'servicio') await handleGetOrdenesServicios();

            Swal.fire({
                title: 'Orden Creada',
                text: 'La orden se ha creado exitosamente!',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: { popup: 'animate__animated animate__fadeInDown' }
            });
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetOrdenesProductos = async () => {
        setLoading(true);
        try {
            const response = await getOrdenesProductos();
            setOrdenes(response.data.ordenes || []);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetOrdenesServicios = async () => {
        setLoading(true);
        try {
            const response = await getOrdenesServicios();
            setOrdenes(response.data.ordenes || []);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetProductos = async () => {
        setLoading(true);
        try {
            const response = await getProductos();
            setProductos(response.data.productos || []);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetServices = async () => {
        setLoading(true);
        try {
            const response = await getServices();
            setServices(response.data || []);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetMisOrdenes = async () => {
        setLoading(true);
        try {
            const response = await getVerMisOrdenes();
            setOrdenes(response.data.ordenes || []);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    };

    return { ordenes, productos, services, loading, setProductos, handlePostOrden, handleGetOrdenesProductos, handleGetOrdenesServicios, handleGetProductos, handleGetServices, handleGetMisOrdenes }
}