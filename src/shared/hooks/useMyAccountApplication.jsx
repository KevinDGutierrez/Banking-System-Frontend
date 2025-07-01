import { useState } from "react";
import Swal from "sweetalert2";
import { myAccountApplication } from "../../services/api";

export const useMyAccountApplication = () => {
    const [isLoadingAccount, setIsLoadingAccount] = useState(false);
    const [myDataAccount, setMyDataAccount] = useState(null);

    const handleMyAccountApplication = async (formDataAccount, resetForm) => {
        console.log("enviando solicitud de cambio", formDataAccount);
        const { isConfirmed } = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres solicitar una nueva solicitud de cuenta?",
            icon: "question",
            showCancelButton: true,
            background: "1f2937",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, solicitar",
            cancelButtonText: "Cancelar"
        });

        if (!isConfirmed) return;
        setIsLoadingAccount(true);

        try {
            const datosFiltrados = Object.fromEntries(
                Object.entries(formDataAccount).filter(([_, value]) => value && value.trim() !== "")
            );
            const response = await myAccountApplication(datosFiltrados);
            console.log("respuesta solicitud:", response.data);
            const { message, cliente } = response.data;

            setMyDataAccount(cliente);

            Swal.fire({
                icon: "success",
                title: "Solicitud enviada correctamente",
                background: "1f2937",
                text: message
            });


            if (resetForm && typeof resetForm === "function") {
                resetForm();
            }
        } catch (error) {
            const backendError = error.response?.data;
            Swal.fire({
                icon: "error",
                title: "Error al solicitar",
                text: backendError?.msg
            });
        } finally {
            setIsLoadingAccount(false);
        }
    }

    return {
        isLoadingAccount,
        myDataAccount,
        handleMyAccountApplication
    };

}