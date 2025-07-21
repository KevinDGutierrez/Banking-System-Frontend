import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, User, Banknote,
  Users, Shield, ChevronLeft, CreditCard, Package, Tags, Star, Repeat, BanknoteArrowDown
} from 'lucide-react';
import { useAccountBanking } from '../../shared/hooks/useDashboard';
import { useBanking } from '../../shared/hooks/useDashboard';
import { useClientesAdmin } from '../../shared/hooks/useDashboard';
import { useAdminAccounts } from '../../shared/hooks/useDashboard';
import { useMyAccount } from '../../shared/hooks/useDashboard';
import { useSolicitarCredito } from '../../shared/hooks/useDashboard';
import { useAprobarCredito } from '../../shared/hooks/useDashboard';
import { userFavorites } from '../../shared/hooks/useDashboard';
import { useProductoAdmin } from '../../shared/hooks/useDashboard';
import { useOrdenCliente } from '../../shared/hooks/useDashboard';
import { useTransferencias } from '../../shared/hooks/useDashboard';
import { useAdminDeposits } from '../../shared/hooks/useDashboard';
import { useAdminTransferencias } from '../../shared/hooks/useDashboard';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { accountBanking, handleAccountBanking } = useAccountBanking();
  const { banking, handleBanking } = useBanking();
  const { clientesAdmin, handleClientesAdmin } = useClientesAdmin();
  const { adminAccounts, handleAdminAccounts } = useAdminAccounts();
  const { solicitudCredito, handleSolicitarCredito } = useSolicitarCredito();
  const { aprobarCredito, handleAprobarCredito } = useAprobarCredito();
  const { adminDeposit, handleAdminDeposits } = useAdminDeposits()
  const { myAccount, handleMyAccount } = useMyAccount();
  const { adminProductos, handleAdminProductos } = useProductoAdmin();
  const { clienteOrdenes, handleClienteOrdenes } = useOrdenCliente();
  const { favoritosClient, handleFavoritesClient } = userFavorites();
  const { transferencias, handleTransferencias } = useTransferencias();
  const { adminTransferencias, handleAdminTransferencias } = useAdminTransferencias();

  const clientSections = [
    { text: 'Cuenta Bancaria', icon: <Wallet className="h-5 w-5" />, action: handleAccountBanking },
    { text: 'Creditos', icon: <CreditCard className="h-5 w-5" />, action: handleSolicitarCredito },
    { text: 'Bancos', icon: <Banknote className="h-5 w-5" />, action: handleBanking },
    { text: 'Mi Cuenta', icon: <Users className="h-5 w-5" />, action: handleMyAccount },
    { text: 'Mis Ordenes', icon: <Tags className="h-5 w-5" />, action: handleClienteOrdenes },
    { text: 'Mis Favoritos', icon: <Star className="h-5 w-5" />, action: handleFavoritesClient },
    { text: 'Transferencias', icon: <Repeat className="h-5 w-5" />, action: handleTransferencias }
  ];



  const adminSections = [
    { text: 'Gestión de Clientes', icon: <Users className="h-5 w-5" />, action: handleClientesAdmin },
    { text: 'Gestión de Cuentas', icon: <Shield className="h-5 w-5" />, action: handleAdminAccounts },
    { text: 'Creditos', icon: <CreditCard className="h-5 w-5" />, action: handleAprobarCredito },
    { text: 'Depositos', icon: <BanknoteArrowDown className="h-5  w-5" />, action: handleAdminDeposits },
    { text: 'Bancos', icon: <Banknote className="h-5 w-5" />, action: handleBanking },
    { text: 'Productos', icon: <Package className="h-5 w-5" />, action: handleAdminProductos },
    { text: 'Transferencias', icon: <Repeat className="h-5 w-5" />, action: handleAdminTransferencias }
  ];

  const sections = user?.role === 'ADMIN' ? adminSections : clientSections;

  return (
    <div className={`fixed inset-y-0 left-0 z-20 bg-gray-800 text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-xl`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Menú</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-700 transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {sections.map((section, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  section.action();
                  toggleSidebar();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-all duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200">
                  {section.icon}
                </span>
                <span>{section.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;