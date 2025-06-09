import { useState } from "react";
import {useNavigate} from "react-router-dom"
import { login } from "../../services/api";


export const login = async () => {
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState(null);
    const [loginSucces, setLoginSucces] = useState(null);

    const handleLogin = async (data) => {
        try {
            const response = await loginSucces (data)
            const userDetails = response;

            localStorage.setItem("user", JSON.stringify(userDetails));
        } catch (error) {
            setLoginError(error.message);
        }
    } 
}