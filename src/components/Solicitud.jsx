import { useState } from "react";
import { useLogin } from "../shared/hooks/useLogin";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FiMail, FiLock, FiCode, FiArrowLeft } from "react-icons/fi";

const Solicitud = () => {
  const { handleRecuperacion, handleResetPassword } = useLogin();
  const [email, setEmail] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleRecuperacion({ correo: email });
      setShowCodeModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setIsLoading(true);
    try {
      await handleResetPassword({
        codigoGenerado: codigoGenerado,
        password: newPassword
      });
      setShowCodeModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {!showCodeModal ? (
            <div className="p-8">
              <a
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
              >
                <FiArrowLeft className="mr-1" />
                Volver atrás
              </a>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Recuperar contraseña
                </h2>
                <p className="text-gray-600">
                  Ingresa tu correo electrónico para recibir un código de verificación
                </p>
              </div>

              <form onSubmit={handleSubmitEmail} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMail className="inline mr-2" />
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="tu@correo.com"
                      />
                      <FiMail className="absolute left-3 top-5.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FiMail className="mr-2" />
                      Enviar código
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <button
                onClick={() => setShowCodeModal(false)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
              >
                <FiArrowLeft className="mr-1" />
                Volver atrás
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Restablecer contraseña
                </h2>
                <p className="text-gray-600">
                  Hemos enviado un código de 6 dígitos a tu correo electrónico
                </p>
              </div>

              <form onSubmit={handleSubmitReset} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="codigoGenerado" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiCode className="inline mr-2" />
                      Código de verificación
                    </label>
                    <div className="relative">
                      <input
                        id="codigoGenerado"
                        name="code"
                        type="text"
                        required
                        value={codigoGenerado}
                        onChange={(e) => setCodigoGenerado(e.target.value)}
                        className="block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        maxLength="6"
                      />
                      <FiCode className="absolute left-3 top-4.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiLock className="inline mr-2" />
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiLock className="inline mr-2" />
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <FiLock className="mr-2" />
                        Actualizar contraseña
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solicitud;