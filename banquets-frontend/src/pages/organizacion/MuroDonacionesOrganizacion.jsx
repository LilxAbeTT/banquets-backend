import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiMessageSquare, FiUpload, FiStar, FiAlertCircle } from 'react-icons/fi';
import { FaDog, FaUser } from 'react-icons/fa';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext'; // Para obtener el ID del usuario

const MuroDonacionesOrganizacion = ({ ubicacionOrganizacion, onAceptarDonacion, onShowMessage }) => {
  const { user } = useAuth(); // Necesario para los filtros del lado del servidor si se añaden

  // Estados de datos
  const [donacionesDisponibles, setDonacionesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [soloCercanas, setSoloCercanas] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(null); // Para detalles de una donación disponible

  // Función para cargar las donaciones disponibles
  const fetchDonacionesDisponibles = async () => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Usar el endpoint /api/donaciones para obtener donaciones pendientes
      const donacionesRes = await api.get('/donaciones', { params: { estado: 'pendientes' } });
      setDonacionesDisponibles(donacionesRes.data);
    } catch (err) {
      console.error('Error al cargar donaciones disponibles:', err.response ? err.response.data : err.message);
      setError('No se pudieron cargar las donaciones disponibles. ' + (err.response?.data || err.message || 'Intenta de nuevo.'));
      setDonacionesDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonacionesDisponibles();
  }, [user]); // Recargar si el usuario cambia

  // Helper para calcular distancia (asumimos que ubicacionOrganizacion viene como prop)
  const calcularDistancia = (loc1, loc2) => {
    const rad = (x) => x * Math.PI / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = rad(loc2.lat - loc1.lat);
    const dLng = rad(loc2.lng - loc1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(loc1.lat)) * Math.cos(rad(loc2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1)); // Distancia en km con un decimal
  };

  // Filtrado de donaciones disponibles
  const donacionesFiltradas = donacionesDisponibles.filter((d) => {
    // Asegurarse de que d.latitud y d.longitud no son undefined para el cálculo de distancia
    const distancia = ubicacionOrganizacion && d.latitud && d.longitud ? calcularDistancia(ubicacionOrganizacion, { lat: d.latitud, lng: d.longitud }) : Infinity;
    const tipoCoincide = !filtroTipo || d.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const categoriaCoincide = !filtroCategoria || d.categoria === filtroCategoria;
    const esCercana = !soloCercanas || distancia <= 5; // Solo donaciones a 5km o menos

    return d.estado === 'pendientes' && tipoCoincide && categoriaCoincide && esCercana;
  });

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Cargando donaciones disponibles...</div>;
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
        <h3 className="text-base font-semibold text-gray-800 shrink-0">Filtros:</h3>
        <input
          type="text"
          placeholder="Filtrar por tipo de comida..."
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="w-full md:flex-1 border px-3 py-2 rounded-lg text-sm focus:ring-blue-400 focus:border-blue-400"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="w-full md:w-auto border px-3 py-2 rounded-lg text-sm focus:ring-blue-400 focus:border-blue-400"
        >
          <option value="">Todas las categorías</option>
          <option value="humano">Consumo humano</option>
          <option value="animal">Consumo animal</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 shrink-0">
          <input
            type="checkbox"
            checked={soloCercanas}
            onChange={(e) => setSoloCercanas(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          Mostrar solo cercanas (≤ 5 km)
        </label>
      </div>

      {/* Lista de Donaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {donacionesFiltradas.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">No hay donaciones disponibles que coincidan con los filtros.</p>
        ) : (
          donacionesFiltradas.map((d) => {
            const distancia = ubicacionOrganizacion && d.latitud && d.longitud ? calcularDistancia(ubicacionOrganizacion, { lat: d.latitud, lng: d.longitud }) : null;
            return (
              <div key={d.idDonacion} onClick={() => setModalAbierto(d)} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
                <img src={d.imagenBase64 ? `data:image/jpeg;base64,${d.imagenBase64}` : 'https://via.placeholder.com/150'} alt={d.titulo} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{d.titulo}</h3>
                    {d.categoria === 'animal' ? <FaDog className="text-orange-600" /> : <FaUser className="text-blue-700" />}
                  </div>
                  <p className="text-sm text-gray-600">Tipo: {d.tipo}</p>
                  <p className="text-sm text-gray-600">Donador: <strong>{d.donador?.nombreEmpresa || 'Donador Desconocido'}</strong></p>
                  <p className="text-sm text-gray-500">Cantidad: {d.cantidad} porciones</p>
                  {distancia !== null && (
                      <p className="text-sm text-green-600">{distancia <= 5 ? '¡Cerca de ti!' : `A ${distancia} km de distancia`}</p>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setModalAbierto(d); }} // Detener propagación para evitar doble clic
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver Detalles y Aceptar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Detalles y Aceptación de Donación */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-xl w-full rounded-xl shadow-xl relative overflow-y-auto max-h-[95vh] p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => setModalAbierto(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              <h2 className="text-xl font-bold mb-2">{modalAbierto.titulo}</h2>
              <p className="text-sm text-gray-600">Donador: <strong>{modalAbierto.donador?.nombreEmpresa || 'Donador Desconocido'}</strong></p>
              <p className="text-sm text-gray-600 mb-1">Tipo: {modalAbierto.tipo}</p>
              <p className="text-sm text-gray-600 mb-1">Categoría: {modalAbierto.categoria}</p>
              <p className="text-sm text-gray-600 mb-1">Cantidad: {modalAbierto.cantidad} porciones</p>
              <p className="text-sm text-gray-600 mb-1">Fecha límite: {new Date(modalAbierto.fechaLimite).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700 mb-3">📝 <strong>Descripción:</strong> {modalAbierto.descripcion}</p>

              <img
                src={modalAbierto.imagenBase64 ? `data:image/jpeg;base64,${modalAbierto.imagenBase64}` : 'https://via.placeholder.com/150'}
                alt="Alimento"
                className="w-full h-40 object-cover rounded mb-3"
              />

              {/* Botón de Aceptar Donación (solo si está pendiente) */}
              {modalAbierto.estado === 'pendientes' && (
                <button
                  onClick={() => {
                    onAceptarDonacion(modalAbierto.idDonacion); // Llama a la prop para aceptar
                    setModalAbierto(null); // Cierra este modal después de aceptar
                  }}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FiCheckCircle className="inline-block mr-2" /> Aceptar Donación
                </button>
              )}

              {/* Chat con Donador - Lógica condicional (simulado por ahora) */}
              {/* Asumimos que el chat solo se activa si hay una recolección en proceso */}
              {
                // Para que el chat aparezca, debe haber una recolección en estado 'aceptada' o 'en_proceso' para esta donación
                // y el usuario debe haber hecho clic en el botón de chat
                // La lista de recoleccionesOrganizacion se actualiza en el componente padre.
                // Aquí, para mantener el chat simple por ahora, solo mostramos el botón si la donación fue aceptada.
                // La lógica del chat real se implementará en pasos posteriores.
                recoleccionesOrganizacion.some(rec => rec.donacionId === modalAbierto.idDonacion && rec.recoleccionEstado === 'aceptada') ? (
                    <button onClick={() => onShowMessage('Chat functionality not yet implemented.')} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <FiMessageSquare className="inline-block mr-2" /> Chatear con Donador (Simulado)
                    </button>
                ) : (
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm italic">
                        <span className="text-lg">🔒</span>
                        <span>El chat estará disponible después de aceptar esta donación.</span>
                    </div>
                )
              }


              {/* Mapa de Ubicación */}
              {ubicacionOrganizacion && modalAbierto.latitud && modalAbierto.longitud && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Ubicación de Donación y Recolección</h3>
                  <div className="rounded-lg overflow-hidden h-64 border border-gray-300">
                    <MapContainer center={[modalAbierto.latitud, modalAbierto.longitud]} zoom={13} scrollWheelZoom={false} className="z-10">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[modalAbierto.latitud, modalAbierto.longitud]}>
                        <Popup>{modalAbierto.titulo}</Popup>
                      </Marker>
                      <Marker position={[ubicacionOrganizacion.lat, ubicacionOrganizacion.lng]}>
                        <Popup>Tu ubicación (Organización)</Popup>
                      </Marker>
                      <Polyline positions={[[modalAbierto.latitud, modalAbierto.longitud], [ubicacionOrganizacion.lat, ubicacionOrganizacion.lng]]} color="#3B82F6" />
                    </MapContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Distancia estimada: {calcularDistancia(ubicacionOrganizacion, { lat: modalAbierto.latitud, lng: modalAbierto.longitud })} km</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MuroDonacionesOrganizacion;