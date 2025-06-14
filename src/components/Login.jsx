import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Paper,
    Fade,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle, Lock } from '@mui/icons-material';
import { useLogin } from '../shared/hooks/useLogin';
import video4 from '../assets/video4.mp4'

const Login = () => {
    const [usernameOrCorreo, setUsernameOrCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin } = useLogin();
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await handleLogin(usernameOrCorreo, password);
        setLoading(false);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z-0"
                src={video4}
                autoPlay
                loop
                muted
                playsInline
            />
            <div class="carousel-caption d-none d-md-block">
        <h5>Banco Innova Guatemala</h5>
        <p>Tu socio financiero para un futuro más brillante</p>
      </div>
            <div className="relative z-10 flex justify-center items-center h-full px-4">
                <Fade in timeout={800}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            maxWidth: 400,
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            animation: 'fadeInUp 0.8s ease-out'
                        }}
                    >
                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                    </svg>
                                </div>
                            </div>
                            <Typography variant="h4" fontWeight="bold" gutterBottom className="text-gray-800">
                                Banco Innova
                            </Typography>
                            <Typography variant="subtitle1" className="text-gray-600">
                                Accede a tu banca en línea
                            </Typography>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextField
                                label="Usuario o Correo"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={usernameOrCorreo}
                                onChange={(e) => setUsernameOrCorreo(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle className="text-blue-600" />
                                        </InputAdornment>
                                    ),
                                }}
                                className="bg-white rounded-lg"
                            />

                            <TextField
                                label="Contraseña"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock className="text-blue-600" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                edge="end"
                                                className="text-blue-600"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                className="bg-white rounded-lg"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ 
                                    mt: 2, 
                                    mb: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <Typography variant="body2" className="text-gray-600">
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => window.location.href = '/recuperar'}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Button>
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => window.location.href = '/register'}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Regístrate ahora
                                </Button>
                            </Typography>
                        </div>
                    </Paper>
                </Fade>
            </div>
        </div>
    );
};

export default Login;