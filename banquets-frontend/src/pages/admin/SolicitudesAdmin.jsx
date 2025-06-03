import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import api from '../../services/axios';

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    api.get('/solicitudes/pendientes')
      .then((res) => setSolicitudes(res.data))
      .catch((err) => {
        console.error('Error al obtener solicitudes:', err);
        alert('No se pudieron cargar las solicitudes.');
      });
  }, []);

  const manejarAccion = async (id, accion) => {
    if (!id) {
      alert("ID no definido");
      return;
    }

    try {
      await api.put(`/solicitudes/${accion}/${id}`);
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.idSolicitud === id ? { ...s, estado: accion === 'aprobado' ? 'aprobado' : 'rechazado' } : s
        )
      );
      setDetalle(null);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo realizar la acción. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Ingreso</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Tipo</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4 text-center">Revisar</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hay solicitudes pendientes.
                </td>
              </tr>
            )}
            {solicitudes.map((s) => (
              <tr key={s.idSolicitud} className="border-t">
                <td className="py-2 px-4">{s.nombre}</td>
                <td className="py-2 px-4">{s.tipoUsuario}</td>
                <td className="py-2 px-4">{s.correo}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.estado === 'pendiente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : s.estado === 'aprobado'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>{s.estado.toUpperCase()}</span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => setDetalle(s)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {detalle && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-3xl w-full rounded-xl p-6 shadow-xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setDetalle(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >✖</button>

              <h2 className="text-xl font-bold text-gray-800 mb-2">Detalles de la Solicitud</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>Nombre:</strong> {detalle.nombre}</p>
                <p><strong>Correo:</strong> {detalle.correo}</p>
                <p><strong>Teléfono:</strong> {detalle.telefono}</p>
                <p><strong>Tipo de Usuario:</strong> {detalle.tipoUsuario}</p>
                <p><strong>Empresa/Organización:</strong> {detalle.nombreEmpresa}</p>
                <p><strong>RFC:</strong> {detalle.rfc || '—'}</p>
                <p><strong>Sitio Web / Red:</strong> {detalle.url || '—'}</p>
                <p className="md:col-span-2"><strong>Descripción:</strong> {detalle.descripcion}</p>
                <p className="md:col-span-2"><strong>Dirección:</strong> {detalle.direccion}</p>
                <div className="md:col-span-2">
                  <strong>Ubicación en el mapa:</strong>
                  <div className="mt-2 rounded-lg overflow-hidden border h-64">
                    <MapContainer center={detalle.ubicacion} zoom={15} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={detalle.ubicacion}>
                        <Popup>{detalle.nombre}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => manejarAccion(detalle.idSolicitud, 'rechazado')}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => manejarAccion(detalle.idSolicitud, 'aprobado')}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                  Aprobar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolicitudesAdmin;
