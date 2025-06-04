// src/pages/donador/DashboardDonador.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { FaDog, FaUser } from 'react-icons/fa';
// Si ModalPublicarDonacion ya no se usa, puedes quitar esta importación.
// import ModalPublicarDonacion from '../../components/ModalPublicarDonacion';
import api from '../../services/axios'; // Importa tu instancia de axios
import { useAuth } from '../../context/AuthContext'; // Importa useAuth para el id del usuario

const DashboardDonador = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtén el usuario del contexto
  const [mostrarModal, setMostrarModal] = useState(null); // Para detalles de donación (objeto donación real)
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [evaluando, setEvaluando] = useState(null); // Para modal de evaluación (objeto recolección real)
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [modalConfirmar, setModalConfirmar] = useState(null); // Para modal de firma (objeto recolección real)
  const canvasRef = useRef(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [donacionAEliminar, setDonacionAEliminar] = useState(null); // Para modal de confirmación de eliminación

  // Estados para datos reales del backend
  const [donaciones, setDonaciones] = useState([]); // Donaciones en estado pendientes/en_proceso
  const [recoleccionesHistorial, setRecoleccionesHistorial] = useState([]); // Recolecciones en estado 'recolectadas'
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  // Estados para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalPublicaciones: 0,
    totalPorcionesDonadas: 0,
    pendientes: 0,
    enProceso: 0,
    recolectadas: 0
  });

  // Efecto para cargar donaciones y recolecciones del donador
  useEffect(() => {
    const fetchDonacionesYRecolecciones = async () => {
      if (!user || !user.id) { // Asegúrate de que el ID del usuario esté disponible
        setLoadingDatos(false);
        return;
      }

      setLoadingDatos(true);
      setErrorCarga('');

      try {
        // Cargar donaciones propias del donador (estado 'pendientes' o 'en_proceso')
        // Endpoint: GET /api/donaciones/mias
        const donacionesResponse = await api.get('/donaciones/mias');
        setDonaciones(donacionesResponse.data);

        // Cargar recolecciones completadas (historial) del donador
        // Endpoint: GET /api/recolecciones/donador/{idDonador}
        // Este endpoint lo crearemos en el backend en el siguiente paso.
        const recoleccionesResponse = await api.get(`/recolecciones/donador/${user.id}`);
        setRecoleccionesHistorial(recoleccionesResponse.data);

        // Calcular estadísticas
        const totalPubs = donacionesResponse.data.length + recoleccionesResponse.data.length;
        const totalPorcs = donacionesResponse.data.reduce((sum, d) => sum + d.cantidad, 0) +
                           recoleccionesResponse.data.reduce((sum, r) => sum + r.donacion.cantidad, 0); // Asume que recoleccion.donacion.cantidad existe

        setEstadisticas({
          totalPublicaciones: totalPubs,
          totalPorcionesDonadas: totalPorcs,
          pendientes: donacionesResponse.data.filter(d => d.estado === 'pendientes').length,
          enProceso: donacionesResponse.data.filter(d => d.estado === 'en_proceso').length,
          recolectadas: recoleccionesResponse.data.length // Ya son todas 'recolectadas' en el historial
        });

      } catch (err) {
        console.error('Error al cargar datos del donador:', err.response ? err.response.data : err.message);
        setErrorCarga('No se pudieron cargar tus donaciones o historial.');
      } finally {
        setLoadingDatos(false);
      }
    };

    fetchDonacionesYRecolecciones();
    // Puedes considerar un `setInterval` para recargar periódicamente si es necesario
    // const intervalId = setInterval(fetchDonacionesYRecolecciones, 30000); // Cada 30 segundos
    // return () => clearInterval(intervalId);
  }, [user, mostrarHistorial]); // Recargar si el usuario o la vista de historial cambia

  // Estados de donación para el estilizado Tailwind
  const estados = {
    pendientes: 'bg-yellow-100 text-yellow-700',
    en_proceso: 'bg-blue-100 text-blue-700',
    recolectadas: 'bg-green-100 text-green-700'
  };

  // Filtrado y ordenamiento para el Muro (donaciones activas)
  const donacionesFiltradas = [...donaciones]
    .filter((d) => d.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => orden === 'cantidad' ? b.cantidad - a.cantidad : new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));

  // Filtrado y ordenamiento para el Historial (recolecciones completadas)
  const historialFiltrado = [...recoleccionesHistorial]
    .filter((r) => r.donacion.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => orden === 'cantidad' ? b.donacion.cantidad - a.donacion.cantidad : new Date(b.fechaAceptacion) - new Date(a.fechaAceptacion));

  // Manejadores de acciones de donaciones

  const handleDeleteDonacion = async (idDonacion) => {
    try {
      await api.delete(`/donaciones/${idDonacion}`); // Endpoint a implementar en el backend
      setMensajeExito('🗑️ Donación eliminada con éxito');
      setDonaciones(donaciones.filter(d => d.idDonacion !== idDonacion)); // Elimina del estado local
      setMostrarModal(null); // Cierra el modal de detalles
      setDonacionAEliminar(null); // Cierra el modal de confirmación
      // Actualizar estadísticas también
      setEstadisticas(prev => ({ ...prev, totalPublicaciones: prev.totalPublicaciones - 1, pendientes: prev.pendientes - 1 }));
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al eliminar donación:', err.response ? err.response.data : err.message);
      setErrorCarga('No se pudo eliminar la donación. Asegúrate que no esté en proceso.');
      setTimeout(() => setErrorCarga(''), 5000);
    }
  };

  const handleConfirmarEntrega = async (recoleccion) => {
    const ctx = canvasRef.current.getContext('2d');
    const imageDataURL = canvasRef.current.toDataURL('image/png'); // Obtiene la firma en Base64

    // Extraer solo la parte base64 de la data URL
    const firmaBase64 = imageDataURL.split(',')[1];

    if (!firmaBase64) {
      setErrorCarga('No se pudo capturar la firma. Intenta de nuevo.');
      return;
    }

    try {
      // Endpoint: PUT /api/recolecciones/{idRecoleccion}/confirmar
      // El backend necesita el ID de la Recolección para actualizarla.
      await api.put(`/recolecciones/${recoleccion.idRecoleccion}/confirmar`, { firmaBase64: firmaBase64 });

      setMensajeExito('📦 Entrega confirmada con éxito');
      // Actualiza el estado local de la recolección
      setRecoleccionesHistorial(prev => prev.map(r =>
        r.idRecoleccion === recoleccion.idRecoleccion ? { ...r, estado: 'confirmada', firmaBase64: firmaBase64 } : r
      ));
      setModalConfirmar(null);
      setMostrarModal(null);
      // Actualizar estadísticas (quitar de 'en_proceso', sumar a 'recolectadas')
      setEstadisticas(prev => ({
        ...prev,
        enProceso: prev.enProceso - 1,
        recolectadas: prev.recolectadas + 1
      }));
      setTimeout(() => setMensajeExito(''), 3000);

    } catch (err) {
      console.error('Error al confirmar entrega:', err.response ? err.response.data : err.message);
      setErrorCarga('No se pudo confirmar la entrega. Revisa el backend.');
      setTimeout(() => setErrorCarga(''), 5000);
    }
  };

  const handleEnviarEvaluacion = async () => {
    if (!evaluando || estrellas === 0) {
      setErrorCarga('Por favor, selecciona al menos una estrella para evaluar.');
      return;
    }
    try {
      // Endpoint: POST /api/evaluaciones
      // El backend necesita el idRecoleccion, estrellas, comentario, y el id del donador que evalúa.
      const evaluacionData = {
        recoleccion: { idRecoleccion: evaluando.idRecoleccion }, // Objeto anidado según tu entidad Evaluacion
        estrellas: estrellas,
        comentario: comentario,
      };

      await api.post('/evaluaciones', evaluacionData);

      setMensajeExito('✅ Evaluación enviada con éxito');
      // Actualiza el historial para marcarla como evaluada (puedes añadir un campo `evaluada` a tu objeto `Recoleccion` si el backend lo devuelve)
      setRecoleccionesHistorial(prev => prev.map(r =>
        r.idRecoleccion === evaluando.idRecoleccion ? { ...r, evaluada: true, evaluacionEstrellas: estrellas, evaluacionComentario: comentario } : r
      ));
      setEvaluando(null);
      setEstrellas(0);
      setComentario('');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al enviar evaluación:', err.response ? err.response.data : err.message);
      setErrorCarga('No se pudo enviar la evaluación. Intenta de nuevo.');
      setTimeout(() => setErrorCarga(''), 5000);
    }
  };

  if (loadingDatos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Cargando tus datos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-3">
      {/* Mensaje de error global */}
      <AnimatePresence>
        {errorCarga && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {errorCarga}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{mostrarHistorial ? 'Historial de Recolecciones' : 'Publicaciones recientes:'}</h2>
        <button onClick={() => setMostrarHistorial(!mostrarHistorial)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          {mostrarHistorial ? 'Volver al Muro' : 'Ver Historial'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Filtrar Donaciones</h3>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full border px-3 py-1 rounded text-sm"
        />
        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="w-full border px-3 py-1 rounded text-sm">
          <option value="reciente">Más recientes</option>
          <option value="cantidad">Mayor cantidad</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sección muro o historial (3/4 del ancho) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {mostrarHistorial ? (
            // Mapeo para Historial de Recolecciones
            recoleccionesHistorial.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No hay recolecciones en tu historial.</p>
            ) : (
                historialFiltrado.map((r) => (
                    <div key={r.idRecoleccion} className="bg-white shadow rounded-xl overflow-hidden">
                        <img src={r.donacion.imagen ? `data:image/jpeg;base64,${r.donacion.imagen}` : 'https://via.placeholder.com/150'} alt={r.donacion.titulo} className="w-full h-36 object-cover" />
                        <div className="p-4 space-y-1">
                            <h3 className="text-lg font-bold text-gray-800">{r.donacion.titulo}</h3>
                            <p className="text-sm text-gray-600">Tipo: {r.donacion.tipo}</p>
                            <p className="text-sm text-gray-600">Cantidad: {r.donacion.cantidad}</p>
                            <p className="text-sm text-gray-500">Organización: <strong>{r.organizacion?.nombreEmpresa || 'Desconocida'}</strong></p> {/* Acceso seguro */}
                            <p className="text-sm text-gray-500">Fecha Recolección: {new Date(r.fechaAceptacion).toLocaleDateString()}</p>
                            <p className="text-sm text-green-600 font-medium">Estado: {r.estado.replace('_', ' ').toUpperCase()}</p>
                            {r.evaluacion?.estrellas ? ( // Asume que tu Recoleccion del backend tiene un objeto Evaluacion
                                <p className="text-sm text-blue-500 font-semibold mt-1">
                                    ✅ Evaluada ({r.evaluacion.estrellas} ★)
                                </p>
                            ) : (
                                <button
                                    onClick={() => setEvaluando(r)} // Pasa el objeto recoleccion real
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
            donaciones.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No hay donaciones pendientes o en proceso.</p>
            ) : (
                donacionesFiltradas.map((d) => (
                    <div key={d.idDonacion} onClick={() => setMostrarModal(d)} className="bg-white shadow rounded-xl cursor-pointer hover:shadow-lg transition overflow-hidden">
                        <div className="relative">
                            <img src={d.imagen ? `data:image/jpeg;base64,${d.imagen}` : 'https://via.placeholder.com/150'} alt={d.titulo} className="w-full h-36 object-cover" />
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
            <h3 className="text-gray-800 font-bold mb-1">📈 Mis estadísticas</h3>
            <p>🧾 Total publicaciones: <strong>{estadisticas.totalPublicaciones}</strong></p>
            <p>🍽️ Porciones donadas: <strong>{estadisticas.totalPorcionesDonadas}</strong></p>
            <p className="text-yellow-600">⏳ Pendientes: <strong>{estadisticas.pendientes}</strong></p>
            <p className="text-blue-600">📦 En proceso: <strong>{estadisticas.enProceso}</strong></p>
            <p className="text-green-600">✅ Recolectadas: <strong>{estadisticas.recolectadas}</strong></p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <h3 className="text-gray-800 font-semibold mb-2">¿Tienes un problema?</h3>
            <button onClick={() => navigate('/soporte/chat')} className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm font-semibold">Contactar Administrador</button>
          </div>
        </div>
      </div>

      {/* Modal de detalles de Donación */}
      <AnimatePresence>
        {mostrarModal && (
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
              <button onClick={() => setMostrarModal(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              <img src={mostrarModal.imagen ? `data:image/jpeg;base64,${mostrarModal.imagen}` : 'https://via.placeholder.com/150'} alt={mostrarModal.titulo} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-xl font-bold mb-1">{mostrarModal.titulo}</h2>
              <p className="text-sm text-gray-600">Tipo: {mostrarModal.tipo}</p>
              <p className="text-sm text-gray-600">Categoría: {mostrarModal.categoria}</p>
              <p className="text-sm text-gray-600">Cantidad: {mostrarModal.cantidad}</p>
              <p className="text-sm text-gray-600">Fecha Límite: {new Date(mostrarModal.fechaLimite).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 my-2">{mostrarModal.descripcion}</p>

              <div className="flex justify-end gap-3 mb-3">
                {mostrarModal.estado === 'pendientes' && (
                  <>
                    {/* Botones de edición y eliminación */}
                    <button className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                      onClick={() => alert("Funcionalidad de edición pendiente de implementar.")}>
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => setDonacionAEliminar(mostrarModal)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>

              {/* Lógica para confirmar entrega si está "en_proceso" */}
              {mostrarModal.estado === 'en_proceso' && mostrarModal.recoleccion ? (
                <>
                  {/* Si el backend te devuelve que ya hay una firma, la muestra. */}
                  {mostrarModal.recoleccion.estado === 'confirmada' && mostrarModal.recoleccion.firmaBase64 ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setModalConfirmar(mostrarModal.recoleccion)}
                        className="mt-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full shadow hover:bg-green-200 transition"
                      >
                        ✔️ Entrega confirmada — Ver firma
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalConfirmar(mostrarModal.recoleccion)}
                      className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      ✅ Confirmar Entrega
                    </button>
                  )}
                </>
              ) : mostrarModal.estado === 'en_proceso' && !mostrarModal.recoleccion ? (
                 <p className="text-sm text-gray-500 italic text-center mt-2">Esperando que la organización inicie la recolección para confirmar.</p>
              ) : null }
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

              {/* Muestra firma si ya está confirmada y disponible */}
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
                    canvasRef.current.getContext('2d').closePath();
                  }}
                  onMouseLeave={() => {
                    if (canvasRef.current?.isDrawing) {
                        canvasRef.current.isDrawing = false;
                        canvasRef.current.getContext('2d').closePath();
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
                    canvasRef.current.getContext('2d').closePath();
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

      {/* Modal confirmacion eliminacion */}
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

      {/* Mensaje flotante */}
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

      {/* Botón flotante para Nueva Donación */}
      <button
        onClick={() => navigate('/donador/publicar')}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center gap-2"
      >
        <FiPlus size={20} />
        <span className="hidden md:inline font-semibold">Nueva Donación</span>
      </button>
    </div>
  );
};

export default DashboardDonador;