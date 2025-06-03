// DashboardDonador.jsx - versión completa con historial, evaluación, firma, y todos los componentes funcionales

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiMessageSquare, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { FaDog, FaUser } from 'react-icons/fa';
import ModalPublicarDonacion from '../../components/ModalPublicarDonacion';

const DashboardDonador = () => {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [evaluando, setEvaluando] = useState(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [modalConfirmar, setModalConfirmar] = useState(null);
  const canvasRef = useRef(null);

  const usuario = {
    nombre: 'Vidanta Resort',
    ubicacion: { lat: 23.047447, lng: -109.692861 }
  };

  const donaciones = [
    {
      id: 1,
      titulo: 'Buffet Evento',
      fecha: '2025-04-25',
      cantidad: 80,
      tipo: 'Comida preparada',
      categoria: 'humano',
      estado: 'pendientes',
      recoger: 'hoy',
      descripcion: 'Evento empresarial. Sobrante limpio. Incluye postres.',
      imagen: 'https://www.alimentacionsindesperdicio.com/wp-content/uploads/2017/02/remenjammm-800x360.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 }
    },
    {
      id: 2,
      titulo: 'Croquetas y Sobras',
      fecha: '2025-04-24',
      cantidad: 30,
      tipo: 'Comida seca y cocida',
      categoria: 'animal',
      estado: 'en_proceso',
      recoger: 'mañana',
      descripcion: 'Donación para refugios. Sobrante de cocina.',
      imagen: 'https://www.donbigotes.co/wp-content/uploads/calculadora-de-alimento-perros-y-gatos.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 },
      confirmada: false
    },

    {
      id: 4,
      titulo: 'Ensaladas Surtidas',
      fecha: '2025-04-23',
      cantidad: 40,
      tipo: 'Comida preparada',
      categoria: 'humano',
      estado: 'pendientes',
      recoger: 'mañana',
      descripcion: 'Ensaladas listas. Perfectas para reparto.',
      imagen: 'https://img-global.cpcdn.com/recipes/c74559a6188c41e9/680x482cq70/ensalada-surtida-foto-principal.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 }
    },
    {
      id: 5,
      titulo: 'Sopa Vegetal',
      fecha: '2025-04-22',
      cantidad: 25,
      tipo: 'Comida líquida',
      categoria: 'animal',
      estado: 'recolectadas',

      recoger: 'hoy',
      descripcion: 'Porciones de sopa sobrante apta para animales.',
      imagen: 'https://recetasdecocina.elmundo.es/wp-content/uploads/2023/09/como-hacer-caldo-de-verduras.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 }

    },
    {
      id: 6,
      titulo: 'Latas sobrantes',
      fecha: '2025-04-22',
      cantidad: 100,
      tipo: 'Para preparar',
      categoria: 'humano',
      estado: 'pendientes',
      recoger: 'mañana',
      descripcion: 'Verduras, granos y frijoles.',
      imagen: 'https://images.ecestaticos.com/Nsyi3ZrhsMo5nceLkovWfBg7C6o=/1x152:2109x1256/600x315/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F3ee%2Fe4e%2Fb79%2F3eee4eb79d4831de5176388da703d4d9.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 }
    }
  ];

  const totalDonaciones = donaciones.length;
  const totalPorciones = donaciones.reduce((sum, d) => sum + d.cantidad, 0);
  const enProceso = donaciones.filter(d => d.estado === 'en_proceso').length;
  const pendientes = donaciones.filter(d => d.estado === 'pendientes').length;
  const recolectadas = donaciones.filter(d => d.estado === 'recolectadas').length;


  const historial = [
    {
      id: 101,
      titulo: 'Frutas Variadas',
      fecha: '2025-04-28',
      cantidad: 60,
      categoria: 'humano',
      tipo: 'Productos frescos',
      estado: 'recolectadas',
      imagen: 'https://www.alimentacionsindesperdicio.com/wp-content/uploads/2017/02/remenjammm-800x360.jpg',
      receptor: 'Casa Hogar Los Angeles',
      evaluado: false
    },
    {
      id: 102,
      titulo: 'Comida Cocida',
      fecha: '2025-04-27',
      cantidad: 40,
      categoria: 'animal',
      tipo: 'Comida cocida',
      estado: 'recolectadas',
      imagen: 'https://recetasdecocina.elmundo.es/wp-content/uploads/2023/09/como-hacer-caldo-de-verduras.jpg',
      receptor: 'Refugio San José',
      evaluado: true
    }
  ];

  const estados = {
    pendientes: 'bg-yellow-100 text-yellow-700',
    en_proceso: 'bg-blue-100 text-blue-700',
    recolectadas: 'bg-green-100 text-green-700'
  };

  const donacionesFiltradas = [...donaciones]
    .filter((d) => d.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => orden === 'cantidad' ? b.cantidad - a.cantidad : new Date(b.fecha) - new Date(a.fecha));

  const [mensajeExito, setMensajeExito] = useState('');

  const [donacionAEliminar, setDonacionAEliminar] = useState(null);


  // Cuerpo:

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{mostrarHistorial ? 'Historial de Donaciones' : 'Publicaciones recientes:'}</h2>
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
            historial.map((h) => (
              <div key={h.id} className="bg-white shadow rounded-xl overflow-hidden">
                <img src={h.imagen} alt={h.titulo} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-bold text-gray-800">{h.titulo}</h3>
                  <p className="text-sm text-gray-600">Tipo: {h.tipo}</p>
                  <p className="text-sm text-gray-600">Cantidad: {h.cantidad}</p>
                  <p className="text-sm text-gray-500">Receptor: <strong>{h.receptor}</strong></p>
                  <p className="text-sm text-gray-500">Fecha: {h.fecha}</p>
                  <p className="text-sm text-green-600 font-medium">Estado: {h.estado}</p>
                  {h.evaluado ? (
                    <p className="text-sm text-blue-500 font-semibold mt-1">✅ Evaluada</p>
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
          ) : (
            donacionesFiltradas.map((d) => (
              <div key={d.id} onClick={() => setMostrarModal(d)} className="bg-white shadow rounded-xl cursor-pointer hover:shadow-lg transition overflow-hidden">
                <div className="relative">
                  <img src={d.imagen} alt={d.titulo} className="w-full h-36 object-cover" />
                  <div className="absolute top-2 right-2 text-lg">
                    {d.categoria === 'animal' ? <FaDog className="text-orange-600" /> : <FaUser className="text-blue-700" />}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{d.titulo}</h3>
                  <p className="text-sm text-gray-500">{d.tipo}</p>
                  <p className="text-sm text-gray-600 mt-1">Cantidad: {d.cantidad}</p>
                  <span className={`mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full ${estados[d.estado]}`}>
                    {d.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel lateral (1/4 del ancho) */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <p><strong>Consejo:</strong> Publica antes de las 5pm para maximizar aceptación.</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700 space-y-2">
            <h3 className="text-gray-800 font-bold mb-1">📈 Mis estadísticas</h3>
            <p>🧾 Total publicaciones: <strong>{totalDonaciones}</strong></p>
            <p>🍽️ Porciones donadas: <strong>{totalPorciones}</strong></p>
            <p className="text-yellow-600">⏳ Pendientes: <strong>{pendientes}</strong></p>
            <p className="text-blue-600">📦 En proceso: <strong>{enProceso}</strong></p>
            <p className="text-green-600">✅ Recolectadas: <strong>{recolectadas}</strong></p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <h3 className="text-gray-800 font-semibold mb-2">¿Tienes un problema?</h3>
            <button onClick={() => navigate('/soporte/chat')} className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm font-semibold">Contactar Administrador</button>
          </div>
        </div>
      </div>


      {/* Modal de detalles */}
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
              <img src={mostrarModal.imagen} alt={mostrarModal.titulo} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-xl font-bold mb-1">{mostrarModal.titulo}</h2>
              <p className="text-sm text-gray-600">Tipo: {mostrarModal.tipo}</p>
              <p className="text-sm text-gray-600">Categoría: {mostrarModal.categoria}</p>
              <p className="text-sm text-gray-600">Cantidad: {mostrarModal.cantidad}</p>
              <p className="text-sm text-gray-600">Recoger: <strong>{mostrarModal.recoger === 'hoy' ? 'Hoy' : 'Más tardar mañana'}</strong></p>
              <p className="text-sm text-gray-600 my-2">{mostrarModal.descripcion}</p>

              <div className="flex justify-end gap-3 mb-3">
                {mostrarModal.estado === 'pendientes' && (
                  <>
                    <button className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700">
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

              {mostrarModal.estado === 'en_proceso' && (
                <>
                  {mostrarModal.confirmada ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setModalConfirmar(mostrarModal)}
                        className="mt-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full shadow hover:bg-green-200 transition"
                      >
                        ✔️ Entrega confirmada — Ver firma
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalConfirmar(mostrarModal)}
                      className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      ✅ Confirmar Entrega
                    </button>
                  )}
                </>
              )}



              {chatAbierto && (
                <div className="mt-4 border p-3 rounded bg-gray-50">
                  <p className="text-sm text-gray-700 font-semibold">Chat:</p>
                  <p className="text-xs text-gray-500">[Simulación de chat activa...]</p>
                </div>
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
              <h2 className="text-lg font-bold mb-2 text-gray-800">Evaluar a {evaluando.receptor}</h2>

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
                onClick={() => {
                  console.log('Evaluación enviada:', { idDonacion: evaluando.id, estrellas, comentario });
                  setEvaluando(null);
                  setEstrellas(0);
                  setComentario('');
                  setMensajeExito('✅ Evaluación enviada con éxito');
                  setTimeout(() => setMensajeExito(''), 3000);
                }}

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

              {modalConfirmar.confirmada && modalConfirmar.firmaBase64 ? (
                <img
                  src={modalConfirmar.firmaBase64}
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
                  }}
                />
              )}

              {!modalConfirmar.confirmada && (
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
                    onClick={() => {
                      const firma = canvasRef.current.toDataURL();
                      console.log('Firma base64:', firma);
                      alert('Entrega confirmada con éxito');
                      setModalConfirmar(null);
                      setMostrarModal(null);
                      setMensajeExito('📦 Entrega confirmada');
                      setTimeout(() => setMensajeExito(''), 3000);
                      // aquí enviarías `firma` al backend
                    }}
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

      {/* Modal Publicar Donación */}
      <AnimatePresence>
        {mostrarModal === 'publicar' && (
          <ModalPublicarDonacion
            onClose={() => setMostrarModal(null)}
            onPublicar={(nuevaDonacion) => {
              console.log('Publicada:', nuevaDonacion);
              // Aquí podrías setDonaciones([...donaciones, nuevaDonacion]);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal mensaje flotante */}
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
                  onClick={() => {
                    console.log('Donación eliminada:', donacionAEliminar.id);
                    setMensajeExito('🗑️ Donación eliminada');
                    setTimeout(() => setMensajeExito(''), 3000);
                    setMostrarModal(null);
                    setDonacionAEliminar(null);
                    // Aquí deberías actualizar el estado real si estás usando backend
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Botón flotante para abrir modal */}
      <button
        onClick={() => setMostrarModal('publicar')}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center gap-2"
      >
        <FiPlus size={20} />
        <span className="hidden md:inline font-semibold">Nueva Donación</span>
      </button>
    </div>
  );






};

export default DashboardDonador;
