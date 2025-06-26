import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const useMyAccount = () => {
    const [myAccount, setMyAccount] = useState([]);
    const navigate = useNavigate();

    const handleMyAccount = async () => {
        try {
            console.log("1")
            navigate("/myAccount", { state: { message: "Welcome to my account" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { myAccount, handleMyAccount };
};

export const useAccountBanking = () => {
    const [accountBanking, setAccountBanking] = useState([]);
    const navigate = useNavigate();

    const handleAccountBanking = async () => {
        try {
            navigate("/accountBanking", { state: { message: "Welcome to account banking" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { accountBanking, handleAccountBanking };
}

export const useBanking = () => {
    const [banking, setBanking] = useState([]);
    const navigate = useNavigate();

    const handleBanking = async () => {
        try {
            navigate("/banking", { state: { message: "Welcome to banking" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { banking, handleBanking };
}

export const useClientesAdmin = () => {
    const [clientesAdmin, setClientesAdmin] = useState([]);
    const navigate = useNavigate();

    const handleClientesAdmin = async () => {
        try {
            navigate("/clientesAdmin", { state: { message: "Welcome to list of clients" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { clientesAdmin, handleClientesAdmin };
}

export const useAdminAccounts = () => {
    const [adminAccounts, setAdminAccounts] = useState([]);
    const navigate = useNavigate();

    const handleAdminAccounts = async () => {
        try {
            navigate("/adminAccounts", { state: { message: "Welcome to list of accounts banking" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { adminAccounts, handleAdminAccounts };
}

export const userFavorites = () => {
    const [favoritosClient, setFavoritosClient] = useState([]);
    const navigate = useNavigate();

    const handleFavoritesClient = async () => {
        try {
            navigate("/favoritos", { state: { message: "Welcome to list of favorites" } });
        } catch (error) {
            console.log(error);
        }
    }


    return { favoritosClient, handleFavoritesClient };
}



