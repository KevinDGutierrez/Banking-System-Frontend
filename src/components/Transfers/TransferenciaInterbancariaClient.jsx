import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../layout/Layout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';

import { useInterbankTransfer } from '../../shared/hooks/useInterbankTransfer';
import { useFavorites } from '../../shared/hooks/useFavorites';
import { getAccountUserBanking, getBanking } from '../../services/api'; 

const TransferenciaInterbancariaClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRealizarTransferenciaInterbancaria, loading: apiLoading } = useInterbankTransfer();
  const { handleAddFavorite } = useFavorites();
  const [savingLoading, setSavingLoading] = useState(false);
  const [addingFavorite, setAddingFavorite] = useState(false);

  const initialFormData = {
    cuentaEmisor: '',
    cuentaReceptorExterno: '',
    bancoReceptor: '',
    tipoCuentaReceptor: '',
    aliasReceptor: '',
    monto: '', 
    moneda: 'GTQ',
    tipoTransferencia: 'interbancaria', 
  };

  const [formData, setFormData] = useState(initialFormData);
  const [userAccounts, setUserAccounts] = useState([]);
  const [bankingOptions, setBankingOptions] = useState([]); 
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [fetchingBanks, setFetchingBanks] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showTransferSummary, setShowTransferSummary] = useState(false);
  const [lastTransferDetails, setLastTransferDetails] = useState(null);
  const transferSummaryRef = useRef(null);

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

  const resetFormAndHideSummary = () => {
    setFormData({
      cuentaEmisor: userAccounts.length > 0 ? userAccounts[0].numeroCuenta || userAccounts[0]._id || '' : '',
      cuentaReceptorExterno: '',
      bancoReceptor: '',
      tipoCuentaReceptor: '',
      aliasReceptor: '',
      monto: '',
      moneda: 'GTQ',
      tipoTransferencia: 'interbancaria',
    });
    setLastTransferDetails(null);
    setShowTransferSummary(false);
  };

  useEffect(() => {
    const loadUserDataAndAccounts = async () => {
      setFetchingAccounts(true);
      let user = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          user = JSON.parse(storedUser);
          if (user.token) {
            const decodedToken = decodeJwt(user.token);
            if (decodedToken && decodedToken.uid) {
              user.id = decodedToken.uid;
              console.log('Usuario con ID de token:', user);
            } else {
              console.warn('Token JWT no contiene UID o no pudo ser decodificado.');
              user = null;
              localStorage.removeItem('user');
            }
          }
          setCurrentUser(user);
        }
      } catch (e) {
        console.error("Error al parsear el usuario de localStorage o decodificar token:", e);
        localStorage.removeItem('user');
        user = null;
      }

      if (user && user.id) {
        try {
          const response = await getAccountUserBanking();
          const accounts = response.data.cuentas || response.data;
          console.log('Cuentas cargadas para Emisor:', accounts);
          setUserAccounts(accounts);
          if (accounts.length > 0) {
            setFormData((prev) => ({
              ...prev,
              cuentaEmisor: accounts[0].numeroCuenta || accounts[0]._id || '',
            }));
          }
        } catch (error) {
          console.error('Error al obtener cuentas del usuario:', error);
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'No se pudieron cargar las cuentas del usuario',
            icon: 'error',
          });
        }
      } else {
        console.warn('No hay usuario logueado (o su ID) para cargar cuentas.');
      }
      setFetchingAccounts(false);
    };

    const loadBankingOptions = async () => {
      setFetchingBanks(true);
      try {
        const response = await getBanking();
        const banks = response.data.bancos || response.data; 
        console.log('Bancos cargados:', banks);
        const filteredBanks = banks.filter(bank => bank.name.toLowerCase() !== 'banco innova');
        setBankingOptions(filteredBanks);
      } catch (error) {
        console.error('Error al obtener opciones de bancos:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudieron cargar los bancos disponibles',
          icon: 'error',
        });
      } finally {
        setFetchingBanks(false);
      }
    };

    loadUserDataAndAccounts();
    loadBankingOptions();

    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        cuentaReceptorExterno: location.state.cuentaReceptorExterno || '',
        aliasReceptor: location.state.aliasReceptor || '',
        tipoCuentaReceptor: location.state.tipoCuentaReceptor || '',
        bancoReceptor: location.state.bancoReceptor || '',
      }));
      navigate(location.pathname, { replace: true });
    }

  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoTransferencia') { 
      return; 
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cuentaEmisor, cuentaReceptorExterno, bancoReceptor, tipoCuentaReceptor, aliasReceptor, monto, moneda, tipoTransferencia } = formData;

    if (!cuentaEmisor || !cuentaReceptorExterno || !bancoReceptor || !tipoCuentaReceptor || !aliasReceptor || !monto || !moneda || !tipoTransferencia) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos para la transferencia interbancaria.',
        icon: 'warning',
      });
      return;
    }

    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'El monto debe ser un número válido mayor que cero.',
        icon: 'warning',
      });
      return;
    }
    
    const finalMontoToSend = Number(parsedMonto.toFixed(2));

    const interbankTransferData = {
      ...formData,
      monto: finalMontoToSend, 
    };

    try {
        const responseData = await handleRealizarTransferenciaInterbancaria(interbankTransferData);
        setLastTransferDetails(responseData);
        setShowTransferSummary(true);
    } catch (error) {
        console.error("Error al realizar la transferencia interbancaria en el componente:", error);
    }
  };

  const handleGoBack = () => {
    navigate('/transfers');
  };

  const handleSaveTransferAsPhoto = async () => {
    if (!transferSummaryRef.current) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo capturar el resumen de la transferencia. Inténtalo de nuevo.',
        icon: 'error',
      });
      return;
    }

    setSavingLoading(true);

    try {
        const canvas = await html2canvas(transferSummaryRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const fontElements = clonedDoc.querySelectorAll('font');
                fontElements.forEach(fontEl => {
                    while (fontEl.firstChild) {
                        fontEl.parentNode.insertBefore(fontEl.firstChild, fontEl);
                    }
                    fontEl.parentNode.removeChild(fontEl);
                });

                const elements = clonedDoc.querySelectorAll('*');
                elements.forEach(el => {
                    if (el.style) {
                        el.style.color = '#000000';
                        el.style.backgroundColor = 'transparent';
                        el.style.borderColor = '#000000';

                        el.style.outlineColor = 'rgba(0, 0, 0, 0)';
                        el.style.textDecorationColor = 'rgba(0, 0, 0, 0)';
                        el.style.caretColor = '#000000'; 
                        el.style.accentColor = '#000000';

                        if (el.classList.contains('bg-gradient-to-r')) {
                            el.style.backgroundImage = 'linear-gradient(to right, rgb(0, 128, 128), rgb(0, 139, 139))';
                        }
                    }
                });
            }
        });

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `transferencia_interbancaria_${lastTransferDetails?.referencia || new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            title: 'Guardado',
            text: 'La imagen de la transferencia se ha guardado correctamente.',
            icon: 'success',
            timer: 1500,
        });
    } catch (error) {
        console.error('Error al guardar la imagen:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar la imagen de la transferencia.',
            icon: 'error',
        });
    } finally {
        setSavingLoading(false);
    }
  };

  const handleAddFavoriteClick = async () => {
    setAddingFavorite(true);
    try {
        if (!currentUser || !currentUser.id) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener el ID del usuario para agregar a favoritos. Por favor, intenta iniciar sesión de nuevo.',
                icon: 'error',
            });
            setAddingFavorite(false);
            return;
        }

        const favoriteData = {
            usuario: currentUser.id, 
            cuentaDestino: formData.cuentaReceptorExterno,
            tipoCuenta: formData.tipoCuentaReceptor,
            alias: formData.aliasReceptor,
        };
        await handleAddFavorite(favoriteData);
    } catch (error) {
        console.error("Error al agregar favorito:", error);
    } finally {
        setAddingFavorite(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl border border-gray-200">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-t-xl text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CurrencyExchangeIcon fontSize="large" />
              <h1 className="text-2xl font-bold">{showTransferSummary ? 'Resumen de Transferencia Interbancaria' : 'Transferencia Interbancaria'}</h1>
            </div>
            {/* Botón de Regresar (solo si no estamos en el resumen) */}
            {!showTransferSummary && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1 px-4 py-2 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
              >
                <ArrowBackIcon /> Regresar
              </button>
            )}
          </div>

          {/* Formulario de Transferencia Interbancaria */}
          {!showTransferSummary && (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Cuenta Emisor */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AccountBalanceIcon /> Cuenta Emisor
                </label>
                <select
                  name="cuentaEmisor"
                  value={formData.cuentaEmisor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={apiLoading || fetchingAccounts || userAccounts.length === 0}
                >
                  <option value="">
                    {fetchingAccounts
                      ? 'Cargando cuentas...'
                      : userAccounts.length === 0
                        ? 'No hay cuentas disponibles'
                        : 'Selecciona una cuenta'}
                  </option>
                  {userAccounts.map((account) => (
                    <option
                      key={account._id}
                      value={account.numeroCuenta || account._id}
                    >
                      {account.numeroCuenta} - {account.tipo} ({account.moneda} {account.saldo?.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cuenta Receptor Externo */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AccountCircleIcon /> Cuenta Receptor Externa
                </label>
                <input
                  type="text"
                  name="cuentaReceptorExterno"
                  value={formData.cuentaReceptorExterno}
                  onChange={handleInputChange}
                  placeholder="Número de cuenta receptor (otro banco)"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Banco Receptor (Seleccionable) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AccountBalanceIcon /> Banco Receptor
                </label>
                <select
                  name="bancoReceptor"
                  value={formData.bancoReceptor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={fetchingBanks}
                >
                  <option value="">
                    {fetchingBanks ? 'Cargando bancos...' : 'Selecciona un banco'}
                  </option>
                  {bankingOptions.map((bank) => (
                    <option key={bank._id} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo Cuenta Receptor */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AccountBalanceIcon /> Tipo Cuenta Receptor
                </label>
                <select
                  name="tipoCuentaReceptor"
                  value={formData.tipoCuentaReceptor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="ahorro">ahorro</option>
                  <option value="monetaria">monetaria</option>
                  <option value="empresarial">empresarial</option>
                </select>
              </div>

              {/* Alias Receptor */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <PersonIcon /> Alias Receptor
                </label>
                <input
                  type="text"
                  name="aliasReceptor"
                  value={formData.aliasReceptor}
                  onChange={handleInputChange}
                  placeholder="Alias del receptor"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Monto */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AttachMoneyIcon /> Monto
                </label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="Cantidad a transferir"
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Moneda */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <CurrencyExchangeIcon /> Moneda
                </label>
                <select
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="GTQ">GTQ</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={apiLoading || fetchingAccounts || fetchingBanks || userAccounts.length === 0 || bankingOptions.length === 0}
                className="w-full flex justify-center items-center gap-2 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-teal-300"
              >
                {apiLoading ? 'Procesando...' : 'Realizar Transferencia Interbancaria'}
                <SendIcon />
              </button>
            </form>
          )}

          {/* Resumen de la Transferencia Interbancaria */}
          {showTransferSummary && lastTransferDetails && (
            <div className="p-6 space-y-4 bg-white text-gray-800" ref={transferSummaryRef}>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Detalles de la Transferencia Interbancaria Realizada:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <strong>Referencia:</strong> {lastTransferDetails.referencia}
                </p>
                <p><strong>Fecha:</strong> {new Date(lastTransferDetails.createdAt).toLocaleDateString()} {new Date(lastTransferDetails.createdAt).toLocaleTimeString()}</p>
                <p><strong>Monto:</strong> {lastTransferDetails.moneda} {lastTransferDetails.monto?.toFixed(2)}</p>
                <p><strong>Cuenta Emisora:</strong> {formData.cuentaEmisor}</p>
                <p>
                  <strong>Cuenta Receptora Externa:</strong> {formData.cuentaReceptorExterno}
                </p>
                <p><strong>Tipo Cuenta Receptora:</strong> {lastTransferDetails.tipoCuentaReceptor}</p>
                <p><strong>Alias Receptor:</strong> {formData.aliasReceptor}</p>
                <p><strong>Banco Receptor:</strong> {formData.bancoReceptor}</p> 
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={resetFormAndHideSummary}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto justify-center"
                >
                  <ArrowBackIcon /> Regresar al Formulario
                </button>
                <button
                  onClick={() => navigate('/transfers')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300 w-full sm:w-auto justify-center"
                >
                  <HomeIcon /> Ir al Menú de Transferencias
                </button>
                <button
                  onClick={handleSaveTransferAsPhoto}
                  disabled={savingLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300 transition duration-300 w-full sm:w-auto justify-center"
                >
                  {savingLoading ? 'Guardando...' : 'Guardar como Foto'}
                  <SaveAltIcon />
                </button>
                <button
                  onClick={handleAddFavoriteClick}
                  disabled={addingFavorite}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 disabled:bg-pink-300 transition duration-300 w-full sm:w-auto justify-center"
                >
                  {addingFavorite ? 'Agregando...' : 'Agregar Favorito'}
                  <FavoriteIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransferenciaInterbancariaClient;
