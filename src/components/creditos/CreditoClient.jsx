import React, { useState, useEffect } from 'react'
import { useCredito } from '../../shared/hooks/useCredito'
import { useAccountBanking } from '../../shared/hooks/useAccountBanking'
import Layout from '../layout/Layout'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import EuroIcon from '@mui/icons-material/Euro'
import PersonIcon from '@mui/icons-material/Person'
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
    const [filtro, setFiltro] = useState('pendientes');

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

    const creditosAprobados = creditosUsuario.filter(
        (credito) => credito.status === true && credito.activo === true
    )

    const creditosPendientes = creditosUsuario.filter(
        (credito) => credito.status === false && credito.activo === true
    )

    const creditosNoAprobados = creditosUsuario.filter(
        (credito) => credito.status === false && credito.activo === false
    )

    const creditosFiltrados = () => {
        switch (filtro) {
            case 'aprobados':
                return creditosAprobados
            case 'pendientes':
                return creditosPendientes
            case 'no-aprobados':
                return creditosNoAprobados
            default:
                return creditosPendientes
        }
    }

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
                                >
                                    <option value="GTQ">GTQ</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
                            >
                                Solicitar Crédito
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold">Filtrar Créditos</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFiltro('pendientes')}
                                    className={`px-6 py-2 text-xs font-semibold rounded-full select-none transition-colors duration-300 ${filtro === 'pendientes' ? 'bg-orange-200 text-orange-800' : 'bg-gray-200'}`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    onClick={() => setFiltro('aprobados')}
                                    className={`px-6 py-2 text-xs font-semibold rounded-full select-none transition-colors duration-300 ${filtro === 'aprobados' ? 'bg-green-200 text-green-800' : 'bg-gray-200'}`}
                                >
                                    Aprobados
                                </button>
                                <button
                                    onClick={() => setFiltro('no-aprobados')}
                                    className={`px-6 py-2 text-xs font-semibold rounded-full select-none transition-colors duration-300 ${filtro === 'no-aprobados' ? 'bg-red-200 text-red-800' : 'bg-gray-200'}`}
                                >
                                    No Aprobados
                                </button>
                            </div>
                        </div>

                        {creditosFiltrados().length === 0 ? (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes créditos en esta categoría</h3>
                            </div>
                        ) : (
                            <div className="max-h-150 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                {creditosFiltrados().slice(0, 3).map((credito) => (
                                    <div key={credito._id} className="group border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition duration-200 hover:shadow-md">
                                        <div className="flex justify-between items-center">
                                            {credito.status === false && credito.activo === true && (
                                                <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                                                    {getIconByMoneda(credito.moneda)}
                                                    <span className="px-4 py-2 rounded-full">
                                                        {credito.montoSolicitado} {credito.moneda}
                                                    </span>
                                                </div>
                                            )}
                                            {credito.status === false && credito.activo === false && (
                                                <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                                                    {getIconByMoneda(credito.moneda)}
                                                    <span className="px-4 py-2 rounded-full">
                                                        {credito.montoSolicitado} {credito.moneda}
                                                    </span>
                                                </div>
                                            )}

                                            {credito.status && (
                                                <div>
                                                    <div className="flex items-center gap-2 font-bold text-gray-800 text-base">
                                                        {getIconByMoneda(credito.moneda)}
                                                        <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-full mb-3 text-base">
                                                            Solicitado: {credito.montoSolicitado} {credito.moneda}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 font-bold text-gray-800 text-base">
                                                        {getIconByMoneda(credito.moneda)}
                                                        <span className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-base">
                                                            Aprobado: {credito.montoAprobado} {credito.moneda}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <span className={`px-4 py-1 text-xs font-semibold rounded-full select-none ${credito.status === true ? 'bg-green-100 text-green-800' : credito.activo === false ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {credito.status === true ? 'Aprobado' : credito.activo === false ? 'No Aprobado' : 'Pendiente'}
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
                                                <span className="text-gray-700 truncate max-w-xs">{credito.user?.username || 'Desconocido'}</span>
                                            </div>
                                            <div className="flex flex-col w-1/3 items-end">
                                                <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                    <AccountBalanceIcon className="h-4 w-4" />
                                                    Cuenta
                                                </span>
                                                <span className="text-gray-700 truncate max-w-xs text-right">{credito.cuenta?.numeroCuenta || 'No asignada'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreditoClient
