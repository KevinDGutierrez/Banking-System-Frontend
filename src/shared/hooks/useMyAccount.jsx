import { useState } from "react";
import { myAccount } from "../../services/api";
import Swal from "sweetalert2";

export const useMyAccountEdit = () => {
    const [myAccountEdit, setMyAccountEdit] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMyAccountEdit = async (data) => {
        console.log(data)
        const confirm = await Swal.fire({
            title: "¿Está seguro?",
            text: "¿Desea guardar los cambios?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
            background: "#1f2937",
            color: "white",
            customClass: {
                popup: "animate__animated animate__fadeInDown",
            },
        });

        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const response = await myAccount(data)
                console.log(response);

                await Swal.fire({
                    title: "Datos guardados",
                    text: "Los datos se han guardado exitosamente",
                    icon: "success",
                    timer: 1500,
                    background: "#1f2937",
                    color: "white",
                    customClass: {
                        popup: "animate__animated animate__fadeInDown",
                    },
                });

            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: "Error",
                    text: backendError?.error || backendError?.msg || "Error",
                    icon: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return { myAccountEdit, handleMyAccountEdit, loading };
};
