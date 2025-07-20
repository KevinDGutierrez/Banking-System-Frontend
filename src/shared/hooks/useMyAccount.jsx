import { useState } from 'react';
import Swal from 'sweetalert2';
import { myAccount } from '../../services/api';

export const useMyAccountEdit = () => {
    const [isLoading, setIsLoading] = useState([]);
    const [myData, setMyData] = useState([]);

    const handleMyAccountEdit = async (formData, resetForm) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres actualizar los datos de tu cuenta?",
            icon: 'question',
            showCancelButton: true,
            background: "1f2937",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        });

        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const response = await myAccount(formData);
            const { message, cliente } = response.data;

            setMyData(cliente);

            Swal.fire({
                icon: 'success',
                title: 'Actualizado correctamente',
                background: '1f2937',
                text: message,
            });


            if (resetForm && typeof resetForm === 'function') {
                resetForm();
            }


        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: backendError?.msg || 'Error inesperado',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        myData,
        handleMyAccountEdit,
    };
};