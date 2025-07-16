import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import { useState, useEffect } from 'react';
import { useClienteDashboard } from '../../shared/hooks/useClienteDashboard';
import CountUp from 'react-countup';

const ClientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ultimaTransaccion, saldoTotal, misOrdenes, misPuntos, handleUltimaTransaccion, handleSaldoTotal, handleMisOrdenes, handleMisPuntos } = useClienteDashboard();

  useEffect(() => {
    const fetchData = async () => {
      await handleUltimaTransaccion();
      await handleSaldoTotal();
      await handleMisPuntos();
      await handleMisOrdenes();
    }
    fetchData();
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="pt-20 px-4 md:ml-64 transition-all duration-300">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Bienvenido a  Banco InnovaQ</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Saldo Actual',
                value: `Q ${saldoTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                icon: '💰',
                color: 'bg-indigo-600'
              },
              {
                title: 'Última Transacción',
                value: `${ultimaTransaccion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                icon: '🛒',
                color: 'bg-teal-600'
              }
            ].map((card, index) => (
              <div
                key={index}
                className={`${card.color} text-white p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">{card.title}</p>
                    <p className="text-2xl font-bold mt-2">{card.value}</p>
                  </div>
                  <span className="text-4xl animate-bounce">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg animate-fade-in overflow-hidden relative">
            {/* Efecto de brillo */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white rounded-full opacity-20 blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-2 text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-yellow-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Mis Puntos
              </h2>

              <div className="flex items-end">
                <div className="text-4xl font-bold text-white mr-2 min-w-[80px] text-right">
                  <CountUp
                    end={misPuntos?.puntos || 0}
                    duration={2.5}
                    separator=","
                  />
                </div>
                <span className="text-blue-100 mb-1">puntos</span>
              </div>

              <div className="mt-4 flex items-center">
                <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, (misPuntos?.puntos || 0) / 10)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-blue-100">
                  {Math.min(100, (misPuntos?.puntos || 0) / 10)}% de tu meta
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mis Órdenes</h2>
              <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                Total: {misOrdenes?.totalOrdenes} órdenes
              </div>
            </div>

            <div className="space-y-4">
              {misOrdenes?.ordenes?.map((orden) => (
                <div key={orden._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Encabezado de la orden */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${orden.metodoPago === 'Efectivo' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                          {orden.metodoPago === 'Efectivo' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Método de pago</p>
                          <p className="font-medium">{orden.metodoPago}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500">Total</p>
                        <p className="text-xl font-bold text-indigo-600">
                          {orden.moneda} {orden.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la orden */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Puntos Ganados</p>
                        <p className="font-medium text-green-600">+{orden.puntosGanados}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Puntos Usados</p>
                        <p className="font-medium text-amber-600">-{orden.puntosUsados}</p>
                      </div>
                    </div>

                    {/* Ítems de la orden */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Productos</h3>
                      <div className="space-y-3">
                        {orden.items?.map((item, index) => (
                          <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="mb-2 md:mb-0">
                              <p className="font-medium">{item.nombre}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.tipo}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Cantidad</p>
                                <p>{item.cantidad}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">P. Unitario</p>
                                <p>{orden.moneda} {item.precioUnitario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="font-medium">{orden.moneda} {item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;