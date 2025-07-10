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
import DateRangeIcon from '@mui/icons-material/DateRange'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'

const DepositUser = () => {
    const { 
        deposits,
        loading,
        handleGetDeposits,
        handleGetDepositsByAccount
    } = useDeposit()
    
    const { accountBanking, handleGetAccountBanking, loading: loadingCuentas } = useAccountBanking()
    const [isLoading, setIsLoading] = useState(true)
    const [filteredDeposits, setFilteredDeposits] = useState([])
    const [selectedAccount, setSelectedAccount] = useState('')
    const [selectedMoneda, setSelectedMoneda] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Obtener usuario del JWT
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 Cargando datos del usuario...', {
                    userId: user?.uid,
                    userRole: user?.role
                })
                
                // Cargar datos en paralelo
                const results = await Promise.all([
                    handleGetAccountBanking(),
                    handleGetDeposits()
                ])
                
                console.log('✅ Datos cargados:', {
                    accountBanking: results[0],
                    deposits: results[1],
                    user: user
                })
                
            } catch (error) {
                console.error('❌ Error al cargar datos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchData()
    }, [])

    // Filtrar cuentas del usuario actual basándose en el JWT
    const userAccounts = accountBanking?.filter(cuenta => {
        // Comparar con diferentes posibles estructuras del propietario
        const propietarioId = cuenta.propietario?.uid || 
                             cuenta.propietario?._id || 
                             cuenta.propietario
        
        console.log('🔍 Comparando cuenta:', {
            numeroCuenta: cuenta.numeroCuenta,
            propietarioId: propietarioId,
            userId: user?.uid,
            match: propietarioId === user?.uid
        })
        
        return propietarioId === user?.uid
    }) || []

    console.log('👤 Cuentas del usuario:', {
        totalCuentas: accountBanking?.length || 0,
        cuentasDelUsuario: userAccounts.length,
        userId: user?.uid,
        userAccounts: userAccounts.map(c => ({
            numero: c.numeroCuenta,
            propietario: c.propietario
        }))
    })

    // Filtrar depósitos del usuario actual basándose en sus cuentas
    useEffect(() => {
        if (deposits && userAccounts.length > 0) {
            const userAccountNumbers = userAccounts.map(account => account.numeroCuenta)
            
            const userDeposits = deposits.filter(deposit => {
                // Verificar diferentes estructuras posibles de la cuenta en el depósito
                const depositAccountNumber = deposit.cuenta?.numeroCuenta || 
                                           deposit.cuenta || 
                                           deposit.numeroCuenta
                
                const isUserDeposit = userAccountNumbers.includes(depositAccountNumber)
                
                console.log('💰 Verificando depósito:', {
                    depositId: deposit._id,
                    depositAccountNumber: depositAccountNumber,
                    userAccountNumbers: userAccountNumbers,
                    isUserDeposit: isUserDeposit
                })
                
                return isUserDeposit
            })
            
            console.log('🔍 Depósitos filtrados del usuario:', {
                totalDeposits: deposits.length,
                userDeposits: userDeposits.length,
                cuentasUsuario: userAccountNumbers,
                depositosUsuario: userDeposits.map(d => ({
                    id: d._id,
                    monto: d.monto,
                    cuenta: d.cuenta?.numeroCuenta || d.cuenta
                }))
            })
            
            setFilteredDeposits(userDeposits)
        } else {
            console.log('⚠️ No hay depósitos o cuentas disponibles:', {
                depositsLength: deposits?.length || 0,
                userAccountsLength: userAccounts.length
            })
            setFilteredDeposits([])
        }
    }, [deposits, userAccounts])

    // Aplicar filtros adicionales
    const applyFilters = () => {
        let filtered = filteredDeposits

        // Filtrar por cuenta seleccionada
        if (selectedAccount) {
            filtered = filtered.filter(deposit => 
                deposit.cuenta?.numeroCuenta === selectedAccount
            )
        }

        // Filtrar por moneda
        if (selectedMoneda) {
            filtered = filtered.filter(deposit => 
                deposit.moneda === selectedMoneda
            )
        }

        // Filtrar por búsqueda en descripción
        if (searchTerm) {
            filtered = filtered.filter(deposit => 
                deposit.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        return filtered
    }

    const depositsToShow = applyFilters()

    const handleRefresh = async () => {
        console.log('🔄 Refrescando datos...')
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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTotalByMoneda = (moneda) => {
        return depositsToShow
            .filter(deposit => deposit.moneda === moneda)
            .reduce((total, deposit) => total + deposit.monto, 0)
    }

    const uniqueMonedas = [...new Set(filteredDeposits.map(deposit => deposit.moneda))]

    if (isLoading || loading || loadingCuentas) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600">Cargando tus depósitos...</p>
            </div>
        )
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <VisibilityIcon className="text-blue-600" fontSize="large" />
                                    Mis Depósitos
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Visualiza todos los depósitos realizados a tus cuentas
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Total de depósitos</p>
                                    <p className="text-2xl font-bold text-blue-600">{filteredDeposits.length}</p>
                                </div>
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

                    {/* Información del usuario */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <PersonIcon className="text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {user?.name || 'Usuario'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {user?.correo || 'correo@ejemplo.com'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Cuentas propias:</span>
                                <span className="ml-2 font-semibold text-gray-800">
                                    {userAccounts.length}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Total depósitos:</span>
                                <span className="ml-2 font-semibold text-gray-800">
                                    {filteredDeposits.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mis cuentas */}
                    {userAccounts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <AccountBalanceIcon className="text-blue-600" />
                                Mis Cuentas Bancarias
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userAccounts.map((cuenta) => (
                                    <div key={cuenta.numeroCuenta} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    {cuenta.numeroCuenta}
                                                </div>
                                                <div className="text-sm text-gray-600 capitalize">
                                                    {cuenta.tipo} - {cuenta.moneda}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {cuenta.entidadBancaria?.name || 'Banco no especificado'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-gray-800">
                                                    {cuenta.saldo?.toLocaleString('es-GT', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {cuenta.moneda}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                cuenta.estado === 'activa' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {cuenta.estado}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Resumen por moneda */}
                    {uniqueMonedas.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {uniqueMonedas.map(moneda => (
                                <div key={moneda} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getIconByMoneda(moneda)}
                                            <span className="text-lg font-semibold text-gray-700">{moneda}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {getTotalByMoneda(moneda).toLocaleString('es-GT', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-500">Total depositado</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <FilterListIcon className="text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cuenta
                                </label>
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todas las cuentas</option>
                                    {userAccounts.map((cuenta) => (
                                        <option key={cuenta.numeroCuenta} value={cuenta.numeroCuenta}>
                                            {cuenta.numeroCuenta} - {cuenta.tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Moneda
                                </label>
                                <select
                                    value={selectedMoneda}
                                    onChange={(e) => setSelectedMoneda(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todas las monedas</option>
                                    {uniqueMonedas.map(moneda => (
                                        <option key={moneda} value={moneda}>{moneda}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar en descripción
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lista de depósitos */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ListAltIcon />
                                Historial de Depósitos
                            </h2>
                            <p className="text-blue-100 mt-1 flex items-center gap-1">
                                <PersonIcon />
                                Mostrando: {depositsToShow.length} de {filteredDeposits.length} depósitos
                            </p>
                        </div>

                        <div className="p-6">
                            {depositsToShow.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        {filteredDeposits.length === 0 ? 'No tienes depósitos registrados' : 'No hay depósitos que coincidan con los filtros'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {filteredDeposits.length === 0 
                                            ? userAccounts.length === 0 
                                                ? 'Primero necesitas tener cuentas bancarias registradas'
                                                : 'Cuando se realicen depósitos a tus cuentas, aparecerán aquí'
                                            : 'Intenta modificar los filtros para ver más resultados'
                                        }
                                    </p>
                                    {userAccounts.length === 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left">
                                            <h4 className="font-medium text-blue-900 mb-2">
                                                💡 Para ver tus depósitos necesitas:
                                            </h4>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• Tener cuentas bancarias registradas a tu nombre</li>
                                                <li>• Que se realicen depósitos a esas cuentas</li>
                                                <li>• El sistema vinculará automáticamente los depósitos</li>
                                            </ul>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleRefresh}
                                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        🔄 Actualizar datos
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {depositsToShow.map((deposit) => (
                                        <div
                                            key={deposit._id}
                                            className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition duration-200 hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    {getIconByMoneda(deposit.moneda)}
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-xl">
                                                            {deposit.monto.toLocaleString('es-GT', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })} {deposit.moneda}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <DateRangeIcon className="h-4 w-4" />
                                                            {formatDate(deposit.fechaCreacion || deposit.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                                    <DescriptionIcon className="h-4 w-4" />
                                                    <span>Descripción:</span>
                                                </div>
                                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    {deposit.descripcion}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                                                        <AccountBalanceIcon className="h-4 w-4" />
                                                        Cuenta destino
                                                    </span>
                                                    <span className="text-gray-700 font-medium">
                                                        {deposit.cuenta?.numeroCuenta || 'No especificada'}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-semibold text-gray-500">
                                                        Tipo de cuenta
                                                    </span>
                                                    <div className="text-gray-700 font-medium capitalize">
                                                        {deposit.cuenta?.tipo || 'No especificado'}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <span className="text-sm font-semibold text-gray-500">
                                                        Banco
                                                    </span>
                                                    <div className="text-gray-700 font-medium">
                                                        {deposit.cuenta?.entidadBancaria?.name || 'No especificado'}
                                                    </div>
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

export default DepositUser