import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { useProductos } from "../../shared/hooks/useProductos";
import { Tooltip, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import { Calendar, Package, DollarSign, Boxes, Copy } from "lucide-react";

const ProductosComponent = () => {
    const { productos, loading, handleGetProductos } = useProductos();

    useEffect(() => {
        handleGetProductos();
    }, [])

    const copiarAlPortapapeles = (nombre) => {
        navigator.clipboard.writeText(nombre).then(() => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "¡Nombre copiado!",
                showConfirmButton: false,
                timer: 1500,
                background: "#4CAF50",
                color: "white",
                customClass: {
                    popup: "animate__animated animate__fadeInDown",
                },
            })
        })
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">Productos Disponibles</h1>
                        <p className="text-center text-gray-600 mt-2">Explora nuestra lista completa de productos ~~</p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        {productos.length === 0 ? (
                            <p className="text-center mt-10 text-gray-500">No hay productos disponibles!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {productos.map((producto, index) => (
                                    <div
                                        key={producto._id || producto.id}
                                        className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${index % 2 === 0
                                            ? "animate-fade-in-left"
                                            : "animate-fade-in-right"
                                            }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 capitalize">
                                                        {producto.nombre}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {producto.descripcion}
                                                    </p>
                                                </div>
                                                <Tooltip title="Copiar nombre">
                                                    <IconButton
                                                        onClick={() => copiarAlPortapapeles(producto.nombre)}
                                                        className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Copy size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center bg-yellow-50 p-3 rounded-lg">
                                                    <Boxes size={18} className="text-yellow-600 mr-3" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">
                                                            Existencias:
                                                        </span>
                                                        <span className="ml-1 font-medium text-yellow-800">
                                                            {producto.existencias}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-green-50 p-3 rounded-lg">
                                                    <DollarSign size={18} className="text-green-600 mr-3" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Precio:</span>
                                                        <span className="ml-1 font-medium text-green-800">
                                                            ${producto.precio} {producto.moneda}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                    <Package size={18} className="text-blue-600 mr-3" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Puntos:</span>
                                                        <span className="ml-1 font-medium text-blue-800">
                                                            {producto.puntos}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-gray-50 p-3 rounded-lg text-sm">
                                                    <Calendar size={16} className="text-gray-500 mr-3" />
                                                    <span className="text-gray-600">
                                                        Agregado:{" "}
                                                        {new Date(producto.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeInLeft 0.4s ease-out forwards;
        }
      `}</style>
        </Layout>
    )
}

export default ProductosComponent;