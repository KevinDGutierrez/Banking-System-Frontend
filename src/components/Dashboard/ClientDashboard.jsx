import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import { useState } from 'react';

const ClientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="pt-20 px-4 md:ml-64 transition-all duration-300">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Bienvenido a tu Banco Digital</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Saldo Actual', value: '$12,345.67', icon: '💰', color: 'bg-indigo-600' },
              { title: 'Última Transacción', value: '$450.00', icon: '🛒', color: 'bg-teal-600' },
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

          <div className="mt-8 bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Movimientos Recientes</h2>
            <div className="space-y-4">
              {[
                { id: 1, description: 'Compra en Amazon', amount: '-$120.00', date: 'Hoy', icon: '🛍️' },
                { id: 2, description: 'Depósito de nómina', amount: '+$1,200.00', date: 'Ayer', icon: '💵' },
                { id: 3, description: 'Transferencia a Juan', amount: '-$300.00', date: '15/06', icon: '↗️' },
              ].map(movement => (
                <div 
                  key={movement.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{movement.icon}</span>
                    <div>
                      <p className="font-medium">{movement.description}</p>
                      <p className="text-sm text-gray-500">{movement.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${movement.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.amount}
                  </p>
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