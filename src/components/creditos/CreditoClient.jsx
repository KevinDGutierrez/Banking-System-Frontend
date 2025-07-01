import React, { useState, useEffect } from 'react'
import { useCredito } from '../../shared/hooks/useCredito'
import { useAccountBanking } from '../../shared/hooks/useAccountBanking'
import Layout from '../layout/Layout'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import EuroIcon from '@mui/icons-material/Euro'
import PersonIcon from '@mui/icons-material/Person'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ScheduleIcon from '@mui/icons-material/Schedule'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import Swal from 'sweetalert2'

const CreditoClient = () => {
    const { creditos, handleGetCreditos, handleSolicitarCredito, loading } = useCredito()
    const { accountBankingUser, handleGetAccountBankingUser, loading: loadingCuentas } = useAccountBanking()
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        montoSolicitado: 0,
        montoAprobado: 0,
        plazo: 0,
        moneda: 'GTQ',
        numeroCuenta: ''
    })

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([handleGetCreditos(), handleGetAccountBankingUser()])
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { montoSolicitado, plazo, numeroCuenta } = formData

        if (montoSolicitado <= 0 || plazo <= 0 || !numeroCuenta) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa valores válidos para monto, plazo y selecciona una cuenta',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            })
            return
        }

        await handleSolicitarCredito(
            montoSolicitado,
            plazo,
            formData.moneda,
            numeroCuenta
        )

        setFormData({
            montoSolicitado: 0,
            plazo: 0,
            moneda: 'GTQ',
            numeroCuenta: ''
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

    if (isLoading || loading || loadingCuentas) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    const creditosUsuario = creditos.filter(
        (credito) => credito.user?.username === user?.username
    )

    const cuentasBancoInnova = accountBankingUser.filter(cuenta =>
        cuenta.estado?.toLowerCase() === 'activa' &&
        cuenta.entidadBancaria?.name?.toLowerCase() === 'banco innova'
    )

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
                            <MonetizationOnIcon className="text-blue-600" fontSize="large" />
                            Gestión de Créditos
                        </h1>
                    </div>
                </div>

                <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MonetizationOnIcon />
                                Solicitar Crédito
                            </h2>
                            <p className="text-blue-100 mt-1 flex items-center gap-1">
                                <AccountBalanceIcon />
                                Completa los datos para solicitar un crédito
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <AccountBalanceIcon className='me-3' />
                                    Cuenta bancaria
                                </label>
                                <select
                                    name="numeroCuenta"
                                    value={formData.numeroCuenta}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Selecciona una cuenta activa (Banco Innova)</option>
                                    {cuentasBancoInnova.map((cuenta) => (
                                        <option key={cuenta._id} value={cuenta._id}>
                                            {cuenta.numeroCuenta} - {cuenta.tipo} - {cuenta.moneda}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <AttachMoneyIcon className='me-3' />
                                    Monto Solicitado
                                </label>
                                <input
                                    type="number"
                                    name="montoSolicitado"
                                    value={formData.montoSolicitado}
                                    onChange={handleInputChange}
                                    min="1000"
                                    max="1000000"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <ScheduleIcon className='me-3' />
                                    Plazo (Meses)
                                </label>
                                <input
                                    type="number"
                                    name="plazo"
                                    value={formData.plazo}
                                    onChange={handleInputChange}
                                    min="6"
                                    max="36"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <CurrencyExchangeIcon className='me-3' />
                                    Moneda
                                </label>
                                <select
                                    name="moneda"
                                    value={formData.moneda}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="GTQ">GTQ</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || isLoading || loadingCuentas}
                                className="w-full py-3 text-white bg-blue-600 rounded-lg disabled:bg-blue-400"
                            >
                                {loading || isLoading || loadingCuentas ? 'Cargando...' : 'Solicitar Crédito'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <ListAltIcon />
                                    Créditos Solicitados
                                </h2>
                                <p className="text-blue-100 mt-1 flex items-center gap-1">
                                    <PersonIcon />
                                    Lista de créditos que has solicitado
                                </p>
                            </div>

                            <div className="p-6">
                                {creditosUsuario.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No has solicitado créditos aún</h3>
                                        <p className="mt-1 text-gray-500">Comienza agregando tu primer crédito</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {creditosUsuario.map((credito) => (
                                            <div
                                                key={credito._id}
                                                className="group border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition duration-200 hover:shadow-md"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                                                        {getIconByMoneda(credito.moneda)}
                                                        <span>{credito.montoSolicitado} {credito.moneda}</span>
                                                    </div>

                                                    <span className={`px-4 py-1 text-xs font-semibold rounded-full select-none ${credito.status === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' && credito.activo === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {credito.status === true ? 'Aprobado' : 'Pendiente' && credito.activo === false ? 'No Aprobado' : 'Pendiente'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex flex-col w-1/3">
                                                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                            <ScheduleIcon className="h-4 w-4" />
                                                            Plazo
                                                        </span>
                                                        <span className="text-gray-700">{credito.plazo} meses</span>
                                                    </div>

                                                    <div className="flex flex-col w-1/3">
                                                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                            <PersonIcon className="h-4 w-4" />
                                                            Usuario
                                                        </span>
                                                        <span className="text-gray-700 truncate max-w-xs">
                                                            {credito.user?.username || 'Desconocido'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col w-1/3 items-end">
                                                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                            <AccountBalanceIcon className="h-4 w-4" />
                                                            Cuenta
                                                        </span>
                                                        <span className="text-gray-700 truncate max-w-xs text-right">
                                                            {credito.cuenta?.numeroCuenta || 'No asignada'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreditoClient
