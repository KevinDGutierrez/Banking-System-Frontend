import { useState } from "react";
import { myAccountList } from "../../services/api";
import Swal from "sweetalert2";

export const useAccountList = () => {
    const [isLoadingMyAccount, setIsLoadingMyAccount] = useState(false);
    const [accountList, setAccountList] = useState([]);
    
        const handleMyAccountList = async () => {
            try {
                const response = await myAccountList();
                setAccountList(response.data.account);
            } catch (error) {
                const backendError = error.response?.data;
                Swal.fire({
                    title: 'Error ',
                    text: backendError?.error || backendError?.msg || 'Error',
                    icon: 'error',
                });
            } finally {
                setIsLoadingMyAccount(false);
            }
        };
    return {handleMyAccountList, accountList, isLoadingMyAccount}
}