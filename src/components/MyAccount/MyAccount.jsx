import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { useMyAccountEdit } from '../../shared/hooks/useMyAccount.jsx';
import { useAccountList } from '../../shared/hooks/useListAccount.jsx';
import { FiEye, FiEyeOff, FiUser, FiHome, FiPhone, FiMail, FiBriefcase, FiDollarSign, FiEdit, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useMyAccountApplication } from '../../shared/hooks/useMyAccountApplication.jsx';
import './MyAccount.css';
const MyAccount = () => {
    const { handleMyAccountEdit, myData } = useMyAccountEdit();
    const { handleMyAccountList, accountList } = useAccountList();
    const { handleMyAccountApplication, myDataAccount } = useMyAccountApplication();

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: myData?.username || "",
        passwordActual: "",
        nuevaPassword: "",
    });

    const [formDataAccount, setFormDataAccount] = useState({
        name: myDataAccount?.name || "",
        direccion: myDataAccount?.direccion || "",
        celular: myDataAccount?.celular || "",
        correo: myDataAccount?.correo || "",
        NameTrabajo: myDataAccount?.NameTrabajo || "",
        ingresos: myDataAccount?.ingresos || ""
    });

    useEffect(() => {
        if (accountList && accountList.username) {
            setFormData(prev => ({
                ...prev,
                username: accountList.username
            }));
        }
    }, [accountList]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeAccount = (e) => {
        const { name, value } = e.target;
        setFormDataAccount(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitAccount = async (e) => {
        e.preventDefault();
        await handleMyAccountApplication(formDataAccount);
        await handleMyAccountList();
        setIsDetailsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleMyAccountEdit(formData);
        await handleMyAccountList();
        setIsEditingPassword(false);
    };

    useEffect(() => {
        handleMyAccountList();
    }, []);

    return (
        <Layout>
            <div className="account-container">
                <h1 className="account-title">Mi Cuenta</h1>

                <div className="account-grid">
                    <div className="account-card info-card">
                        <h2 className="card-title">
                            <FiUser className="icon" /> Información de la cuenta
                        </h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <FiUser className="info-icon" />
                                <div>
                                    <p className="info-label">Nombre</p>
                                    <p className="info-value">{accountList?.name || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiUser className="info-icon" />
                                <div>
                                    <p className="info-label">Username</p>
                                    <p className="info-value">{accountList?.username || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiHome className="info-icon" />
                                <div>
                                    <p className="info-label">Dirección</p>
                                    <p className="info-value">{accountList?.direccion || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiPhone className="info-icon" />
                                <div>
                                    <p className="info-label">Celular</p>
                                    <p className="info-value">{accountList?.celular || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiMail className="info-icon" />
                                <div>
                                    <p className="info-label">Correo</p>
                                    <p className="info-value">{accountList?.correo || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiBriefcase className="info-icon" />
                                <div>
                                    <p className="info-label">Trabajo</p>
                                    <p className="info-value">{accountList?.NameTrabajo || 'No disponible'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <FiDollarSign className="info-icon" />
                                <div>
                                    <p className="info-label">Ingresos</p>
                                    <p className="info-value">{accountList?.ingresos || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="account-card">
                        <div className="form-section">
                            <h2 className="card-title">
                                <FiEdit className="icon" /> Actualizar cuenta
                            </h2>
                            <form onSubmit={handleSubmit} className="account-form">
                                <div className="form-group">
                                    <label htmlFor="username">Nombre de usuario</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username || ""}
                                        onChange={handleChange}
                                        placeholder={accountList?.username || "Username"}
                                        className="form-input"
                                    />
                                </div>

                                {isEditingPassword ? (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="passwordActual">Contraseña actual</label>
                                            <div className="password-input">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="passwordActual"
                                                    name="passwordActual"
                                                    value={formData.passwordActual}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nuevaPassword">Nueva contraseña</label>
                                            <div className="password-input">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="nuevaPassword"
                                                    name="nuevaPassword"
                                                    value={formData.nuevaPassword}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => setIsEditingPassword(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn-primary">
                                                <FiCheck className="mr-2" /> Guardar cambios
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-primary w-full"
                                        onClick={() => setIsEditingPassword(true)}
                                    >
                                        Cambiar contraseña
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="form-section">
                            <button
                                className="accordion-toggle"
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            >
                                <span>Otros datos de la cuenta</span>
                                <FiChevronDown className={`accordion-icon ${isDetailsOpen ? 'open' : ''}`} />
                            </button>

                            {isDetailsOpen && (
                                <form onSubmit={handleSubmitAccount} className="account-form mt-4">
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre completo</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formDataAccount.name || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.name || "Nombre completo"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="direccion">Dirección</label>
                                        <input
                                            type="text"
                                            id="direccion"
                                            name="direccion"
                                            value={formDataAccount.direccion || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.direccion || "Dirección"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="celular">Celular</label>
                                        <input
                                            type="text"
                                            id="celular"
                                            name="celular"
                                            value={formDataAccount.celular || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.celular || "Celular"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="correo">Correo electrónico</label>
                                        <input
                                            type="text"
                                            id="correo"
                                            name="correo"
                                            value={formDataAccount.correo || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.correo || "Correo electrónico"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="NameTrabajo">Trabajo</label>
                                        <input
                                            type="text"
                                            id="NameTrabajo"
                                            name="NameTrabajo"
                                            value={formDataAccount.NameTrabajo || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.NameTrabajo || "Trabajo"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="ingresos">Ingresos</label>
                                        <input
                                            type="text"
                                            id="ingresos"
                                            name="ingresos"
                                            value={formDataAccount.ingresos || ""}
                                            onChange={handleChangeAccount}
                                            placeholder={accountList?.ingresos || "Ingresos"}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn-primary w-full">
                                            <FiCheck className="mr-2" /> Actualizar datos
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default MyAccount;
