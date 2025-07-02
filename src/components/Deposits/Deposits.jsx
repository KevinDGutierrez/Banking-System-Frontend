import React, { useState, useEffect } from 'react'
import { useDeposit } from '../../shared/hooks/useDeposits'
import { useAccountBanking } from '../../shared/hooks/useAccountBanking'
import Layout from '../layout/Layout'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import EuroIcon from '@mui/icons-material/Euro'
import PersonIcon from '@mui/icons-material/Person'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import DescriptionIcon from '@mui/icons-material/Description'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'

const DepositAdmin = () => {
    const { 
        deposits,
        loading,
        handleGetDeposits,
        handleGetDepositsById,
        handleGetDepositsByAccount,
        handlePostDeposit,
        handlePutDeposit,
        handleDeleteDeposit
    } = useDeposit()
    
    const { accountBanking, handleAddAccountBanking, loading: loadingCuentas } = useAccountBanking()
    const [isLoading, setIsLoading] = useState(true)
    const [editingDeposit, setEditingDeposit] = useState(null)
    const [formData, setFormData] = useState({
        cuenta: '',
        monto: 0,
        moneda: 'GTQ',
        descripcion: ''
    })

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([handleAddAccountBanking(), handleGetDeposits()])
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
        const { cuenta, monto, descripcion } = formData

        if (monto <= 0 || !cuenta || !descripcion.trim()) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa valores válidos para monto, cuenta y descripción.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            })
            return
        }

        const depositData = {
            cuenta: cuenta,
            monto: parseFloat(monto),
            moneda: formData.moneda,
            descripcion: descripcion.trim()
        }

        if (editingDeposit) {
            await handlePutDeposit(editingDeposit._id, depositData)
            setEditingDeposit(null)
        } else {
            await handlePostDeposit(depositData)
        }

        setFormData({
            cuenta: '',
            monto: 0,
            moneda: 'GTQ',
            descripcion: ''
        })

        await handleGetDeposits()
    }

    const handleEdit = (deposit) => {
        setEditingDeposit(deposit)
        setFormData({
            cuenta: deposit.cuenta?._id || '',
            monto: deposit.monto,
            moneda: deposit.moneda,
            descripcion: deposit.descripcion
        })
    }

    const handleCancelEdit = () => {
        setEditingDeposit(null)
        setFormData({
            cuenta: '',
            monto: 0,
            moneda: 'GTQ',
            descripcion: ''
        })
    }

    const handleDelete = async (depositId) => {
        await handleDeleteDeposit(depositId)
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

    // Filtrar cuentas activas
    const cuentasActivas = accountBanking.filter(cuenta =>
        cuenta.estado?.toLowerCase() === 'activa'
    )

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
                            <MonetizationOnIcon className="text-blue-600" fontSize="large" />
                            Administración de Depósitos
                        </h1>
                    </div>
                </div>

                <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MonetizationOnIcon />
                                {editingDeposit ? 'Editar Depósito' : 'Crear Depósito'}
                            </h2>
                            <p className="text-blue-100 mt-1 flex items-center gap-1">
                                <AccountBalanceIcon />
                                {editingDeposit ? 'Modifica los datos del depósito' : 'Completa los datos para crear un depósito'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <AccountBalanceIcon className='me-3' />
                                    Cuenta bancaria
                                </label>
                                <select
                                    name="cuenta"
                                    value={formData.cuenta}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Selecciona una cuenta activa</option>
                                    {cuentasActivas.map((cuenta) => (
                                        <option key={cuenta._id} value={cuenta._id}>
                                            {cuenta.numeroCuenta} - {cuenta.tipo} - {cuenta.moneda} - {cuenta.usuario?.username || 'Usuario'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <AttachMoneyIcon className='me-3' />
                                    Monto
                                </label>
                                <input
                                    type="number"
                                    name="monto"
                                    value={formData.monto}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
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

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <DescriptionIcon className='me-3' />
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    placeholder="Descripción del depósito"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || isLoading || loadingCuentas}
                                    className="flex-1 py-3 text-white bg-blue-600 rounded-lg disabled:bg-blue-400 hover:bg-blue-700 transition-colors"
                                >
                                    {loading || isLoading || loadingCuentas ? 'Cargando...' : (editingDeposit ? 'Actualizar Depósito' : 'Crear Depósito')}
                                </button>
                                
                                {editingDeposit && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <ListAltIcon />
                                    Lista de Depósitos
                                </h2>
                                <p className="text-blue-100 mt-1 flex items-center gap-1">
                                    <PersonIcon />
                                    Todos los depósitos registrados
                                </p>
                            </div>

                            <div className="p-6">
                                {deposits.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">No hay depósitos registrados</h3>
                                        <p className="mt-1 text-gray-500">Comienza creando el primer depósito</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {deposits.map((deposit) => (
                                            <div
                                                key={deposit._id}
                                                className="group border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition duration-200 hover:shadow-md"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                                                        {getIconByMoneda(deposit.moneda)}
                                                        <span>{deposit.monto} {deposit.moneda}</span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(deposit)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar depósito"
                                                        >
                                                            <EditIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(deposit._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar depósito"
                                                        >
                                                            <DeleteIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                                        <DescriptionIcon className="h-4 w-4" />
                                                        <span>Descripción:</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">
                                                        {deposit.descripcion}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex flex-col w-1/2">
                                                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                            <AccountBalanceIcon className="h-4 w-4" />
                                                            Cuenta
                                                        </span>
                                                        <span className="text-gray-700 truncate max-w-xs">
                                                            {deposit.cuenta?.numeroCuenta || 'No asignada'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col w-1/2 items-end">
                                                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                            <PersonIcon className="h-4 w-4" />
                                                            Usuario
                                                        </span>
                                                        <span className="text-gray-700 truncate max-w-xs text-right">
                                                            {deposit.cuenta?.usuario?.username || 'Desconocido'}
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

export default DepositAdmin