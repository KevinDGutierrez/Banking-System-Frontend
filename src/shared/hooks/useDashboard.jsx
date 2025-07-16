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
 
export const useSolicitarCredito = () => {
    const [solicitudCredito, setSolicitudCredito] = useState([]);
    const navigate = useNavigate();
 
   const handleSolicitarCredito = async () => {
    try {
        navigate("/solicitudCredito", {state : {message : "Welcome to account credits"}});
    } catch (error) {
        console.log(error);
    }
   }
 
  return {solicitudCredito, handleSolicitarCredito};
}
 
export const useAprobarCredito = () => {
    const [aprobarCredito, setAprobarCredito] = useState([]);
    const navigate = useNavigate();
 
   const handleAprobarCredito = async () => {
    try {
        navigate("/aprobarCredito", {state : {message : "Welcome to account credits"}});
    } catch (error) {
        console.log(error);
    }
   }
 
  return {aprobarCredito, handleAprobarCredito};
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

export const useAdminDeposits = () =>{
    const [adminDeposit, setAdminDeposit]= useState([]);
    const navigate = useNavigate();

    const handleAdminDeposits = async () => {
        try {
            navigate("/depositos", {state:{message: 'Welcome to deposits list'}})
        } catch (error) {
            console.log(error)
        }
    }
    return {adminDeposit, handleAdminDeposits};
}

export const useProductoAdmin = () => {
    const [adminProductos, setAdminProductos] = useState([]);
    const navigate = useNavigate();

    const handleAdminProductos = async () => {
        try {
            navigate("/adminProductos", { state: { message: "Bienvenido a la lista de productos" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { adminProductos, handleAdminProductos };
}

export const useOrdenCliente = () => {
    const [clienteOrdenes, setClienteOrdenes] = useState([]);
    const navigate = useNavigate();

    const handleClienteOrdenes = async () => {
        try {
            navigate("/clienteOrdenes", { state: { message: "Bienvenido a la lista de ordenes" } });
        } catch (error) {
            console.log(error);
        }
    }

    return { clienteOrdenes, handleClienteOrdenes };
};

export const useTransferencias = () => {
    const [transferencias, setTransferencias] = useState([]);
    const navigate = useNavigate();

    const handleTransferencias = async () => {
       try {
            navigate("/transfers", { state: { message: "Welcome to transfers" } });
        } catch (error) {
            console.log(error);
        }
    };

    return { transferencias, handleTransferencias };
};

export const useAdminTransferencias = () => {
    const [adminTransferencias, setAdminTransferencias] = useState([]);
    const navigate = useNavigate();

    const handleAdminTransferencias = async () => {
       try {
            navigate("/adminTransfers", { state: { message: "Welcome to transfers" } });
        } catch (error) {
            console.log(error);
        }
    };

    return { adminTransferencias, handleAdminTransferencias };
};