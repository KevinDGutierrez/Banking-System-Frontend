import { useState } from "react";
import { getFavorites, addFavorite } from "../../services/api";
import Swal from "sweetalert2";

export const useFavorites = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetFavorites = async () => {
        try {
            const response = await getFavorites();
            console.log(response);
            setFavoritos(response.data);
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

    const handleAddFavorite = async (data) => {
        try {
            setLoading(true);
            const response = await addFavorite(data);
            console.log(response);

            Swal.fire({
                title: 'Favorito agregado',
                text: 'El favorito ha sido agregado exitosamente',
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            });
            await handleGetFavorites();
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

    return {favoritos, handleGetFavorites, handleAddFavorite};

}