import React from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useLogin } from "../shared/hooks/useLogin";
import { validarCamposObligatorios, validarActivacionCuentaStatus } from '../shared/validations/validationsAuth';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const {
        handleLogin,
        loginError,
        loginSucces,
    } = useLogin();

    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "100px",
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                Iniciar Sesión
            </Typography>

            {loginError && (
                <Alert severity="error" sx={{ marginBottom: 2, width: "100%" }}>
                    {loginError}
                </Alert>
            )}

            {loginSucces && (
                <Alert severity="success" sx={{ marginBottom: 2, width: "100%" }}>
                    {loginSucces}
                </Alert>
            )}

            <form
                onSubmit={handleSubmit(handleLogin)}
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <TextField
                    id="correo"
                    label="Correo o Usuario"
                    variant="outlined"
                    required
                    fullWidth
                    sx={{ marginBottom: "16px" }}
                    {...register("correo", {
                        validate: validarCamposObligatorios,
                    })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    id="password"
                    label="Contraseña"
                    variant="outlined"
                    required
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    sx={{ marginBottom: "16px" }}
                    {...register("password", {
                        validate: validarCamposObligatorios,
                    })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ marginBottom: "10px" }}
                    validation={validarActivacionCuentaStatus}
                    disabled={loginError || loginSucces}
                >
                    Iniciar Sesión
                </Button>

                <Typography variant="body2">
                    ¿Olvidaste tu contraseña?{" "}
                    <a href="/solicitar-recuperacion">Recupérala aquí</a>
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                    ¿No tienes cuenta? <a href="/register">Regístrate</a>
                </Typography>
            </form>
        </Box>
    );
}