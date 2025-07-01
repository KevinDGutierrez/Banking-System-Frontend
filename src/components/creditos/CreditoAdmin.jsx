import React, { useState, useEffect } from 'react'
import { useCredito } from '../../shared/hooks/useCredito'
import Layout from '../layout/Layout'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import EuroIcon from '@mui/icons-material/Euro'
import PersonIcon from '@mui/icons-material/Person'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import Swal from 'sweetalert2'

const CreditoAdmin = () => {
    const {
        creditos,
        handleGetCreditos,
        handleAprobarCredito,
        handledeleteCredito,
        loading
    } = useCredito()

    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        idCredito: '',
        montoAprobado: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            await handleGetCreditos()
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { idCredito, montoAprobado } = formData

        if (!idCredito || montoAprobado <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'Selecciona un crédito válido e ingresa un monto aprobado mayor a 0.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            })
            return
        }

        await handleAprobarCredito(idCredito, Number(montoAprobado))

        setFormData({
            idCredito: '',
            montoAprobado: 0
        })

        await handleGetCreditos()
    }

    const getIconByMoneda = (moneda) => {
        switch (moneda) {
            case 'USD':
                return <AttachMoneyIcon className="text-green-600" />
            case 'EUR':
                return <EuroIcon className="text-blue-600" />
            case 'GTQ':
            default:
                return <CurrencyExchangeIcon className="text-yellow-600" />
        }
    }

    if (isLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
                            <AttachMoneyIcon className="text-blue-600" fontSize="large" />
                            Gestión de Créditos
                        </h1>
                    </div>
                </div>

                <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <AttachMoneyIcon />
                                Aprobar Crédito
                            </h2>
                            <p className="text-blue-100 mt-1">
                                Selecciona un crédito pendiente y aprueba el monto
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <ListAltIcon className="h-5 w-5 me-3" />
                                    Selecciona crédito
                                </label>
                                <select
                                    name="idCredito"
                                    value={formData.idCredito}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Selecciona un crédito pendiente</option>
                                    {creditos
                                        .filter(c => c.status === false)
                                        .map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.user?.username} - {c.montoSolicitado} {c.moneda}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <AttachMoneyIcon className="h-5 w-5 me-3" />
                                    Monto Aprobado
                                </label>
                                <input
                                    type="number"
                                    name="montoAprobado"
                                    value={formData.montoAprobado}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                            >
                                Aprobar crédito
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ListAltIcon />
                                Créditos Solicitados
                            </h2>
                            <p className="text-blue-100 mt-1 flex items-center gap-1">
                                <AccountBalanceIcon className="h-5 w-5" />
                                Lista completa de usuarios
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {creditos.length === 0 ? (
                                <p className="text-center text-gray-500">No hay créditos registrados</p>
                            ) : (
                                creditos.map((credito) => (
                                    <div
                                        key={credito._id}
                                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                                                {getIconByMoneda(credito.moneda)}
                                                {credito.montoSolicitado} {credito.moneda}
                                            </div>

                                            <span className={`px-4 py-1 text-xs font-semibold rounded-full ${credito.status
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'}`}>
                                                {credito.status ? 'Aprobado' : 'Pendiente'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap justify-between mt-4 pt-4 border-t border-gray-100 gap-4">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                    <ScheduleIcon className="h-4 w-4" />
                                                    Plazo
                                                </span>
                                                <div className="text-gray-700">{credito.plazo} meses</div>
                                            </div>

                                            <div>
                                                <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                    <PersonIcon className="h-4 w-4" />
                                                    Usuario
                                                </span>
                                                <div className="text-gray-700">{credito.user?.username}</div>
                                            </div>

                                            <div>
                                                <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                    <ListAltIcon className="h-4 w-4" />
                                                    Cuenta
                                                </span>
                                                <div className="text-gray-700">{credito.cuenta?.numeroCuenta}</div>
                                            </div>

                                            <button
                                                onClick={() => handledeleteCredito(credito._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition flex items-center gap-1"
                                            >
                                                <DeleteForeverIcon className="h-5 w-5" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreditoAdmin
