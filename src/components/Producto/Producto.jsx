import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { useProductos } from "../../shared/hooks/useProductos";
import { Calendar, Package, DollarSign, Boxes, PlusCircle } from "lucide-react";

const ProductosComponent = () => {
    const { productos, loading, handleGetProductos, handlePostProducto } = useProductos();

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        moneda: 'GTQ',
        existencias: '',
        puntos: ''
    });

    useEffect(() => {
        handleGetProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            precio: parseFloat(formData.precio),
            existencias: parseInt(formData.existencias),
            puntos: parseInt(formData.puntos)
        };
        await handlePostProducto(data, true);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            moneda: 'GTQ',
            existencias: '',
            puntos: ''
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container py-5">
                <div className="card shadow mb-5">
                    <div className="card-header bg-primary text-white d-flex align-items-center">
                        <PlusCircle className="me-2" size={20} />
                        <h5 className="mb-0">Agregar Nuevo Producto</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    placeholder="Nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="descripcion"
                                    className="form-control"
                                    placeholder="Descripción"
                                    required
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    name="precio"
                                    className="form-control"
                                    placeholder="Precio"
                                    required
                                    value={formData.precio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    name="moneda"
                                    className="form-select"
                                    value={formData.moneda}
                                    onChange={handleChange}
                                >
                                    <option value="GTQ">GTQ</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="existencias"
                                    className="form-control"
                                    placeholder="Existencias"
                                    required
                                    value={formData.existencias}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="puntos"
                                    className="form-control"
                                    placeholder="Puntos"
                                    required
                                    value={formData.puntos}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 text-end">
                                <button type="submit" className="btn btn-success px-4">Agregar</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row g-4">
                    {productos.length === 0 ? (
                        <p className="text-center text-muted">No hay productos disponibles!</p>
                    ) : (
                        productos.map((producto) => (
                            <div className="col-md-6 col-lg-4" key={producto._id || producto.id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-3">
                                            <h5 className="card-title text-primary text-capitalize">{producto.nombre}</h5>
                                            <p className="card-text text-muted">{producto.descripcion}</p>
                                        </div>

                                        <ul className="list-unstyled flex-grow-1">
                                            <li className="d-flex align-items-center mb-2 text-yellow-700">
                                                <Boxes className="me-2 text-warning" size={18} />
                                                <strong>Existencias:</strong> {producto.existencias}
                                            </li>
                                            <li className="d-flex align-items-center mb-2 text-success">
                                                <DollarSign className="me-2" size={18} />
                                                <strong>Precio Original:</strong> {producto.precioOriginal.valor} {producto.precioOriginal.moneda}
                                            </li>

                                            {producto.preciosConvertidos && (
                                                <>
                                                    <li className="d-flex align-items-center mb-1">
                                                        <DollarSign className="me-2 text-blue-500" size={16} />
                                                        <strong>GTQ:</strong> {producto.preciosConvertidos.GTQ}
                                                    </li>
                                                    <li className="d-flex align-items-center mb-1">
                                                        <DollarSign className="me-2 text-green-500" size={16} />
                                                        <strong>USD:</strong> {producto.preciosConvertidos.USD}
                                                    </li>
                                                    <li className="d-flex align-items-center mb-3">
                                                        <DollarSign className="me-2 text-indigo-500" size={16} />
                                                        <strong>EUR:</strong> {producto.preciosConvertidos.EUR}
                                                    </li>
                                                </>
                                            )}

                                            <li className="d-flex align-items-center mb-2 text-blue-700">
                                                <Package className="me-2 text-primary" size={18} />
                                                <strong>Puntos:</strong> {producto.puntos}
                                            </li>

                                            <li className="d-flex align-items-center text-muted text-sm">
                                                <Calendar className="me-2" size={16} />
                                                Agregado: {new Date(producto.createdAt).toLocaleDateString()}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProductosComponent;