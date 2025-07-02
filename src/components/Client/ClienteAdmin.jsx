import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { useClients } from '../../shared/hooks/useClients';
import { useClientsAdminHook } from '../../shared/hooks/useClientsAdmin';
import {
    User as UserIcon, Shield as ShieldIcon, Lock as LockIcon, CheckCircle as CheckCircleIcon, CreditCard as CreditCardIcon, Smartphone as SmartphoneIcon, Mail as MailIcon, Briefcase as BriefcaseIcon, DollarSign as DollarSignIcon, Award as AwardIcon, MapPin as MapPinIcon, FileText as FileTextIcon
} from 'react-feather';
import { CircleX, UserCheck, Fingerprint, XCircle, CheckCircle2, XCircleIcon, ArrowRight } from 'lucide-react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton
} from '@mui/material';
import './client.css'

const ClienteAdmin = () => {
    const { clientes, handleGetClientes, handleAprobarCliente } = useClients();
    const { clients, handleDatosPendientes, handleUpdateClientAdmin } = useClientsAdminHook();
    const [isLoading, setIsLoading] = useState(true);
    const [otrosDatos, setOtrosDatos] = useState(false)
    const [aprobaciones, setAprobaciones] = useState({});

    const handleAbrir = () => {
        setAprobaciones({});
        setOtrosDatos(true);
    };
    const handleCerrar = () => setOtrosDatos(false);

    const toggleCampo = (id, campo, valor) => {
        setAprobaciones(prev => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                [campo]: valor,
            }
        }));
    };
    const handleAprobarDatos = async (id) => {
        const datos = aprobaciones[id];
        if (!datos || Object.keys(datos).length === 0) {
            return alert("No se ha aprobado ningún dato.");
        }

        await handleUpdateClientAdmin(id, datos);
    };
    useEffect(() => {
        const fetchData = async () => {
            await handleGetClientes();
            await handleDatosPendientes();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleAprobarClienteAdmin = async (id) => {
        await handleAprobarCliente(id);
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
                    <div>
                        <div className="relative">
                            <button
                            onClick={handleAbrir}
                            className="absolute top-4 right-4 z-20 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <UserCheck size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:scale-105">Aprobación de datos de clientes</span>
                        </button>

                        </div>
                        <Dialog
                            open={otrosDatos}
                            onClose={handleCerrar}
                            fullWidth
                            maxWidth="md"
                            className="animate-fade-in"
                            style={{ zIndex: 1200 }}
                        >
                            <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
                                <div className="flex items-center gap-2">
                                    <UserCheck size={20} />
                                    <span className="text-lg font-bold">Formulario de aprobación</span>
                                </div>
                                <IconButton
                                    onClick={handleCerrar}
                                    className="hover:bg-white/10 transition-colors duration-200"
                                >
                                    <CircleX size={24} className="text-white hover:text-red-200 transition-colors duration-200" />
                                </IconButton>
                            </DialogTitle>

                            <DialogContent dividers className="bg-gray-50 p-0">
                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-4">
                                    {clients.map((client, index) => (
                                        <div
                                            key={client.usuario}
                                            className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-slide-up"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-indigo-100 p-2 rounded-full">
                                                    <UserIcon size={20} className="text-indigo-600" />
                                                </div>
                                                <h3 className="font-bold text-xl text-indigo-600">
                                                    Usuario: <span className="text-indigo-800">{client.usuario}</span>
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {Object.entries(client.datosPendientes).map(([campo, valor]) => (
                                                    <div
                                                        key={campo}
                                                        className="border p-4 rounded-xl shadow-sm bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-200 border-gray-200 relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100"></div>
                                                        <p className="text-gray-600 text-sm mb-1 font-semibold capitalize flex items-center gap-1">
                                                            <FileTextIcon size={14} className="text-gray-400" />
                                                            {campo}
                                                        </p>
                                                        <p className="text-gray-800 text-base mb-3 pl-5">{valor || <span className="text-gray-400">No proporcionado</span>}</p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleCampo(client.id, campo, valor)}
                                                                className={`px-3 py-1 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:shadow-md flex items-center gap-1 ${aprobaciones[client.id]?.[campo]
                                                                    ? "bg-green-500 hover:bg-green-600"
                                                                    : "bg-gray-400 hover:bg-gray-500"
                                                                    }`}
                                                            >
                                                                {aprobaciones[client.id]?.[campo] ? (
                                                                    <>
                                                                        <CheckCircle2 size={14} className="animate-pop" />
                                                                        <span>Aprobado</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <XCircle size={14} />
                                                                        <span>Aprobar</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <button
                                                    onClick={() => handleAprobarDatos(client.id)}
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                                                >
                                                    <span className="group-hover:scale-105 transition-transform duration-300">
                                                        Aprobar datos seleccionados
                                                    </span>
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>

                            <DialogActions className="bg-gray-100 px-4 py-3 rounded-b-lg border-t border-gray-200">
                                <Button
                                    onClick={handleCerrar}
                                    className="bg-white text-red-500 hover:bg-red-50 border border-red-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                >
                                    <XCircleIcon size={16} />
                                    <span>Cancelar</span>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
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
                                    key={cliente.uid}
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
                                            {!cliente.status && (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => handleAprobarClienteAdmin(cliente.uid)}
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                                                    startIcon={<CheckCircleIcon size={18} />}
                                                >
                                                    Aprobar cliente
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
        </Layout>
    );
}
export default ClienteAdmin;