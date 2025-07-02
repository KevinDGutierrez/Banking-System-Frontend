import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { PlusCircle, Trash, DollarSign, Package, Calendar } from "lucide-react";
import { useOrdenes } from "../../shared/hooks/useOrdenes";

const OrdenComponent = () => {
    const { handlePostOrden, handleGetProductos, handleGetServices, handleGetOrdenesProductos, productos, services, ordenes, loading } = useOrdenes();

    const [formData, setFormData] = useState({
        moneda: "GTQ",
        metodoPago: "dinero",
        items: [{ tipo: "producto", nombre: "", cantidad: 1 }]
    });

    useEffect(() => {
        handleGetProductos();
        handleGetServices();
        handleGetOrdenesProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = field === "cantidad" ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, items: updatedItems }));
    }

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { tipo: "producto", nombre: "", cantidad: 1 }]
        }))
    }

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) return;
        const updatedItems = [...formData.items];
        updatedItems.splice(index, 1);
        setFormData(prev => ({ ...prev, items: updatedItems }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tipo = formData.items[0]?.tipo; // Se asume que todos los ítems son del mismo tipo
        await handlePostOrden(formData, tipo);
        setFormData({
            moneda: "GTQ",
            metodoPago: "dinero",
            items: [{ tipo: "producto", nombre: "", cantidad: 1 }]
        });
        handleGetOrdenesProductos();
    }

    return (
        <Layout>
            <div className="container py-5">
                <div className="card shadow mb-5">
                    <div className="card-header bg-primary text-white d-flex align-items-center">
                        <PlusCircle className="me-2" size={20} />
                        <h5 className="mb-0">Crear Nueva Orden</h5>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Moneda</label>
                                <select
                                    name="moneda"
                                    className="form-select"
                                    value={formData.moneda}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="GTQ">GTQ</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Método de Pago</label>
                                <select
                                    name="metodoPago"
                                    className="form-select"
                                    value={formData.metodoPago}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="dinero">Dinero</option>
                                    <option value="puntos">Puntos</option>
                                </select>
                            </div>

                            <div className="col-12 mt-4">
                                <h6 className="fw-bold">Items de la Orden</h6>
                                {formData.items.map((item, index) => (
                                    <div className="row g-2 align-items-end mb-3" key={index}>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={item.tipo}
                                                onChange={e => handleItemChange(index, "tipo", e.target.value)}
                                            >
                                                <option value="producto">Producto</option>
                                                <option value="servicio">Servicio</option>
                                            </select>
                                        </div>

                                        <div className="col-md-5">
                                            <select
                                                className="form-select"
                                                value={item.nombre}
                                                onChange={e => handleItemChange(index, "nombre", e.target.value)}
                                                required
                                            >
                                                <option value="">-- Selecciona {item.tipo} --</option>
                                                {item.tipo === "producto" &&
                                                    productos.map(prod => (
                                                        <option key={prod._id} value={prod.nombre}>
                                                            {prod.nombre}
                                                        </option>
                                                    ))}
                                                {item.tipo === "servicio" &&
                                                    services.map(serv => (
                                                        <option key={serv._id} value={serv.nombre}>
                                                            {serv.nombre}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Cantidad"
                                                min={1}
                                                value={item.cantidad}
                                                onChange={e => handleItemChange(index, "cantidad", e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={formData.items.length === 1}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary mt-2"
                                    onClick={handleAddItem}
                                >
                                    + Agregar Item
                                </button>
                            </div>

                            <div className="col-12 text-end mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-success px-4"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Crear Orden"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <h4 className="mb-4 text-primary fw-bold">Órdenes Registradas</h4>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : ordenes.length === 0 ? (
                    <p className="text-muted text-center">No hay órdenes registradas!</p>
                ) : (
                    <div className="row g-4">
                        {ordenes.map(orden => (
                            <div key={orden._id} className="col-md-6 col-lg-4">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title text-capitalize text-primary">
                                            #{orden._id.slice(-5)}
                                        </h5>

                                        <ul className="list-unstyled">
                                            <li className="mb-2 d-flex align-items-center">
                                                <DollarSign className="me-2 text-success" size={16} />
                                                <span><strong>Moneda:</strong> {orden.moneda}</span>
                                            </li>
                                            <li className="mb-2 d-flex align-items-center">
                                                <Package className="me-2 text-info" size={16} />
                                                <span><strong>Método de pago:</strong> {orden.metodoPago}</span>
                                            </li>
                                            <li className="mb-2 d-flex align-items-center">
                                                <Calendar className="me-2 text-muted" size={16} />
                                                <span><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</span>
                                            </li>
                                        </ul>

                                        <h6 className="mt-3 text-secondary fw-bold">Items:</h6>
                                        <ul className="list-group small">
                                            {orden.items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    <span>{item.nombre}</span>
                                                    <span className="badge bg-primary rounded-pill">x{item.cantidad}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default OrdenComponent;