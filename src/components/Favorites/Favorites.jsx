import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../shared/hooks/useFavorites';
import Layout from '../layout/Layout';
import {
    AccountBalance as AccountBalanceIcon,
    Face as FaceIcon,
    Balance as BalanceIcon,
    CurrencyExchange as CurrencyExchangeIcon,
    BrandingWatermark as BrandingWatermarkIcon,
    Favorite as FavoriteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Send as SendIcon
} from '@mui/icons-material';
import './Favorites.css';
import { getBanking } from '../../services/api';

const Favorites = () => {
    const navigate = useNavigate();
    const { favoritos, handleGetFavorites } = useFavorites();
    const [isLoading, setIsLoading] = useState(true);
    const [bankingOptions, setBankingOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await handleGetFavorites();
                const response = await getBanking();
                setBankingOptions(response.data.bancos || response.data);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar favoritos o bancos',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                })
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleTransferClick = (favorito) => {
        const bankNameFromFavorite = favorito.cuentaDestino.entidadBancaria?.name?.trim().toLowerCase();
        const innovaBankName = 'banco innova';

        const isInternalBank = bankNameFromFavorite === innovaBankName;

        let prefillData = {
            aliasReceptor: favorito.alias,
            tipoCuentaReceptor: favorito.tipoCuenta,
        };

        if (isInternalBank) {
            prefillData.cuentaReceptor = favorito.cuentaDestino.numeroCuenta;
            prefillData.bancoReceptor = 'Banco Innova';
            navigate('/transfer', { state: prefillData });
        } else {
            prefillData.cuentaReceptorExterno = favorito.cuentaDestino.numeroCuenta;
            prefillData.bancoReceptor = favorito.cuentaDestino.entidadBancaria?.name || '';
            navigate('/interTransfer', { state: prefillData });
        }
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-16 px-4 shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-10"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-white/20"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-6 transform transition-all duration-500 hover:scale-105">
                                <FavoriteIcon className="text-white text-5xl" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                Tus <span className="text-yellow-300">Favoritos</span>
                            </h1>
                            <p className="text-blue-100 max-w-2xl text-lg md:text-xl leading-relaxed">
                                Accede rápidamente a tus cuentas bancarias más utilizadas con un solo clic
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-20">
                        <div className="wave wave1"></div>
                        <div className="wave wave2"></div>
                        <div className="wave wave3"></div>
                    </div>
                </div>
                <div className="px-4 py-12 md:py-16">
                    <div className="max-w-7xl mx-auto">
                        {favoritos.length === 0 ? (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="inline-block p-6 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 shadow-inner">
                                    <StarBorderIcon className="text-gray-400 text-6xl" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-700 mb-2">No tienes favoritos aún</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Agrega cuentas a tus favoritos para verlas aquí y acceder rápidamente
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-12 text-center animate-fade-in">
                                    <h2 className="text-3xl font-bold text-gray-800 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                        <StarIcon className="text-yellow-500 mr-3" />
                                        {favoritos.length} {favoritos.length === 1 ? 'Cuenta Favorita' : 'Cuentas Favoritas'}
                                    </h2>
                                    <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                                        Tus cuentas más utilizadas, siempre a un clic de distancia
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {favoritos.map((favorito, index) => (
                                        <div
                                            key={favorito._id}
                                            className={`card-animation relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 hover:border-blue-200`}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-6 z-10">
                                                <StarIcon className="text-white" />
                                            </div>
                                            <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                                                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-200 opacity-20"></div>
                                                <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-indigo-200 opacity-20"></div>

                                                <div className="flex items-center relative z-10">
                                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md mr-4">
                                                        <AccountBalanceIcon className="text-white text-2xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">
                                                            {favorito.cuentaDestino.numeroCuenta}
                                                        </h3>
                                                        <p className="text-blue-600 text-sm font-medium">
                                                            {favorito.tipoCuenta}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 relative">
                                                <div className="mb-5 space-y-5">
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-xl mr-3 shadow-sm">
                                                            <FaceIcon className="text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Propietario</p>
                                                            <p className="font-semibold text-gray-800">
                                                                {favorito.cuentaDestino.propietario?.name || 'Desconocido'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-2 rounded-xl mr-3 shadow-sm">
                                                            <BalanceIcon className="text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Moneda</p>
                                                            <p className="font-semibold text-gray-800">
                                                                {favorito.cuentaDestino.moneda || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-xl mr-3 shadow-sm">
                                                            <CurrencyExchangeIcon className="text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Banco</p>
                                                            <p className="font-semibold text-gray-800">
                                                                {favorito.cuentaDestino.entidadBancaria?.name || 'Desconocido'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-2 rounded-xl mr-3 shadow-sm">
                                                            <BrandingWatermarkIcon className="text-yellow-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Alias</p>
                                                            <p className="font-semibold text-gray-800">
                                                                {favorito.alias}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleTransferClick(favorito)}
                                                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105"
                                                >
                                                    Transferir <SendIcon />
                                                </button>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Favorites;