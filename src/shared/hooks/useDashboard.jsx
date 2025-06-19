import {useState} from 'react';
import { useNavigate } from 'react-router-dom';


export const useMyAccount = () => {
    const [myAccount, setMyAccount] = useState([]);
    const navigate = useNavigate();

   const handleMyAccount = async () => {
    try {
        navigate("/myAccount", {state : {message : "Welcome to my account"}});
    } catch (error) {
        console.log(error);
    }
   }

    return {myAccount, handleMyAccount};
};

export const useAccountBanking = () => {
    const [accountBanking, setAccountBanking] = useState([]);
    const navigate = useNavigate();

   const handleAccountBanking = async () => {
    try {
        navigate("/accountBanking", {state : {message : "Welcome to account banking"}});
    } catch (error) {
        console.log(error);
    }
   }

  return {accountBanking, handleAccountBanking};
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
        navigate("/banking", {state : {message : "Welcome to banking"}});
    } catch (error) {
        console.log(error);
    }
   }

 return {banking, handleBanking};
}

export const useClientesAdmin = () => {
    const [clientesAdmin, setClientesAdmin] = useState([]);
    const navigate = useNavigate();

   const handleClientesAdmin = async () => {
    try {
        navigate("/clientesAdmin", {state : {message : "Welcome to list of clients"}});
    } catch (error) {
        console.log(error);
    }
   }

 return {clientesAdmin, handleClientesAdmin};
}

export const useAdminAccounts = () => {
    const [adminAccounts, setAdminAccounts] = useState([]);
    const navigate = useNavigate();

   const handleAdminAccounts = async () => {
    try {
        navigate("/adminAccounts", {state : {message : "Welcome to list of accounts banking"}});
    } catch (error) {
        console.log(error);
    }
   }

  return {adminAccounts, handleAdminAccounts};
}



