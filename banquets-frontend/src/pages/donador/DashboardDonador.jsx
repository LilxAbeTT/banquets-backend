import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiMessageSquare, FiTrash2, FiEdit2, FiStar } from 'react-icons/fi'; // Añadir FiStar para evaluación
import { FaDog, FaUser } from 'react-icons/fa';
import ModalPublicarDonacion from '../../components/ModalPublicarDonacion';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

// Importaciones para gráficos (ejemplo con Recharts, si los usas)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const DashboardDonador = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtén el usuario del contexto
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(null);
  const [mostrarModalPublicar, setMostrarModalPublicar] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');
  const [chatAbierto, setChatAbierto] = useState(false); // Simulación de chat
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [evaluando, setEvaluando] = useState(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [modalConfirmar, setModalConfirmar] = useState(null);
  const canvasRef = useRef(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [donacionAEliminar, setDonacionAEliminar] = useState(null);

  const [donaciones, setDonaciones] = useState([]); // Donaciones activas (pendientes, en_proceso)
  const [historialRecolecciones, setHistorialRecolecciones] = useState([]); // Recolecciones confirmadas
  const [loadingDonaciones, setLoadingDonaciones] = useState(true);
  const [errorDonaciones, setErrorDonaciones] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalPublicaciones: 0,
    totalPorcionesDonadas: 0,
    publicacionesPendientes: 0,
    publicacionesEnProceso: 0,
    recoleccionesCompletadas: 0,
    promedioEvaluacion: '—'
  });

  // Datos simulados para el gráfico (sustituir con datos reales del backend)
  const dataGrafico = [
    { name: 'Ene', donaciones: 40 },
    { name: 'Feb', donaciones: 30 },
    { name: 'Mar', donaciones: 20 },
    { name: 'Abr', donaciones: 27 },
    { name: 'May', donaciones: 18 },
  ];


  // Función para recargar todos los datos desde el backend
  const fetchDonacionesAndHistory = async () => {
    if (!user || !user.token || user.idUsuario === undefined) {
      setLoadingDonaciones(false);
      return;
    }

    setLoadingDonaciones(true);
    setErrorDonaciones('');

    try {
      // Cargar donaciones propias (pendientes y en proceso)
      const donacionesRes = await api.get('/donaciones/mias');
      // Filtra las donaciones que están activas para el muro principal
      const donacionesActivas = donacionesRes.data.filter(d => d.estado === 'pendientes' || d.estado === 'en_proceso');
      setDonaciones(donacionesActivas);

      // Cargar el historial de recolecciones del donador (estado 'confirmada')
      const recoleccionesRes = await api.get(`/recolecciones?tipoUsuario=${user.tipoUsuario.toUpperCase()}`);
      const recoleccionesDelDonador = recoleccionesRes.data.filter(rec =>
        rec.recoleccionEstado === 'confirmada' && rec.donador?.idDonador === user.idUsuario // Asegura que la recolección es del donador logueado
      );
      setHistorialRecolecciones(recoleccionesDelDonador);

      // Calcular estadísticas con datos reales
      const totalPubs = donacionesActivas.length + recoleccionesDelDonador.length;
      const totalPorsDonadas = donacionesActivas.reduce((sum, d) => sum + d.cantidad, 0) +
                               recoleccionesDelDonador.reduce((sum, r) => sum + r.donacionCantidad, 0); // Ajustar si Donacion en Recoleccion tiene la cantidad
      const pendientesCount = donacionesActivas.filter(d => d.estado === 'pendientes').length;
      const enProcesoCount = donacionesActivas.filter(d => d.estado === 'en_proceso').length;
      const completadasCount = recoleccionesDelDonador.length;

      // Calcular promedio de evaluación
      const evaluacionesRecibidas = recoleccionesDelDonador.filter(rec => rec.evaluacionDetalle?.estrellas);
      const sumaEstrellas = evaluacionesRecibidas.reduce((sum, rec) => sum + rec.evaluacionDetalle.estrellas, 0);
      const promedio = evaluacionesRecibidas.length > 0 ? (sumaEstrellas / evaluacionesRecibidas.length).toFixed(1) : '—';


      setEstadisticas({
          totalPublicaciones: totalPubs,
          totalPorcionesDonadas: totalPorsDonadas,
          publicacionesPendientes: pendientesCount,
          publicacionesEnProceso: enProcesoCount,
          recoleccionesCompletadas: completadasCount,
          promedioEvaluacion: promedio
      });

    } catch (err) {
      console.error('Error al cargar datos del donador:', err.response ? err.response.data : err.message);
      setErrorDonaciones('No se pudieron cargar las donaciones o el historial. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingDonaciones(false);
    }
  };

  // Cargar datos al montar y cuando cambian las dependencias
  useEffect(() => {
    fetchDonacionesAndHistory();
  }, [user, mostrarHistorial]);

  // Función para manejar la eliminación de una donación
  const handleDeleteDonacion = async (idDonacion) => {
    try {
      await api.delete(`/donaciones/${idDonacion}`);
      setMensajeExito('🗑️ Donación eliminada con éxito');
      fetchDonacionesAndHistory(); // Recargar datos para actualizar la lista y estadísticas
      setMostrarModalDetalles(null);
      setDonacionAEliminar(null);
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al eliminar donación:', err.response ? err.response.data : err.message);
      setErrorDonaciones('No se pudo eliminar la donación. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorDonaciones(''), 3000);
    }
  };

  // Función para manejar la confirmación de entrega (firma)
  const handleConfirmarEntrega = async (donacion) => { // La donación aquí es DonacionResponseDTO
    const ctx = canvasRef.current.getContext('2d');
    const firma = canvasRef.current.toDataURL();

    // Buscamos la recolección asociada a la donación que está 'en_proceso'
    const recoleccionEnProceso = historialRecolecciones.find(rec =>
        rec.donacionId === donacion.idDonacion && rec.recoleccionEstado === 'aceptada'
    );

    if (!recoleccionEnProceso || !recoleccionEnProceso.idRecoleccion) {
        setErrorDonaciones('No se encontró una recolección en estado "aceptada" asociada a esta donación para confirmar.');
        setTimeout(() => setErrorDonaciones(''), 3000);
        return;
    }

    try {
      await api.put(`/recolecciones/${recoleccionEnProceso.idRecoleccion}/confirmar`, { firmaBase64: firma });

      setMensajeExito('📦 Entrega confirmada');
      fetchDonacionesAndHistory(); // Recargar datos para actualizar estado
      setModalConfirmar(null);
      setMostrarModalDetalles(null);
      setTimeout(() => setMensajeExito(''), 3000);

    } catch (err) {
      console.error('Error al confirmar entrega:', err.response ? err.response.data : err.message);
      setErrorDonaciones('No se pudo confirmar la entrega. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorDonaciones(''), 3000);
    }
  };


  // Función para enviar la evaluación
  const handleEnviarEvaluacion = async () => {
    if (!evaluando || estrellas === 0) {
      setErrorDonaciones('Por favor, selecciona una cantidad de estrellas.');
      return;
    }
    try {
      const evaluacionData = {
        idRecoleccion: evaluando.idRecoleccion,
        estrellas: estrellas,
        comentario: comentario,
      };
      await api.post('/evaluaciones', evaluacionData);

      setMensajeExito('✅ Evaluación enviada con éxito');
      fetchDonacionesAndHistory(); // Recargar datos para actualizar estado de evaluación
      setEvaluando(null);
      setEstrellas(0);
      setComentario('');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al enviar evaluación:', err.response ? err.response.data : err.message);
      setErrorDonaciones('No se pudo enviar la evaluación. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorDonaciones(''), 3000);
    }
  };

  // Filtrado y ordenamiento de donaciones mostradas en el "Muro"
  const donacionesFiltradas = [...donaciones]
    .filter((d) => d.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => {
      const fechaA = new Date(b.fechaPublicacion);
      const fechaB = new Date(a.fechaPublicacion);
      return orden === 'cantidad' ? b.cantidad - a.cantidad : fechaA.getTime() - fechaB.getTime();
    });

  // Filtrado y ordenamiento del "Historial"
  const historialFiltrado = [...historialRecolecciones]
    .filter((h) => h.donacionTitulo.toLowerCase().includes(filtro.toLowerCase())) // Ahora usa donacionTitulo de la vista
    .sort((a, b) => {
      const fechaA = new Date(b.fechaAceptacion);
      const fechaB = new Date(a.fechaAceptacion);
      return orden === 'cantidad' ? b.donacionCantidad - a.donacionCantidad : fechaA.getTime() - fechaB.getTime();
    });

  const estados = {
    pendientes: 'bg-yellow-100 text-yellow-700',
    en_proceso: 'bg-blue-100 text-blue-700',
    recolectadas: 'bg-green-100 text-green-700',
    confirmada: 'bg-green-100 text-green-700'
  };

  if (loadingDonaciones) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Cargando donaciones...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-3">
      {errorDonaciones && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorDonaciones}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        {/* Frase de Bienvenida */}
        <h1 className="text-3xl font-extrabold text-gray-800">
            ¡Bienvenido, {user?.nombre || 'Donador'}!
        </h1>
        <button onClick={() => setMostrarHistorial(!mostrarHistorial)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          {mostrarHistorial ? 'Volver al Muro' : 'Ver Historial'}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-700">{mostrarHistorial ? 'Historial de Recolecciones' : 'Publicaciones recientes:'}</h2>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Filtrar Donaciones</h3>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg p-2" // <--- Ajuste de ancho
        />
        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="w-full md:w-1/2 border rounded-lg p-2"> {/* <--- Ajuste de ancho */}
          <option value="reciente">Más recientes</option>
          <option value="cantidad">Mayor cantidad</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sección muro o historial (3/4 del ancho) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {mostrarHistorial ? (
            // Mapeo para Historial de Recolecciones
            historialFiltrado.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No hay recolecciones en tu historial.</p>
            ) : (
                historialFiltrado.map((h) => (
                    <div key={h.idRecoleccion} className="bg-white shadow rounded-xl overflow-hidden">
                        {/* Asegúrate de que h.comprobanteImagenBase64 exista y se mapee correctamente */}
                        <img src={h.comprobanteImagenBase64 ? `data:image/jpeg;base64,${h.comprobanteImagenBase64}` : (h.donacionImagenBase64 ? `data:image/jpeg;base64,${h.donacionImagenBase64}` : 'https://via.placeholder.com/150')} alt={h.donacionTitulo} className="w-full h-36 object-cover" />
                        <div className="p-4 space-y-1">
                            <h3 className="text-lg font-bold text-gray-800">{h.donacionTitulo}</h3>
                            <p className="text-sm text-gray-600">Tipo: {h.donacionTipo}</p>
                            <p className="text-sm text-gray-600">Cantidad: {h.donacionCantidad}</p>
                            <p className="text-sm text-gray-500">Receptor: <strong>{h.organizacion?.nombreEmpresa || 'Organización Desconocida'}</strong></p>
                            <p className="text-sm text-gray-500">Fecha Recolección: {new Date(h.fechaAceptacion).toLocaleDateString()}</p>
                            <p className="text-sm text-green-600 font-medium">Estado: {h.estado.replace('_', ' ').toUpperCase()}</p>
                            {/* h.evaluacionDetalle ahora debería venir del backend si está evaluada */}
                            {h.evaluacionDetalle ? (
                                <p className="text-sm text-blue-500 font-semibold mt-1 flex items-center gap-1">
                                    <FiStar className="text-yellow-500" />Evaluada ({h.evaluacionDetalle.estrellas} ★)
                                </p>
                            ) : (
                                <button
                                    onClick={() => setEvaluando(h)}
                                    className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold"
                                >
                                    Evaluar Organización
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )
          ) : (
            // Mapeo para Donaciones Pendientes/En Proceso
            donacionesFiltradas.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No hay donaciones pendientes o en proceso.</p>
            ) : (
                donacionesFiltradas.map((d) => (
                    <div key={d.idDonacion} onClick={() => setMostrarModalDetalles(d)} className="bg-white shadow rounded-xl cursor-pointer hover:shadow-lg transition overflow-hidden">
                        <div className="relative">
                            <img src={d.imagenBase64 ? `data:image/jpeg;base64,${d.imagenBase64}` : 'https://via.placeholder.com/150'} alt={d.titulo} className="w-full h-36 object-cover" />
                            <div className="absolute top-2 right-2 text-lg">
                                {d.categoria === 'animal' ? <FaDog className="text-orange-600" /> : <FaUser className="text-blue-700" />}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800">{d.titulo}</h3>
                            <p className="text-sm text-gray-500">Tipo: {d.tipo}</p>
                            <p className="text-sm text-gray-600 mt-1">Cantidad: {d.cantidad}</p>
                            <span className={`mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full ${estados[d.estado]}`}>
                                {d.estado.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))
            )
          )}
        </div>

        {/* Panel lateral (1/4 del ancho) */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <p><strong>Consejo:</strong> Publica antes de las 5pm para maximizar aceptación.</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700 space-y-2">
            <h3 className="text-gray-800 font-bold mb-1">📈 Resumen de Donaciones</h3>
            <p className="text-gray-900 font-medium text-base">Total donaciones publicadas: <strong>{estadisticas.totalPublicaciones}</strong></p>
            <p className="text-gray-900 font-medium text-base">Total porciones donadas: <strong>{estadisticas.totalPorcionesDonadas}</strong></p>
            <p className="text-yellow-600 font-medium">⏳ Pendientes: <strong>{estadisticas.publicacionesPendientes}</strong></p>
            <p className="text-blue-600 font-medium">📦 En proceso: <strong>{estadisticas.publicacionesEnProceso}</strong></p>
            <p className="text-green-600 font-medium">✅ Recolecciones Completadas: <strong>{estadisticas.recoleccionesCompletadas}</strong></p>
            <p className="text-purple-600 font-medium">⭐ Evaluación Promedio: <strong>{estadisticas.promedioEvaluacion}</strong> / 5</p>
          </div>

          {/* Nuevo Panel de Datos Visuales (Ejemplo con un gráfico simple) */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Historial de Publicaciones Mensuales</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataGrafico} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donaciones" fill="#8884d8" name="Donaciones" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">Número de donaciones publicadas por mes.</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <h3 className="text-gray-800 font-semibold mb-2">¿Tienes un problema?</h3>
            <button onClick={() => navigate('/soporte/chat')} className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm font-semibold">Contactar Administrador</button>
          </div>
        </div>
      </div>

      {/* Modal de detalles de Donación */}
      <AnimatePresence>
        {mostrarModalDetalles && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-lg w-full rounded-xl p-6 shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => setMostrarModalDetalles(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              {/* Usa imagenBase64 del DTO */}
              <img src={mostrarModalDetalles.imagenBase64 ? `data:image/jpeg;base64,${mostrarModalDetalles.imagenBase64}` : 'https://via.placeholder.com/150'} alt={mostrarModalDetalles.titulo} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-xl font-bold mb-1">{mostrarModalDetalles.titulo}</h2>
              <p className="text-sm text-gray-600">Tipo: {mostrarModalDetalles.tipo}</p>
              <p className="text-sm text-gray-600">Categoría: {mostrarModalDetalles.categoria}</p>
              <p className="text-sm text-gray-600">Cantidad: {mostrarModalDetalles.cantidad}</p>
              <p className="text-sm text-gray-600">Fecha Límite: {new Date(mostrarModalDetalles.fechaLimite).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 my-2">{mostrarModalDetalles.descripcion}</p>

              <div className="flex justify-end gap-3 mb-3">
                {mostrarModalDetalles.estado === 'pendientes' && (
                  <>
                    <button className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700">
                      <FiEdit2 />
                    </button>
                    {/* Botón de eliminar que abre el modal de confirmación */}
                    <button
                      onClick={() => setDonacionAEliminar(mostrarModalDetalles)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>

              {mostrarModalDetalles.estado === 'en_proceso' && (
                <>
                  {
                    historialRecolecciones.find(rec => rec.donacionId === mostrarModalDetalles.idDonacion && rec.recoleccionEstado === 'confirmada') ? (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setModalConfirmar(historialRecolecciones.find(rec => rec.donacionId === mostrarModalDetalles.idDonacion))}
                                className="mt-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full shadow hover:bg-green-200 transition"
                            >
                                ✔️ Entrega confirmada — Ver firma
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setModalConfirmar(mostrarModalDetalles)}
                            className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            ✅ Confirmar Entrega
                        </button>
                    )
                  }
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Evaluacion */}
      <AnimatePresence>
        {evaluando && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => setEvaluando(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              <h2 className="text-lg font-bold mb-2 text-gray-800">Evaluar a {evaluando.organizacion?.nombreEmpresa || 'Organización'}</h2>

              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    onClick={() => setEstrellas(i)}
                    className={`text-3xl cursor-pointer ${i <= estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                rows={3}
                className="w-full border rounded-lg p-2 mb-4"
                placeholder="Comentario opcional..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />

              <button
                onClick={handleEnviarEvaluacion}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Enviar evaluación
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Firma digital */}
      <AnimatePresence>
        {modalConfirmar && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => setModalConfirmar(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Confirmar Entrega</h2>
              <p className="text-sm text-gray-600 mb-2">Firma a continuación para confirmar la entrega.</p>

              {modalConfirmar.firmaBase64 ? (
                <img
                  src={`data:image/png;base64,${modalConfirmar.firmaBase64}`}
                  alt="Firma digital"
                  className="border rounded w-full h-40 object-contain mb-3"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="border border-gray-400 rounded mb-3 w-full"
                  style={{ backgroundColor: '#fdfdfd' }}
                  onMouseDown={(e) => {
                    const ctx = canvasRef.current.getContext('2d');
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    canvasRef.current.isDrawing = true;
                  }}
                  onMouseMove={(e) => {
                    if (canvasRef.current?.isDrawing) {
                      const ctx = canvasRef.current.getContext('2d');
                      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                      ctx.stroke();
                    }
                  }}
                  onMouseUp={() => {
                    canvasRef.current.isDrawing = false;
                    const ctx = canvasRef.current.getContext('2d');
                    if (!ctx.canvas.isDrawing) ctx.closePath();
                  }}
                  onMouseLeave={() => {
                    if (canvasRef.current?.isDrawing) {
                        canvasRef.current.isDrawing = false;
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx && typeof ctx.closePath === 'function') ctx.closePath();
                    }
                  }}
                  onTouchStart={(e) => {
                    const ctx = canvasRef.current.getContext('2d');
                    const touch = e.touches[0];
                    const rect = e.target.getBoundingClientRect();
                    ctx.beginPath();
                    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
                    canvasRef.current.isDrawing = true;
                  }}
                  onTouchMove={(e) => {
                    if (canvasRef.current?.isDrawing) {
                        const ctx = canvasRef.current.getContext('2d');
                        const touch = e.touches[0];
                        const rect = e.target.getBoundingClientRect();
                        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                        ctx.stroke();
                        e.preventDefault();
                    }
                  }}
                  onTouchEnd={() => {
                    canvasRef.current.isDrawing = false;
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx && typeof ctx.closePath === 'function') ctx.closePath();
                  }}
                />
              )}

              {!modalConfirmar.firmaBase64 && (
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      const ctx = canvasRef.current.getContext('2d');
                      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Borrar
                  </button>
                  <button
                    onClick={() => handleConfirmarEntrega(modalConfirmar)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para confirmar eliminación de donación */}
      <AnimatePresence>
        {donacionAEliminar && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-sm w-full p-6 rounded-xl shadow-xl text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-3">¿Eliminar esta donación?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Esta acción no se puede deshacer. La donación <strong>{donacionAEliminar.titulo}</strong> se eliminará permanentemente.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDonacionAEliminar(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteDonacion(donacionAEliminar.idDonacion)}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Publicar Donación */}
      <AnimatePresence>
        {mostrarModalPublicar && (
          <ModalPublicarDonacion
            onClose={() => setMostrarModalPublicar(false)}
            onPublicarExito={(mensaje) => {
              setMensajeExito(mensaje);
              fetchDonacionesAndHistory();
              setTimeout(() => setMensajeExito(''), 3000);
            }}
          />
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

      {/* Botón flotante para abrir el Modal Publicar Donación */}
      <button
        onClick={() => setMostrarModalPublicar(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center gap-2"
      >
        <FiPlus size={20} />
        <span className="hidden md:inline font-semibold">Nueva Donación</span>
      </button>
    </div>
  );
};

export default DashboardDonador;