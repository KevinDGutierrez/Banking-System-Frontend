import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';
import {logout as logoutHandler} from '../../shared/hooks/useLogout';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#1f2937',
      color: '#fff'
    }).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      logoutHandler();
      navigate('/');
    });
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <a href='/dashboard' className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {user?.role === 'ADMIN' ? 'Panel de Administración' : 'Mi Banco Digital'}
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-red-600 transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 group-hover:text-white" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;