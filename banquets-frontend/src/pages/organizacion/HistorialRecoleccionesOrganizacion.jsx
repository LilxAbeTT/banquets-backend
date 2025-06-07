import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiUpload, FiStar } from 'react-icons/fi';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const HistorialRecoleccionesOrganizacion = ({ recoleccionesOrganizacion, onSubirComprobante, onShowMessage }) => {
  const { user } = useAuth(); // Para el ID del usuario
  const [loading, setLoading] = useState(false); // Podría ser true si recarga internamente
  const [error, setError] = useState('');
  const [filtroHistorial, setFiltroHistorial] = useState('');
  const [modalHistorial, setModalHistorial] = useState(null); // Para ver detalles de una recolección del historial

  // Filtrado de historial de recolecciones (ya viene filtrado por organización desde el padre)
  const historialFiltrado = recoleccionesOrganizacion.filter((h) =>
    h.donacionTitulo.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    h.donador?.nombreEmpresa.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    h.recoleccionEstado.toLowerCase().includes(filtroHistorial.toLowerCase()) // Permite buscar por estado también
  );

  if (loading) { // Esto es si tuviera su propia carga. Por ahora, el padre maneja la carga.
    return <div className="text-center text-gray-500 py-8">Cargando historial...</div>;
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Filtro de Historial */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
        <h3 className="text-base font-semibold text-gray-800 shrink-0">Buscar en Historial:</h3>
        <input
          type="text"
          placeholder="Buscar por título, donador o estado..."
          value={filtroHistorial}
          onChange={(e) => setFiltroHistorial(e.target.value)}
          className="w-full md:flex-1 border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lista de Recolecciones en Historial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {historialFiltrado.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">No hay recolecciones en tu historial que coincidan con la búsqueda.</p>
        ) : (
          historialFiltrado.map((h) => (
            <div key={h.idRecoleccion} onClick={() => setModalHistorial(h)} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
              <img src={h.donacionImagenBase64 ? `data:image/jpeg;base64,${h.donacionImagenBase64}` : 'https://via.placeholder.com/150'} alt={h.donacionTitulo} className="w-full h-36 object-cover" />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold text-gray-800">{h.donacionTitulo}</h3>
                <p className="text-sm text-gray-600">Tipo: {h.donacionTipo}</p>
                <p className="text-sm text-gray-600">Cantidad: {h.donacionCantidad} porciones</p>
                <p className="text-sm text-gray-500">Donador: <strong>{h.donador?.nombreEmpresa || 'Donador Desconocido'}</strong></p>
                <p className="text-sm text-gray-500">Fecha Aceptación: {new Date(h.fechaAceptacion).toLocaleDateString()}</p>
                <p className="text-sm font-medium" style={{ color: h.recoleccionEstado === 'confirmada' ? '#22c55e' : (h.recoleccionEstado === 'aceptada' ? '#3b82f6' : '#ef4444') }}>
                    Estado: {h.recoleccionEstado?.replace('_', ' ').toUpperCase()} {/* <--- OJO CON EL OPTIONAL CHAINING */}
                </p>

                {/* Sección de comprobante e evaluación */}
                {h.recoleccionEstado === 'aceptada' ? ( // Si está aceptada y no confirmada, se puede subir comprobante
                    h.comprobanteImagenBase64 ? (
                        <p className="text-sm text-gray-700 font-semibold mt-2 flex items-center gap-1">
                            <FiCheckCircle className="text-blue-600"/> Comprobante subido.
                        </p>
                    ) : (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subir Comprobante (imagen):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onSubirComprobante(h.idRecoleccion, e.target.files[0])} // Llama a la prop
                                className="mt-1 w-full text-sm"
                            />
                        </div>
                    )
                ) : ( // Si ya está confirmada
                    h.comprobanteImagenBase64 ? (
                        <div className="mt-2 text-center text-sm text-gray-700">
                            <p className="font-semibold">Comprobante de Entrega:</p>
                            <img src={`data:image/jpeg;base64,${h.comprobanteImagenBase64}`} alt="Comprobante" className="mt-2 h-32 w-full object-contain rounded border" />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic mt-2 text-center">No se subió comprobante para esta recolección.</p>
                    )
                )}

                {/* Mostrar evaluación si existe */}
                {h.evaluacionDetalle ? (
                    <div className="mt-4 text-center">
                        <h3 className="text-sm font-bold text-gray-800">Evaluación del Donador:</h3>
                        <p className="text-xl font-bold text-yellow-500 mt-1">
                            {'★'.repeat(h.evaluacionDetalle.estrellas)}{'☆'.repeat(5 - h.evaluacionDetalle.estrellas)}
                        </p>
                        <p className="text-sm text-gray-600">"{h.evaluacionDetalle.comentario || 'Sin comentario'}"</p>
                    </div>
                ) : (
                    h.recoleccionEstado === 'confirmada' && (
                        <p className="text-sm text-gray-500 italic mt-4 text-center">Esperando evaluación del donador.</p>
                    )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalles de Recolección (del historial) */}
      <AnimatePresence>
        {modalHistorial && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setModalHistorial(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-xl font-bold mb-2">{modalHistorial.donacionTitulo}</h2>
              <p className="text-sm text-gray-600">Donador: <strong>{modalHistorial.donador?.nombreEmpresa || 'Desconocido'}</strong></p>
              <p className="text-sm text-gray-600 mb-1">Cantidad: {modalHistorial.donacionCantidad} porciones</p>
              <p className="text-sm text-gray-600 mb-1">Fecha Aceptación: {new Date(modalHistorial.fechaAceptacion).toLocaleDateString()}</p>
              <p className="text-sm font-medium" style={{ color: modalHistorial.recoleccionEstado === 'confirmada' ? '#22c55e' : (modalHistorial.recoleccionEstado === 'aceptada' ? '#3b82f6' : '#ef4444') }}>
                  Estado Recolección: {modalHistorial.recoleccionEstado?.replace('_', ' ').toUpperCase()}
              </p>

              {/* Mostrar u ocultar input de comprobante */}
              {modalHistorial.recoleccionEstado === 'aceptada' ? ( // Si está aceptada y no confirmada
                modalHistorial.comprobanteImagenBase64 ? (
                  <div className="mt-2 text-center text-sm text-green-700">
                    <p className="font-semibold">Comprobante ya subido.</p>
                    <img src={`data:image/jpeg;base64,${modalHistorial.comprobanteImagenBase64}`} alt="Comprobante" className="mt-2 h-32 w-full object-contain rounded border" />
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subir Comprobante (imagen):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSubirComprobante(modalHistorial.idRecoleccion, e.target.files[0])}
                      className="mt-1 w-full text-sm"
                    />
                  </div>
                )
              ) : ( // Si ya está confirmada
                modalHistorial.comprobanteImagenBase64 ? (
                  <div className="mt-2 text-center text-sm text-gray-700">
                    <p className="font-semibold">Comprobante de Entrega:</p>
                    <img src={`data:image/jpeg;base64,${modalHistorial.comprobanteImagenBase64}`} alt="Comprobante" className="mt-2 h-32 w-full object-contain rounded border" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-2 text-center">No se subió comprobante para esta recolección.</p>
                )
              )}

              {/* Mostrar evaluación si existe */}
              {modalHistorial.evaluacionDetalle ? (
                  <div className="mt-4 text-center">
                      <h3 className="text-sm font-bold text-gray-800">Evaluación del Donador:</h3>
                      <p className="text-xl font-bold text-yellow-500 mt-1">
                          {'★'.repeat(modalHistorial.evaluacionDetalle.estrellas)}{'☆'.repeat(5 - modalHistorial.evaluacionDetalle.estrellas)}
                      </p>
                      <p className="text-sm text-gray-600">"{modalHistorial.evaluacionDetalle.comentario || 'Sin comentario'}"</p>
                  </div>
              ) : (
                  modalHistorial.recoleccionEstado === 'confirmada' && (
                    <p className="text-sm text-gray-500 italic mt-4 text-center">Esperando evaluación del donador.</p>
                  )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistorialRecoleccionesOrganizacion;