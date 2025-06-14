import React, {useEffect, useState} from 'react';
import Layout from '../layout/Layout';
import { useBanking } from '../../shared/hooks/useBanking';
import Swal from 'sweetalert2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglasEmptyIcon from '@mui/icons-material/HourglassEmpty';

const Banking = () => {
    const {banking, handleGetBanking} = useBanking();

    useEffect(() => {
        handleGetBanking();
    }, [])

    const copiarAlPortapapeles  = (name) => {
        navigator.clipboard.writeText(name).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Copiado!',
                showConfirmButton: false,
                timer: 1500,
                background : '#4CAF50',
                color : 'white',
                customClass : {
                    popup : 'animate__animated animate__fadeInDown',
                }
            })
        })
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Lista de Bancos</h1>
        </Layout>
    )
}

export default Banking;