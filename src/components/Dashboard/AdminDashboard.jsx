import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import { useState } from 'react';

const AdminDashboard = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Total Clientes', value: '1,234', change: '+12%', icon: '👥', color: 'bg-blue-500' },
              { title: 'Cuentas Activas', value: '856', change: '+5%', icon: '💳', color: 'bg-green-500' },
              { title: 'Transacciones Hoy', value: '324', change: '-3%', icon: '🔄', color: 'bg-purple-500' },
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
            <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de actividad aquí</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;