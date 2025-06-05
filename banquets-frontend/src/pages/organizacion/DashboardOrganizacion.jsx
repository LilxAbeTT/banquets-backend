import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiMessageSquare, FiUpload, FiStar, FiAlertCircle } from 'react-icons/fi'; // Añadimos FiUpload y FiStar
import { FaDog, FaUser } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

// --- AÑADIR ESTAS IMPORTACIONES PARA RECHARTS ---
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// --- FIN IMPORTACIONES RECHARTS ---

const DashboardOrganizacion = () => {
  const { user } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [chatActivo, setChatActivo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]); // Mensajes reales del chat (futura integración)
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [soloCercanas, setSoloCercanas] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(null);
  const [filtroHistorial, setFiltroHistorial] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorDashboard, setErrorDashboard] = useState('');
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Estados para datos reales
  const [donacionesDisponibles, setDonacionesDisponibles] = useState([]);
  const [recoleccionesOrganizacion, setRecoleccionesOrganizacion] = useState([]);
  const [ubicacionOrganizacion, setUbicacionOrganizacion] = useState(null);

  const [estadisticas, setEstadisticas] = useState({
    donacionesDisponibles: 0,
    recoleccionesCompletadas: 0,
    totalPorcionesRecolectadas: 0,
    promedioEvaluacion: '—', // Evaluación de las donaciones que recolectó
  });

  // Datos para el gráfico de pastel
  const dataPieChart = [
    { name: 'Donaciones Disponibles', value: estadisticas.donacionesDisponibles, color: '#facc15' },
    { name: 'Recolectadas Completadas', value: estadisticas.recoleccionesCompletadas, color: '#22c55e' },
  ];
  const COLORS = ['#facc15', '#22c55e'];

  // Función para cargar todos los datos del dashboard
  const fetchDashboardData = async () => {
    if (!user || !user.token || user.idUsuario === undefined) {
      setLoadingDashboard(false);
      return;
    }

    setLoadingDashboard(true);
    setErrorDashboard('');

    try {
      // 1. Obtener la ubicación de la organización desde el contexto del usuario (del login)
      if (user.latitud && user.longitud) {
        setUbicacionOrganizacion({ lat: user.latitud, lng: user.longitud });
      } else {
        setErrorDashboard('No se pudo obtener la ubicación de tu organización. Por favor, revisa tu perfil.');
      }

      // 2. Cargar Donaciones Pendientes (para el muro)
      const donacionesRes = await api.get('/donaciones', { params: { estado: 'pendientes' } });
      setDonacionesDisponibles(donacionesRes.data);

      // 3. Cargar Recolecciones de la Organización (para el historial)
      const recoleccionesRes = await api.get(`/recolecciones?tipoUsuario=${user.tipoUsuario.toUpperCase()}`);
      const recoleccionesDeMiOrg = recoleccionesRes.data.filter(rec =>
        rec.organizacion?.idOrganizacion === user.idUsuario
      );
      setRecoleccionesOrganizacion(recoleccionesDeMiOrg);

      // 4. Calcular Estadísticas
      const disponiblesCount = donacionesRes.data.length;
      const completadasCount = recoleccionesDeMiOrg.filter(rec => rec.recoleccionEstado === 'confirmada').length;
      const porcionesRecolectadas = recoleccionesDeMiOrg.reduce((sum, rec) => sum + rec.donacionCantidad, 0);

      const evaluacionesRecibidasPorDonadores = recoleccionesDeMiOrg.filter(rec => rec.evaluacionDetalle?.estrellas);
      const sumaEstrellas = evaluacionesRecibidasPorDonadores.reduce((sum, rec) => sum + rec.evaluacionDetalle.estrellas, 0);
      const promedio = evaluacionesRecibidasPorDonadores.length > 0 ? (sumaEstrellas / evaluacionesRecibidasPorDonadores.length).toFixed(1) : '—';


      setEstadisticas({
          donacionesDisponibles: disponiblesCount,
          recoleccionesCompletadas: completadasCount,
          totalPorcionesRecolectadas: porcionesRecolectadas,
          promedioEvaluacion: promedio,
      });

    }
    // OJO: Aquí, el catch actualiza errorDashboard pero no detiene el ciclo de vida.
    // Esto podría causar que el componente intente renderizar datos indefinidos si la API falla.
    // Es posible que el error 'undefined' venga de aquí.
    catch (err) {
      console.error('Error al cargar datos del dashboard de organización:', err.response ? err.response.data : err.message);
      setErrorDashboard('No se pudieron cargar los datos. ' + (err.response?.data?.message || err.message));
      setDonacionesDisponibles([]); // Asegurar que no se usen datos incompletos
      setRecoleccionesOrganizacion([]);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, mostrarHistorial]);

  // Función para aceptar una donación (crear una Recoleccion)
  const handleAceptarDonacion = async (donacionId) => {
    try {
      const requestData = {
        idDonacion: donacionId,
      };
      await api.post('/recolecciones', requestData);

      setMensajeExito('✅ Donación aceptada! Revisa tu historial de recolecciones.');
      fetchDashboardData();
      setModalAbierto(null);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al aceptar donación:', err.response ? err.response.data : err.message);
      setErrorDashboard('No se pudo aceptar la donación. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorDashboard(''), 3000);
    }
  };

  // Función para subir el comprobante de entrega
  const handleSubirComprobante = async (recoleccionId, file) => {
    if (!file) {
      setErrorDashboard('Por favor, selecciona un archivo de imagen para el comprobante.');
      return;
    }

    const formData = new FormData();
    formData.append('comprobante', file);

    try {
      await api.put(`/recolecciones/${recoleccionId}/subirComprobante`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensajeExito('✅ Comprobante subido con éxito!');
      fetchDashboardData();
      setModalHistorial(null);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al subir comprobante:', err.response ? err.response.data : err.message);
      setErrorDashboard('No se pudo subir el comprobante. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorDashboard(''), 3000);
    }
  };

  // Helper para calcular distancia
  const calcularDistancia = (loc1, loc2) => {
    const rad = (x) => x * Math.PI / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = rad(loc2.lat - loc1.lat);
    const dLng = rad(loc2.lng - loc1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(loc1.lat)) * Math.cos(rad(loc2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Filtrado de donaciones disponibles
  const donacionesFiltradas = donacionesDisponibles.filter((d) => {
    const distancia = ubicacionOrganizacion ? calcularDistancia(ubicacionOrganizacion, { lat: d.latitud, lng: d.longitud }) : Infinity;
    const tipoCoincide = !filtroTipo || d.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const categoriaCoincide = !filtroCategoria || d.categoria === filtroCategoria;
    const esCercana = !soloCercanas || distancia <= 5;

    return tipoCoincide && categoriaCoincide && esCercana;
  });

  // Filtrado de historial de recolecciones
  const historialFiltrado = recoleccionesOrganizacion.filter((h) =>
    h.donacionTitulo.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    h.donador?.nombreEmpresa.toLowerCase().includes(filtroHistorial.toLowerCase())
  );

  const disponiblesCount = donacionesDisponibles.length;
  const completadasCount = recoleccionesOrganizacion.filter(rec => rec.recoleccionEstado === 'confirmada').length;
  const enProcesoCount = recoleccionesOrganizacion.filter(rec => rec.recoleccionEstado === 'aceptada').length;


  if (loadingDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Cargando dashboard de organización...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-3">
      {errorDashboard && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorDashboard}</span>
        </div>
      )}

      {/* Frase de Bienvenida */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center md:text-left">
            ¡Bienvenida, {user?.nombre || 'Organización'}!
        </h1>
        <button onClick={() => setMostrarHistorial(!mostrarHistorial)} className="bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
          {mostrarHistorial ? 'Ver Donaciones Disponibles' : 'Ver Historial de Recolecciones'}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">{mostrarHistorial ? 'Historial de Recolecciones' : 'Donaciones disponibles:'}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel principal (Donaciones / Historial) - 3/4 del ancho */}
        <div className="lg:col-span-3">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
            <h3 className="text-base font-semibold text-gray-800 shrink-0">Filtros:</h3>
            {!mostrarHistorial && (
              <>
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
              </>
            )}
            {mostrarHistorial && (
              <input
                type="text"
                placeholder="Buscar en historial (título, donador)..."
                value={filtroHistorial}
                onChange={(e) => setFiltroHistorial(e.target.value)}
                className="w-full md:flex-1 border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {!mostrarHistorial ? (
              donacionesFiltradas.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-8">No hay donaciones disponibles que coincidan con los filtros.</p>
              ) : (
                  donacionesFiltradas.map((d) => {
                      const distancia = ubicacionOrganizacion ? calcularDistancia(ubicacionOrganizacion, { lat: d.latitud, lng: d.longitud }) : null;
                      return (
                        <div key={d.idDonacion} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
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
                                    onClick={() => setModalAbierto(d)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Ver Detalles y Aceptar
                                </button>
                            </div>
                        </div>
                      );
                  })
              )
            ) : (
              recoleccionesOrganizacion.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-8">No hay recolecciones en tu historial.</p>
              ) : (
                  historialFiltrado.map((h) => (
                      <div key={h.idRecoleccion} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
                          <img src={h.donacionImagenBase64 ? `data:image/jpeg;base64,${h.donacionImagenBase64}` : 'https://via.placeholder.com/150'} alt={h.donacionTitulo} className="w-full h-36 object-cover" />
                          <div className="p-4 space-y-1">
                              <h3 className="text-lg font-bold text-gray-800">{h.donacionTitulo}</h3>
                              <p className="text-sm text-gray-600">Tipo: {h.donacionTipo}</p>
                              <p className="text-sm text-gray-600">Cantidad: {h.donacionCantidad}</p>
                              <p className="text-sm text-gray-500">Donador: <strong>{h.donador?.nombreEmpresa || 'Donador Desconocido'}</strong></p>
                              <p className="text-sm text-gray-500">Fecha Aceptación: {new Date(h.fechaAceptacion).toLocaleDateString()}</p>
                              <p className="text-sm font-medium" style={{ color: h.recoleccionEstado === 'confirmada' ? '#22c55e' : (h.recoleccionEstado === 'aceptada' ? '#3b82f6' : '#ef4444') }}>
                                  Estado: {h.recoleccionEstado.replace('_', ' ').toUpperCase()}
                              </p>

                              {/* Sección de comprobante e evaluación */}
                              {h.recoleccionEstado === 'aceptada' && (
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
                                              onChange={(e) => handleSubirComprobante(h.idRecoleccion, e.target.files[0])}
                                              className="mt-1 w-full text-sm"
                                          />
                                      </div>
                                  )
                              )}
                              {h.recoleccionEstado === 'confirmada' && (
                                  h.evaluacionDetalle ? (
                                      <p className="text-sm text-blue-500 font-semibold mt-1 flex items-center gap-1">
                                          <FiStar className="text-yellow-500" /> Evaluación del Donador: {h.evaluacionDetalle.estrellas} ★
                                      </p>
                                  ) : (
                                      <p className="text-sm text-gray-500 font-medium mt-1">Esperando evaluación del donador.</p>
                                  )
                              )}
                          </div>
                      </div>
                  ))
              )
            )}
          </div>
        </div>

        {/* Panel lateral derecho - 1/4 del ancho */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta de Consejos */}
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600 text-center">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center justify-center gap-2"><FiAlertCircle /> Consejos para Recolección</h3>
            <p className="mb-2"><strong>¡Actúa rápido!</strong> Las donaciones suelen tener fecha límite corta. Acepta solo lo que puedas recolectar a tiempo.</p>
            <p>Comunícate con el donador a través del chat una vez aceptada la donación para coordinar la entrega.</p>
          </div>

          {/* Estadísticas clave */}
          <div className="bg-white p-6 rounded-xl shadow text-gray-700 text-center space-y-3">
            <h3 className="text-gray-800 font-bold text-lg mb-2">📊 Tu Impacto</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div>
                    <p className="text-purple-600 text-2xl font-bold">{estadisticas.donacionesDisponibles}</p>
                    <p className="text-gray-600">Donaciones Disponibles</p>
                </div>
                <div>
                    <p className="text-green-600 text-2xl font-bold">{estadisticas.recoleccionesCompletadas}</p>
                    <p className="text-gray-600">Recolectadas Completadas</p>
                </div>
                <div className="col-span-2">
                    <p className="text-blue-600 text-2xl font-bold">{estadisticas.totalPorcionesRecolectadas}</p>
                    <p className="text-gray-600">Porciones Recolectadas</p>
                </div>
                <div className="col-span-2">
                    <p className="text-purple-600 text-2xl font-bold">{estadisticas.promedioEvaluacion}</p>
                    <p className="text-gray-600">Promedio Evaluación Recibida</p>
                </div>
            </div>
          </div>

          {/* Gráfico de pastel: Comparativa de Recolecciones Aceptadas vs Completadas */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm font-bold text-gray-800 mb-3 text-center">Estado de Recolecciones</h3>
            {(estadisticas.donacionesDisponibles + estadisticas.recoleccionesCompletadas + enProcesoCount) > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={dataPieChart}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {dataPieChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 text-sm">No hay datos suficientes para mostrar el gráfico.</p>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">Comparativa entre donaciones disponibles y las que ya recolectaste.</p>
          </div>

          {/* Tarjeta de Contacto de Soporte */}
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600 text-center">
            <h3 className="text-gray-800 font-semibold mb-2">¿Necesitas Ayuda?</h3>
            <p className="mb-3">Si tienes alguna pregunta o problema con tus recolecciones, contacta a nuestro equipo de soporte.</p>
            <button onClick={() => alert('Redirigiendo a soporte...')} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-base font-semibold flex items-center justify-center gap-2">
              <FiMessageSquare /> Contactar Soporte
            </button>
          </div>
        </div>
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
              <button onClick={() => { setModalAbierto(null); setChatActivo(false); }} className="absolute top-2 right-2 text-gray-500 hover:text-black">
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
                  onClick={() => handleAceptarDonacion(modalAbierto.idDonacion)}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FiCheckCircle className="inline-block mr-2" /> Aceptar Donación
                </button>
              )}

              {/* Chat con Donador - Lógica condicional */}
              {/* Solo muestra el chat si la donación está 'en_proceso' (es decir, ya fue aceptada y hay una recolección activa) */}
              {recoleccionesOrganizacion.some(rec => rec.donacionId === modalAbierto.idDonacion && rec.recoleccionEstado === 'aceptada') ? ( // Busca si ya existe una recolección 'aceptada' para esta donación
                chatActivo ? (
                  <div className="mt-4 border p-4 rounded bg-gray-50 space-y-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Chat con Donador</h3>
                    <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                      {mensajes.map((m, i) => ( // Mensajes simulados por ahora
                        <div key={i} className={m.de === 'organizacion' ? 'text-right' : 'text-left'}>
                          <span className={m.de === 'organizacion' ? 'bg-green-100' : 'bg-blue-100'} style={{ padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
                            {m.texto}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center mt-2 gap-2">
                      <input
                        type="text"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-grow border px-3 py-1 rounded text-sm"
                      />
                      <button onClick={() => alert('Mensaje enviado (simulado)')} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Enviar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setChatActivo(true)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Chatear con Donador
                  </button>
                )
              ) : (
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm italic">
                  <span className="text-lg">🔒</span>
                  <span>El chat estará disponible después de aceptar esta donación.</span>
                </div>
              )}

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
                  Estado Recolección: {modalHistorial.recoleccionEstado.replace('_', ' ').toUpperCase()}
              </p>

              <img src={modalHistorial.donacionImagenBase64 ? `data:image/jpeg;base64,${modalHistorial.donacionImagenBase64}` : 'https://via.placeholder.com/150'} alt={modalHistorial.donacionTitulo} className="w-full h-40 object-cover rounded mb-3" />

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
                      onChange={(e) => handleSubirComprobante(modalHistorial.idRecoleccion, e.target.files[0])}
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


      {/* Mensaje flotante de éxito/error */}
      <AnimatePresence>
        {mensajeExito && (
          <motion.div
            key="exito"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {mensajeExito}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardOrganizacion;