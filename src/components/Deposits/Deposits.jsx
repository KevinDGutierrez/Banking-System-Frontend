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
    
    const { accountBanking, handleGetAccountBanking, loading: loadingCuentas } = useAccountBanking()
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
            try {
                console.log('🔄 Iniciando carga de datos...')
                
                // Cargar datos en paralelo
                const results = await Promise.all([
                    handleGetAccountBanking(),
                    handleGetDeposits()
                ])
                
                console.log('✅ Datos cargados:', {
                    accountBanking: results[0],
                    deposits: results[1]
                })
                
                console.log('📊 Estado actual de deposits:', deposits)
                console.log('🏦 Estado actual de accountBanking:', accountBanking)
                
            } catch (error) {
                console.error('❌ Error al cargar datos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchData()
    }, [])

    // Debug: Monitorear cambios en deposits
    useEffect(() => {
        console.log('📈 Deposits actualizado:', {
            length: deposits?.length || 0,
            data: deposits,
            isArray: Array.isArray(deposits)
        })
    }, [deposits])

    // Debug: Monitorear cambios en accountBanking
    useEffect(() => {
        console.log('🏦 AccountBanking actualizado:', {
            length: accountBanking?.length || 0,
            data: accountBanking,
            isArray: Array.isArray(accountBanking)
        })
    }, [accountBanking])

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

        console.log('💾 Enviando depósito:', depositData)

        try {
            let result
            if (editingDeposit) {
                result = await handlePutDeposit(editingDeposit._id, depositData)
                setEditingDeposit(null)
                console.log('✏️ Depósito actualizado:', result)
            } else {
                result = await handlePostDeposit(depositData)
                console.log('➕ Depósito creado:', result)
            }

            // Limpiar formulario
            setFormData({
                cuenta: '',
                monto: 0,
                moneda: 'GTQ',
                descripcion: ''
            })

            // Recargar datos
            console.log('🔄 Recargando depósitos...')
            await handleGetDeposits()
            
        } catch (error) {
            console.error('❌ Error al procesar depósito:', error)
        }
    }

    const handleEdit = (deposit) => {
        console.log('✏️ Editando depósito:', deposit)
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
        console.log('🗑️ Eliminando depósito:', depositId)
        try {
            await handleDeleteDeposit(depositId)
            console.log('✅ Depósito eliminado')
            await handleGetDeposits() // Recargar después de eliminar
        } catch (error) {
            console.error('❌ Error al eliminar depósito:', error)
        }
    }

    const handleRefresh = async () => {
        console.log('🔄 Refrescando datos manualmente...')
        setIsLoading(true)
        try {
            await handleGetDeposits()
            await handleGetAccountBanking()
        } catch (error) {
            console.error('❌ Error al refrescar:', error)
        } finally {
            setIsLoading(false)
        }
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
                <p className="ml-4 text-gray-600">Cargando depósitos...</p>
            </div>
        )
    }

    // Filtrar cuentas activas
    const cuentasActivas = accountBanking?.filter(cuenta =>
        cuenta.estado?.toLowerCase() === 'activa'
    ) || []
    console.log('🔍 Cuentas activas:', cuentasActivas)

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <MonetizationOnIcon className="text-blue-600" fontSize="large" />
                                Administración de Depósitos
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Depósitos: {deposits?.length || 0}
                                </span>
                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    🔄 Refrescar
                                </button>
                            </div>
                        </div>
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
                                    <AccountBalanceIcon />
                                    Cuenta bancaria
                                </label>
                                <select
                                    name="cuenta"
                                    value={formData.cuenta}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Selecciona una cuenta activa</option>
                                    {cuentasActivas.map((cuenta) => (
                                        <option key={cuenta.numeroCuenta} value={cuenta.numeroCuenta}>
                                            {cuenta.numeroCuenta} - {cuenta.tipo} - {cuenta.moneda} - {cuenta.propietario?.name || 'Usuario'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <AttachMoneyIcon />
                                    Monto
                                </label>
                                <input
                                    type="number"
                                    name="monto"
                                    value={formData.monto}
                                    onChange={handleInputChange}
                                    min="0.01"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <CurrencyExchangeIcon />
                                    Moneda
                                </label>
                                <select
                                    name="moneda"
                                    value={formData.moneda}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="GTQ">GTQ</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <DescriptionIcon />
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción del depósito"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || isLoading || loadingCuentas}
                                    className="flex-1 py-3 text-white bg-blue-600 rounded-lg disabled:bg-blue-400 hover:bg-blue-700 transition-colors font-medium"
                                >
                                    {loading || isLoading || loadingCuentas ? 'Cargando...' : (editingDeposit ? 'Actualizar Depósito' : 'Crear Depósito')}
                                </button>
                                
                                {editingDeposit && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
                                    Total: {deposits?.length || 0} depósitos
                                </p>
                            </div>

                            <div className="p-6">
                                {!deposits || deposits.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                                            {!deposits ? 'Cargando depósitos...' : 'No hay depósitos registrados'}
                                        </h3>
                                        <p className="mt-1 text-gray-500">
                                            {!deposits ? 'Por favor espera...' : 'Comienza creando el primer depósito'}
                                        </p>
                                        <button
                                            onClick={handleRefresh}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            🔄 Intentar cargar nuevamente
                                        </button>
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