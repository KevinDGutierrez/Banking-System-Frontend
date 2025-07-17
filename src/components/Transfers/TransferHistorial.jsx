import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Swal from 'sweetalert2';
import { getTransfers, getInterbankTransfers } from '../../services/api'; 
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TransferHistorial = () => {
  const navigate = useNavigate();
  const [userTransfers, setUserTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error al decodificar el token JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserAndTransfers = async () => {
      setLoading(true);
      setError(null);
      let userId = null;

      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.token) {
            const decodedToken = decodeJwt(user.token);
            if (decodedToken && decodedToken.uid) {
              userId = decodedToken.uid;
              setCurrentUserId(userId);
              console.log("DEBUG: ID de usuario logueado (frontend):", userId); 
            } else {
              console.warn('Token JWT no contiene UID o no pudo ser decodificado.');
              Swal.fire('Error', 'No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.', 'error');
              navigate('/login');
              return;
            }
          }
        } else {
          Swal.fire('Error', 'No hay usuario logueado. Por favor, inicia sesión.', 'error');
          navigate('/login');
          return;
        }

        const [internalResponse, interbankResponse] = await Promise.all([
          getTransfers(),
          getInterbankTransfers()
        ]);

        console.log("DEBUG: Respuesta de transferencias internas (raw):", internalResponse.data); 
        console.log("DEBUG: Respuesta de transferencias interbancarias (raw):", interbankResponse.data); 

        const allInternalTransfers = internalResponse.data.transferencias || [];
        const allInterbankTransfers = interbankResponse.data.transferencias || [];

        console.log("DEBUG: Todas las transferencias internas obtenidas:", allInternalTransfers); 
        console.log("DEBUG: Todas las transferencias interbancarias obtenidas:", allInterbankTransfers); 

        const filteredInternalTransfersByUser = allInternalTransfers
          .filter(transfer => {
            const emisorId = transfer.emisor?.uid || transfer.emisor?._id; 
            const receptorId = transfer.receptor?.uid || transfer.receptor?._id; 
            
            const isEmisor = emisorId && emisorId.toString() === userId;
            const isReceptor = receptorId && receptorId.toString() === userId;
            
            console.log(`DEBUG: Internal Transfer ${transfer._id} - Emisor ID: ${emisorId?.toString()}, Receptor ID: ${receptorId?.toString()}, User ID: ${userId}. Match: ${isEmisor || isReceptor}`);
            return isEmisor || isReceptor;
          })
          .map(transfer => ({ ...transfer, type: 'internal' }));

        const filteredInterbankTransfersByUser = allInterbankTransfers
          .filter(transfer => {
            const emisorId = transfer.emisor?.uid || transfer.emisor?._id; 
            
            const isEmisor = emisorId && emisorId.toString() === userId;
            console.log(`DEBUG: Interbank Transfer ${transfer._id} - Emisor ID: ${emisorId?.toString()}, User ID: ${userId}. Match: ${isEmisor}`);
            return isEmisor;
          })
          .map(transfer => ({ ...transfer, type: 'interbank' }));
        
        console.log("DEBUG: Transferencias internas filtradas por usuario:", filteredInternalTransfersByUser); 
        console.log("DEBUG: Transferencias interbancarias filtradas por usuario:", filteredInterbankTransfersByUser); 
        let combinedAndFilteredTransfers = [...filteredInternalTransfersByUser, ...filteredInterbankTransfersByUser];
        
        if (filterType !== 'all') {
            combinedAndFilteredTransfers = combinedAndFilteredTransfers.filter(transfer => transfer.type === filterType);
        }

        if (filterDirection !== 'all') {
            combinedAndFilteredTransfers = combinedAndFilteredTransfers.filter(transfer => {
                const isEmisor = (transfer.emisor?.uid?.toString() === userId) || (transfer.emisor?._id?.toString() === userId);
                
                if (filterDirection === 'sent') {
                    return isEmisor;
                } else { 
                    const isReceptor = (transfer.receptor?.uid?.toString() === userId) || (transfer.receptor?._id?.toString() === userId);
                    return transfer.type === 'internal' && isReceptor;
                }
            });
        }

        combinedAndFilteredTransfers.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        console.log("DEBUG: Transferencias combinadas, filtradas y ordenadas (final):", combinedAndFilteredTransfers); 
        setUserTransfers(combinedAndFilteredTransfers);

      } catch (err) {
        console.error('Error al cargar las transferencias:', err);
        setError('No se pudieron cargar las transferencias. Inténtalo de nuevo más tarde.');
        Swal.fire('Error', 'No se pudieron cargar las transferencias. Inténtalo de nuevo más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTransfers();
  }, [navigate, filterType, filterDirection]);

  const handleGoBack = () => {
    navigate('/transfers'); 
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl border border-gray-200 p-6 text-center">
            <p className="text-lg font-semibold text-gray-700">Cargando historial de transferencias...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl border border-gray-200 p-6 text-center">
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button
              onClick={handleGoBack}
              className="mt-4 flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <ArrowBackIcon /> Regresar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl border border-gray-200">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-xl text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <HistoryIcon fontSize="large" />
              <h1 className="text-2xl font-bold">Mis Transferencias</h1>
            </div>
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              <ArrowBackIcon /> Regresar
            </button>
          </div>

          <div className="p-6">
            {/* Controles de Filtro */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
              {/* Filtro por Tipo de Transferencia */}
              <div className="flex flex-col items-center">
                <label className="text-gray-700 text-sm font-semibold mb-1">Tipo de Transferencia</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterType === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilterType('internal')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterType === 'internal' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Internas
                  </button>
                  <button
                    onClick={() => setFilterType('interbank')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterType === 'interbank' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Interbancarias
                  </button>
                </div>
              </div>

              {/* Filtro por Dirección de Transferencia */}
              <div className="flex flex-col items-center">
                <label className="text-gray-700 text-sm font-semibold mb-1">Dirección</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterDirection('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterDirection === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilterDirection('sent')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterDirection === 'sent' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Enviadas
                  </button>
                  <button
                    onClick={() => setFilterDirection('received')}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${filterDirection === 'received' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Recibidas
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Transferencias */}
            <div className="space-y-4">
              {userTransfers.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <p className="text-lg">No tienes transferencias registradas con los filtros actuales.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    (Este historial muestra tanto transferencias internas como interbancarias donde eres el emisor o receptor.)
                  </p>
                </div>
              ) : (
                userTransfers.map((transfer) => {
                  // Precalcular valores para simplificar el JSX
                  const isEmisor = (transfer.emisor?.uid?.toString() === currentUserId) || (transfer.emisor?.toString() === currentUserId); 
                  
                  const displayReference = transfer.referencia || transfer._id || 'N/A';
                  const displayAmount = `${transfer.moneda} ${transfer.monto?.toFixed(2)}`;
                  const displayDate = `${new Date(transfer.createdAt).toLocaleDateString()} ${new Date(transfer.createdAt).toLocaleTimeString()}`;
                  
                  let displayTypeLabel;
                  let displayIconColor;
                  let displayAccountInfo;
                  let accountDirectionLabel;

                  if (transfer.type === 'internal') {
                    const isReceptor = (transfer.receptor?.uid?.toString() === currentUserId) || (transfer.receptor?.toString() === currentUserId);

                    displayTypeLabel = isEmisor ? 'Enviada (Interna)' : 'Recibida (Interna)';
                    displayIconColor = isEmisor ? "text-red-500" : "text-green-500";
                    accountDirectionLabel = isEmisor ? 'A:' : 'De:';
                    displayAccountInfo = isEmisor 
                      ? (transfer.receptor?.username || transfer.aliasReceptor || 'Desconocido') 
                      : (transfer.emisor?.username || 'Desconocido');
                    
                  } else if (transfer.type === 'interbank') {
                    displayTypeLabel = 'Enviada (Interbancaria)'; 
                    displayIconColor = "text-red-500";
                    accountDirectionLabel = 'A:';
                    displayAccountInfo = `${transfer.aliasReceptor || 'Desconocido'} (${transfer.bancoReceptor?.name || 'Banco Desconocido'})`;
                  }

                  return (
                    <div key={transfer._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                        <p className="flex items-center gap-2">
                          <SwapHorizIcon fontSize="small" className="text-blue-500" />
                          <strong>Referencia:</strong> {displayReference}
                        </p>
                        <p className="flex items-center gap-2">
                          <AttachMoneyIcon fontSize="small" className="text-green-500" />
                          <strong>Monto:</strong> {displayAmount}
                        </p>
                        <p className="flex items-center gap-2">
                          <AccountBalanceIcon fontSize="small" className="text-purple-500" />
                          <strong>Fecha:</strong> {displayDate}
                        </p>
                        <p className="flex items-center gap-2">
                          <PersonIcon fontSize="small" className={displayIconColor} />
                          <strong>Tipo:</strong> {displayTypeLabel}
                        </p>
                        <p className="flex items-center gap-2 col-span-full">
                          <AccountBalanceIcon fontSize="small" className="text-gray-500" />
                          <strong>{accountDirectionLabel}</strong> {displayAccountInfo}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransferHistorial;