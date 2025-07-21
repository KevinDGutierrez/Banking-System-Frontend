import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import dollar from '../../../public/dollar.svg';
import euro from '../../../public/euro.svg';
import quetzal from '../../../public/quetzal.svg';
import { useState, useEffect } from 'react';
import { useAdminDashboard } from '../../shared/hooks/useAdminDashboard';


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clienteNumber, handleClienteNumber, cuentasActivas, handleCuentasActivas, transaccionesHoy, handleTransaccionesHoy, ingresos, handleIngresos, ingresosByPromedio, handleIngresosByPromedio, transfersByMoneda, handleTransfersByMoneda } = useAdminDashboard();

  useEffect(() => {
    const fetchData = async () => {
      await handleClienteNumber();
      await handleCuentasActivas();
      await handleTransaccionesHoy();
      await handleIngresos();
      await handleIngresosByPromedio();
      await handleTransfersByMoneda();
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Total Clientes', value: `${clienteNumber}`, change: '', icon: '👥', color: 'bg-blue-500' },
              { title: 'Cuentas Activas', value: `${cuentasActivas}`, change: '', icon: '💳', color: 'bg-green-500' },
              { title: 'Transferencias', value: `${transaccionesHoy}`, change: '', icon: '🔄', color: 'bg-purple-500' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm mt-2">{stat.change}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 text-center">Transferencias por Moneda</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {transfersByMoneda.map((transfer, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-white shadow-inner flex items-center justify-center">
                      {transfer.moneda === 'USD' && (
                        <img src={dollar} alt="Dólar" className="w-12 h-12 object-contain" />
                      )}
                      {transfer.moneda === 'EUR' && (
                        <img src={euro} alt="Euro" className="w-12 h-12 object-contain" />
                      )}
                      {transfer.moneda === 'GTQ' && (
                        <img src={quetzal} alt="Quetzal" className="w-12 h-12 object-contain" />
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {transfer.monto.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1">{transfer.moneda}</p>

                      <div className="mt-4 px-4 py-2 bg-white rounded-lg shadow-xs inline-block">
                        <span className="text-sm font-medium text-gray-700">
                          {transfer.moneda === 'USD' && 'Dólares Estadounidenses'}
                          {transfer.moneda === 'EUR' && 'Euros'}
                          {transfer.moneda === 'GTQ' && 'Quetzales Guatemaltecos'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Promedio de Ingresos de los Clientes</h2>
            <div className="flex flex-col items-center">
              <div className="relative mx-auto">
                <div className="relative border-8 border-gray-900 rounded-[2rem] h-[220px] w-[200px] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
                  <div className="h-[40px] w-[6px] bg-gray-900 absolute -right-[14px] top-[60px] rounded-r-lg"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="relative w-32 h-32 mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{ingresosByPromedio}</span>
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium text-center mt-2">
                      Incremento respecto a los ultimos 7 días
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Meta: 85%</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Mes anterior: {ingresosByPromedio - 1000}</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;