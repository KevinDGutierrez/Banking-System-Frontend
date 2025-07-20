import { useState } from 'react';
import { getBanking } from '../../services/api';
import Swal from 'sweetalert2';

export const useBanking = () => {
    const [banking, setBanking] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetBanking = async () => {
        try {
            const response = await getBanking();
            setBanking(response.data);
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
    return { banking, handleGetBanking };
}