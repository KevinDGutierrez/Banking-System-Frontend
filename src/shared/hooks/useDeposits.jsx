import { useState } from "react";
import { getDeposits, 
    getDepositsById, 
    getDepositsByAccount, 
    postDeposits,  
    putDeposits, 
    deleteDeposits } from "../../services/api";
import Swal from "sweetalert2";

export const useDeposit = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetDeposits = async () => {
        try {
            setLoading(true)
            const response = await getDeposits();
            console.log(response.data.data, "Depositos");
            setDeposits(response.data.data)
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg
            })
        }finally{
            setLoading(false)
        }
    }

    const handleGetDepositsById = async (id) => {
        try {
            setLoading(true)
            const response = await getDepositsById(id);
            console.log(response.data, "datos");
            setDeposits(response.data)
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg
            })
        }finally{
            setLoading(false)
        }
    }

    const handleGetDepositsByAccount = async (cuenta) => {
        try {
            setLoading(true)
            const response = await getDepositsByAccount(cuenta);
            console.log(response.data, "success");
            setDeposits(response.data)
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg
            })
        }finally{
            setLoading(false)
        }
    }

    const handlePostDeposit = async (data) => {
        try {
            setLoading(true);
            const response = await postDeposits(data)
            console.log(response);

            Swal.fire({
                title:'Deposito Exitoso',
                text:" El deposito fue generado correctamente",
                icon: 'success',
                timer: 1500,
                background: '#1f2937',
                color: 'white',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            });
            await handleGetDeposits();
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                title: 'Error',
                text: backendError?.error || backendError?.msg
            })
        }finally{
            setLoading(false)
        }
    }

    const handlePutDeposit = async (id, data) => {
        const confirm = await Swal.fire({
            title: 'Confirmación',
            text: 'Confirma la actualizacion del deposito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, actualizar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: 'white',
            customClass: {
                popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
            }
        })

        if(confirm.isConfirmed){
            try{
                setLoading(true);
                const response = await putDeposits(id, data);
                console.log(response.data, 'datos actualizados');

                await Swal.fire({
                    title: 'Deposito Actualizado',
                    text: 'El deposito fue modificado correctamente, por favor verificar datos',
                    icon: 'success',
                    timer: 1500,
                    background: '#1f2937',
                    color: 'white',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
                    }
                });
                await handleGetDeposits();
            }catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error',
                    icon: 'error',
                    customClass: {
                         popup: 'swal-custom-zindex'
                    }
                });
            }finally{
                setLoading(false);
            }
        }
    } 

    const handleDeleteDeposit = async (id, data) => {
        const confirm = await Swal.fire({
            title: 'Advertencia',
            text: 'Esta seguro de eliminar el deposito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: 'white',
            customClass: {
                popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
            }
        })

        if(confirm.isConfirmed){
            try{
                setLoading(true);
                const response = await deleteDeposits(id);
                console.log(response.data, 'datos actualizados');

                await Swal.fire({
                    title: 'Deposito Eliminado',
                    text: 'El deposito fue eliminado correctamente, por favor verificar datos',
                    icon: 'success',
                    timer: 1500,
                    background: '#1f2937',
                    color: 'white',
                    customClass: {
                        popup: 'animate__animated animate__fadeInDown swal-custom-zindex'
                    }
                });
                await handleGetDeposits();
            }catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error',
                    text: backendError?.error || backendError?.msg || 'Error',
                    icon: 'error',
                    customClass: {
                         popup: 'swal-custom-zindex'
                    }
                });
            }finally{
                setLoading(false);
            }
        }
    } 
    return{
        deposits,
        loading,
        handleGetDeposits,
        handleGetDepositsById,
        handleGetDepositsByAccount,
        handlePostDeposit,
        handlePutDeposit,
        handleDeleteDeposit
    }
}