import { useState } from "react";
import Swal from "sweetalert2";
import { postProducto, getProductos, getProductoPorNombre, putProducto, deleteProducto } from "../../services/api";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const showErrorAlert = (error) => {
        const backendError = error.response?.data;
        Swal.fire({
            title: 'Error',
            text: backendError?.error || backendError?.msg || 'Error',
            icon: 'error',
        })
    }

    const handlePostProducto = async (data, actualizarLista = false) => {
        setLoading(true);
        try {
            await postProducto(data);
            if (actualizarLista) {
                await handleGetProductos();
            }
            Swal.fire({
                title: 'Producto Creado',
                text: 'El producto se ha creado exitosamente!',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: { popup: 'animate__animated animate__fadeInDown' }
            })
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

    const handleGetProductoPorNombre = async (nombre) => {
        setLoading(true);
        try {
            const response = await getProductoPorNombre(nombre);
            setProductos(response.data);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handlePutProducto = async (id, data) => {
        setLoading(true);
        try {
            await putProducto(id, data);
            Swal.fire({
                title: 'Producto Actualizado',
                text: 'El producto se ha actualizado exitosamente!',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: { popup: 'animate__animated animate__fadeInDown' }
            })
            await handleGetProductos();
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteProducto = async (id) => {
        setLoading(true);
        try {
            await deleteProducto(id);
            Swal.fire({
                title: 'Producto Eliminado',
                text: 'El producto se ha eliminado exitosamente!',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: { popup: 'animate__animated animate__fadeInDown' }
            })
            await handleGetProductos();
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    }

    return { productos, loading, handlePostProducto, handleGetProductos, handleGetProductoPorNombre, handlePutProducto, handleDeleteProducto };
}