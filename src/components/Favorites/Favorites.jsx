import React from 'react';
import { useState, useEffect } from 'react';
import { useFavorites } from '../../shared/hooks/useFavorites';
import Layout from '../layout/Layout';


const Favorites = () => {
    const { favoritos, handleGetFavorites, handleAddFavorite } = useFavorites();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
       'cuentaDestino': '',
       'alias': '',
    });

    useEffect(() => {
        const fetchData = async () => {
            await handleGetFavorites();
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAddFavorite(formData);
        setFormData({
            cuentaDestino: '',
            alias: '',
        });
        await handleGetFavorites(); 
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Header */}
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
                            Gestión de Cuentas Bancarias
                        </h1>
                        <p className="text-center text-gray-600 mt-2">
                            Administración y aprobación de cuentas bancarias
                        </p>
                    </div>
                </div>

                <div className="px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritos.map((account, index) => (
                                <div
                                    key={account._id}
                                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <AccountBalanceIcon className="text-blue-600 mr-3" />
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {account.numeroCuenta}
                                                </h3>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${account.estado === 'activa'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {account.estado === 'activa' ? (
                                                    <span className="flex items-center">
                                                        <CheckCircleIcon className="mr-1" style={{ fontSize: 16 }} />
                                                        Activa
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <LockIcon className="mr-1" style={{ fontSize: 16 }} />
                                                        Bloqueada
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
                                            <FaceIcon className="text-gray-600 mr-3" />
                                            <p className="text-gray-700 truncate" title={account.propietario.correo}>
                                                {account.propietario.correo}
                                            </p>
                                        </div>

                                        <div className="space-y-3 mt-2">
                                            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                <ScoreIcon className="text-blue-600 mr-3" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Tipo: </span>
                                                    <span className="ml-1 font-medium text-blue-800">{account.tipo}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-green-50 p-3 rounded-lg">
                                                <BalanceIcon className="text-green-600 mr-3" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Saldo: </span>
                                                    <span className="ml-1 font-medium text-green-800">{account.saldo}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                                                <CurrencyExchangeIcon className="text-purple-600 mr-3" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Moneda: </span>
                                                    <span className="ml-1 font-medium text-purple-800">{account.moneda}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-indigo-50 p-3 rounded-lg">
                                                <BrandingWatermarkIcon className="text-indigo-600 mr-3" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Banco: </span>
                                                    <span className="ml-1 font-medium text-indigo-800">{account.entidadBancaria.name}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-gray-50 p-3 rounded-lg text-sm">
                                                <CalendarMonthIcon className="text-gray-500 mr-3" />
                                                <span className="text-gray-600">Apertura: {new Date(account.fechaApertura).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {account.estado !== 'activa' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleAprobarCuentaBancaria(account.numeroCuenta)}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                                                    startIcon={<CheckCircleIcon />}
                                                >
                                                    Aprobar cuenta
                                                </Button>
                                            </div>
                                        )}
                                        {account.estado !== 'bloqueada' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleEliminarCuentaBancaria(account._id)}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                                                    startIcon={<CheckCircleIcon />}
                                                >
                                                    Desactivar Cuenta
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fade-in-left {
                    animation: fadeInLeft 0.6s ease-out forwards;
                }
                
                .animate-fade-in-right {
                    animation: fadeInRight 0.6s ease-out forwards;
                }
            `}</style>
        </Layout>
    );
}