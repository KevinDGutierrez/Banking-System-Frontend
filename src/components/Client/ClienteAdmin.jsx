import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { useClients } from '../../shared/hooks/useClients';
import {
    User as UserIcon,
    Shield as ShieldIcon,
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    Trash2 as DeleteIcon,
    CreditCard as CreditCardIcon,
    Smartphone as SmartphoneIcon,
    Mail as MailIcon,
    Briefcase as BriefcaseIcon,
    DollarSign as DollarSignIcon,
    Award as AwardIcon,
    MapPin as MapPinIcon,
    FileText as FileTextIcon
} from 'react-feather';
import { Button } from '@mui/material';


const ClienteAdmin = () => {
    const { clientes, handleGetClientes, handleAprobarCliente, handleDeleteCliente } = useClients();
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        const fetchData = async () => {
            await handleGetClientes();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleAprobarClienteAdmin = async (id) => {
        await handleAprobarCliente(id);
        await handleGetClientes();
    }

    const handleDeleteClienteAdmin = async (id) => {
        await handleDeleteCliente(id);
        await handleGetClientes();
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-4 shadow-lg sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-white">
                            Gestión de Clientes
                        </h1>
                        <p className="text-indigo-100 mt-2">
                            Administración integral de clientes del sistema
                        </p>
                    </div>
                </div>

                <div className="px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clientes.map((cliente, index) => (
                                <div
                                    key={cliente._id}
                                    className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className={`h-2 ${cliente.status === 'activa' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                                                    <UserIcon size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {cliente.name}
                                                </h3>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${cliente.status
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {cliente.status ? (
                                                    <>
                                                        <CheckCircleIcon size={14} className="mr-1" />
                                                        Activo
                                                    </>
                                                ) : (
                                                    <>
                                                        <LockIcon size={14} className="mr-1" />
                                                        Pendiente
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mt-2">
                                            <div className="flex items-center bg-indigo-50 p-3 rounded-lg">
                                                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                                                    <ShieldIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Usuario</p>
                                                    <p className="font-medium text-gray-800">{cliente.username}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                                                        <CreditCardIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">No. Cuenta</p>
                                                        <p className="text-sm font-medium text-gray-800">{cliente.NoCuenta}</p>
                                                    </div>
                                                </div>


                                                <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-2">
                                                        <FileTextIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">DPI</p>
                                                        <p className="text-sm font-medium text-gray-800">{cliente.dpi}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex items-center bg-amber-50 p-3 rounded-lg">
                                                <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                                                    <MapPinIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Dirección</p>
                                                    <p className="font-medium text-gray-800">{cliente.direccion}</p>
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-2 gap-3">

                                                <div className="flex items-center bg-green-50 p-3 rounded-lg">
                                                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                                                        <SmartphoneIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Celular</p>
                                                        <p className="text-sm font-medium text-gray-800">{cliente.celular}</p>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="flex items-center bg-red-50 p-3 rounded-lg">
                                                <div className="p-2 rounded-full bg-red-100 text-red-600 mr-2">
                                                    <MailIcon size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Correo</p>
                                                    <p className="text-sm font-medium text-gray-800 truncate">{cliente.correo}</p>
                                                </div>
                                            </div>


                                            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                                                    <BriefcaseIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Trabajo</p>
                                                    <p className="font-medium text-gray-800">{cliente.NameTrabajo}</p>
                                                </div>
                                            </div>


                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center bg-emerald-50 p-3 rounded-lg">
                                                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 mr-2">
                                                        <DollarSignIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Ingresos</p>
                                                        <p className="text-sm font-medium text-gray-800">{cliente.ingresos}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-violet-50 p-3 rounded-lg">
                                                    <div className="p-2 rounded-full bg-violet-100 text-violet-600 mr-2">
                                                        <AwardIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Puntos</p>
                                                        <p className="text-sm font-medium text-gray-800">{cliente.puntos}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            {cliente.status !== 'activa' ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => handleAprobarClienteAdmin(cliente._id)}
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                                                    startIcon={<CheckCircleIcon size={18} />}
                                                >
                                                    Aprobar cliente
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => handleDeleteClienteAdmin(cliente._id)}
                                                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                                                    startIcon={<DeleteIcon size={18} />}
                                                >
                                                    Eliminar cliente
                                                </Button>
                                            )}
                                        </div>
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

export default ClienteAdmin;