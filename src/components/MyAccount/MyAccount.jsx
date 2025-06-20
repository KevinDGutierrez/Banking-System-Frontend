import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { useMyAccountEdit } from '../../shared/hooks/useMyAccount.jsx';
import { validarCamposObligatorios } from '../../shared/validations/validationsAuth.jsx';
const MyAccount = () => {
    const { myAccountEdit, handleMyAccountEdit } = useMyAccountEdit();
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        direccion: "",
        celular: "",
        NameTrabajo: "",
        ingresos: "",
        passwordActual: "",
        nuevaPassword: "",
    })

    useEffect(() => {
        if (myAccountEdit) {
            setFormData({
                name: myAccountEdit.name || "",
                direccion: myAccountEdit.direccion || "",
                celular: myAccountEdit.celular || "",
                NameTrabajo: myAccountEdit.NameTrabajo || "",
                ingresos: myAccountEdit.ingresos || "",
                passwordActual: "",
                nuevaPassword: "",
            })
        }
    }, [myAccountEdit])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            validarCamposObligatorios(formData)

            const updatedData = {
                name: formData.name,
                direccion: formData.direccion,
                celular: formData.celular,
                NameTrabajo: formData.NameTrabajo,
                ingresos: formData.ingresos,
                passwordActual: formData.passwordActual,
                nuevaPassword: formData.nuevaPassword,
            }
            await handleMyAccountEdit(updatedData)
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-800">
                            <span className="inline-flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Mi cuenta
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Formulario para editar mi cuenta */}
                <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                        <h2 className="text-2xl font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Editar mi cuenta
                        </h2>
                        <p className="text-blue-100 mt-1">Completa los datos para editar tu cuenta</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Direccion
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Celular
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Trabajo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="NameTrabajo"
                                    value={formData.NameTrabajo}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Ingresos
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="ingresos"
                                    value={formData.ingresos}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    required
                                />
                            </div>
                        </div>
                        {showPasswordForm && (
                            <div className="space-y-4 mt-4 border-t pt-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                                    <input
                                        type="password"
                                        name="passwordActual"
                                        value={formData.passwordActual}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                                    <input
                                        type="password"
                                        name="nuevaPassword"
                                        value={formData.nuevaPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Editar cuenta
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPasswordForm((prev) => !prev)}
                            className="text-sm text-blue-600 hover:underline mt-4"
                        >
                            {showPasswordForm ? "Ocultar cambio de contraseña" : "Cambiar contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default MyAccount;
