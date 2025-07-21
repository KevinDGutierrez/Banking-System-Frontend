import React, { useState, useEffect, useMemo } from "react";
import { useTransfer } from "../../shared/hooks/useTransfer";
import { useInterbankTransfer } from "../../shared/hooks/useInterbankTransfer";
import dayjs from "dayjs";
import Layout from "../layout/Layout";

const AdminViewTransfer = () => {
  const {
    transfers,
    handleGetTransfers,
    loading: loadingInternal,
  } = useTransfer();
  const {
    interbankTransfers,
    handleGetInterbankTransfers,
    loading: loadingInterbank,
  } = useInterbankTransfer();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    handleGetTransfers();
    handleGetInterbankTransfers();
  }, []);

  const allTransfers = useMemo(() => {
    const combined = [];

    (transfers ?? []).forEach((t) => {
      combined.push({
        ...t,
        type: "internal",
        emisorUsername: t.emisor?.username || "N/A",
        receptorUsername: t.receptor?.username || "N/A",
        bancoReceptorName: "Banco Innova",
        cuentaReceptor: t.cuentaReceptor?.numeroCuenta || "N/A",
        createdAt: new Date(t.createdAt),
      });
    });

    (interbankTransfers ?? []).forEach((t) => {
      combined.push({
        ...t,
        type: "interbank",
        emisorUsername: t.emisor?.username || "N/A",
        receptorUsername: "Externo",
        bancoReceptorName: t.bancoReceptor?.name || "N/A",
        cuentaReceptor: t.cuentaReceptorExterno || "N/A",
        createdAt: new Date(t.createdAt),
      });
    });

    return combined.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [transfers, interbankTransfers]);

  const filteredTransfers = useMemo(() => {
    let filtered = allTransfers;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCurrency !== "all") {
      filtered = filtered.filter((t) => t.moneda === filterCurrency);
    }

    if (filterMinAmount !== "") {
      const min = parseFloat(filterMinAmount);
      if (!isNaN(min)) {
        filtered = filtered.filter((t) => t.monto >= min);
      }
    }
    if (filterMaxAmount !== "") {
      const max = parseFloat(filterMaxAmount);
      if (!isNaN(max)) {
        filtered = filtered.filter((t) => t.monto <= max);
      }
    }

    if (filterStartDate) {
      const start = dayjs(filterStartDate).startOf("day");
      filtered = filtered.filter((t) =>
        dayjs(t.createdAt).isSameOrAfter(start)
      );
    }
    if (filterEndDate) {
      const end = dayjs(filterEndDate).endOf("day");
      filtered = filtered.filter((t) => dayjs(t.createdAt).isSameOrBefore(end));
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.emisorUsername.toLowerCase().includes(lowerCaseSearchTerm) ||
          t.receptorUsername.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [
    allTransfers,
    filterType,
    filterCurrency,
    filterMinAmount,
    filterMaxAmount,
    filterStartDate,
    filterEndDate,
    searchTerm,
  ]);

  const loading = loadingInternal || loadingInterbank;

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center drop-shadow-md">
          <i className="fas fa-exchange-alt mr-3 text-blue-600"></i>Gestión de
          Transferencias
        </h1>

        <div className="p-6 rounded-xl shadow-lg mb-8 border border-blue-300 bg-white bg-opacity-95">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2 border-blue-200">
            Filtros y Búsqueda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Buscar por Usuario (Emisor/Receptor)
              </label>
              <input
                type="text"
                id="searchTerm"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                placeholder="Ej: juan.perez"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="filterType"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Tipo de Transferencia
              </label>
              <select
                id="filterType"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="internal">Internas (Banco Innova)</option>
                <option value="interbank">Interbancarias</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filterCurrency"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Moneda
              </label>
              <select
                id="filterCurrency"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="GTQ">GTQ</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filterMinAmount"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Monto Mínimo
              </label>
              <input
                type="number"
                id="filterMinAmount"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                placeholder="Ej: 100"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="filterMaxAmount"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Monto Máximo
              </label>
              <input
                type="number"
                id="filterMaxAmount"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                placeholder="Ej: 1000"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="filterStartDate"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Fecha Inicio
              </label>
              <input
                type="date"
                id="filterStartDate"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="filterEndDate"
                className="block text-sm font-medium text-blue-800 mb-1"
              >
                Fecha Fin
              </label>
              <input
                type="date"
                id="filterEndDate"
                className="mt-1 block w-full px-4 py-2 border border-blue-400 rounded-xl shadow-sm focus:ring-blue-600 focus:border-blue-600 sm:text-sm text-gray-800"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl shadow-lg mb-8 border border-blue-300 bg-white bg-opacity-95">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2 border-blue-200">
            Listado de Transferencias
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-blue-600">Cargando transferencias...</p>
            </div>
          ) : filteredTransfers.length === 0 ? (
            <p className="text-center text-blue-600 py-8">
              No se encontraron transferencias con los criterios seleccionados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Emisor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Receptor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Cuenta Receptora
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Tipo Cta. Receptora
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Monto
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Moneda
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Banco Receptor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer._id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transfer.type === "internal"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-indigo-100 text-indigo-800"
                            }`}
                        >
                          {transfer.type === "internal"
                            ? "Interna"
                            : "Interbancaria"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.emisorUsername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.receptorUsername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.cuentaReceptor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.tipoCuentaReceptor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.moneda}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.bancoReceptorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {dayjs(transfer.createdAt).format(
                          "DD-MM-YYYY HH:mm:ss"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminViewTransfer;
