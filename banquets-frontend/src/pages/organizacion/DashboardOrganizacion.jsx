import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiMessageSquare } from 'react-icons/fi';
import { FaDog, FaUser } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

const DashboardOrganizacion = () => {
  const [modalAbierto, setModalAbierto] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [chatActivo, setChatActivo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([
    { de: 'donador', texto: 'Gracias por aceptar la donación' },
    { de: 'organizacion', texto: 'Vamos en camino' }
  ]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [soloCercanas, setSoloCercanas] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(null);
  const [filtroHistorial, setFiltroHistorial] = useState('');

  const ubicacionOrganizacion = { lat: 23.055513, lng: -109.700467 };

  const donaciones = [
    {
      id: 1,
      titulo: 'Buffet Evento',
      tipo: 'Comida preparada',
      categoria: 'humano',
      cantidad: 80,
      donador: 'Vidanta Resort',
      imagen: 'https://www.alimentacionsindesperdicio.com/wp-content/uploads/2017/02/remenjammm-800x360.jpg',
      ubicacion: { lat: 23.047447, lng: -109.692861 },
      estado: 'pendiente', // nuevo
      descripcion: 'Ejemplo de descripción de alimentos...', // opcional, para mostrar en detalle
      fechaLimite: '2025-05-12', // ficticio
      horaRecoleccion: null
    },
    {
      id: 2,
      titulo: 'Croquetas y Sobras',
      tipo: 'Comida seca y cocida',
      categoria: 'animal',
      cantidad: 30,
      donador: 'Don Bigotes Hotel',
      imagen: 'https://www.donbigotes.co/wp-content/uploads/calculadora-de-alimento-perros-y-gatos.jpg',
      ubicacion: { lat: 23.049200, lng: -109.695000 }
    },
    {
      id: 3,
      titulo: 'Cajas de Frutas',
      tipo: 'Productos frescos',
      categoria: 'humano',
      cantidad: 60,
      donador: 'Frutería La Paz',
      imagen: 'https://www.alimentacionsindesperdicio.com/wp-content/uploads/2017/02/remenjammm-800x360.jpg',
      ubicacion: { lat: 23.046000, lng: -109.693500 },
      estado: 'pendiente', // nuevo
      descripcion: 'Ejemplo de descripción de alimentos...', // opcional, para mostrar en detalle
      fechaLimite: '2025-05-12', // ficticio
      horaRecoleccion: null
    }
  ];

  const historial = [
    {
      id: 101,
      titulo: 'Panadería Local',
      cantidad: 20,
      fecha: '2025-04-22',
      evaluacion: 4,
      evaluado: true,
      comprobante: null,
      imagen: 'https://mexicochulo.com/wp-content/uploads/2019/07/Panaderia_garcia_madero_4.jpg',
      donador: 'Panadería La Paz',
      categoria: 'humano'
    },
    {
      id: 102,
      titulo: 'Comida Restaurante',
      cantidad: 45,
      fecha: '2025-04-20',
      evaluacion: 5,
      evaluado: true,
      comprobante: null,
      imagen: 'https://recetasdecocina.elmundo.es/wp-content/uploads/2023/09/como-hacer-caldo-de-verduras.jpg',
      donador: 'El Sabor',
      categoria: 'animal'
    }
  ];


  const calcularDistancia = (org, don) => {
    const rad = (x) => x * Math.PI / 180;
    const R = 6371;
    const dLat = rad(don.lat - org.lat);
    const dLng = rad(don.lng - org.lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(org.lat)) * Math.cos(rad(don.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const donacionesFiltradas = donaciones.filter((d) => {
    const distancia = calcularDistancia(ubicacionOrganizacion, d.ubicacion);
    const tipoCoincide = !filtroTipo || d.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const categoriaCoincide = !filtroCategoria || d.categoria === filtroCategoria;
    const esCercana = !soloCercanas || distancia <= 5;
    return tipoCoincide && categoriaCoincide && esCercana;
  });

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      setMensajes([...mensajes, { de: 'organizacion', texto: mensaje }]);
      setMensaje('');
    }
  };

  const historialFiltrado = historial.filter((h) =>
    h.titulo.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    h.donador.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    h.fecha.toLowerCase().includes(filtroHistorial.toLowerCase())
  );

  const totalDisponibles = donaciones.length;
  const totalFiltradas = donacionesFiltradas.length;
  const totalHistorial = historial.length;
  const totalPorcionesRecolectadas = historial.reduce((sum, h) => sum + h.cantidad, 0);
  const evaluaciones = historial.filter(h => h.evaluado).map(h => h.evaluacion);
  const promedioEvaluacion = evaluaciones.length
    ? (evaluaciones.reduce((a, b) => a + b, 0) / evaluaciones.length).toFixed(1)
    : '—';



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">¡Bienvenida, Organización!</h1>
      <button
        onClick={() => setMostrarHistorial(!mostrarHistorial)}
        className="mb-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        {mostrarHistorial ? 'Ver Donaciones Disponibles' : 'Ver Historial de Recolecciones'}
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-4">📬 Publicaciones recientes de donadores</h2>
      <p className="text-sm text-gray-600 mb-6">Aquí puedes visualizar donaciones disponibles. Haz clic en “Aceptar Donación” para ver todos los detalles y confirmar tu participación.</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-3">
          {mostrarHistorial ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="col-span-full mb-4">
                <input
                  type="text"
                  placeholder="🔍 Buscar en historial (por título, donador o fecha)..."
                  value={filtroHistorial}
                  onChange={(e) => setFiltroHistorial(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {historial.map((h) => (
                <div key={h.id} className="bg-white rounded shadow overflow-hidden relative">
                  <img src={h.imagen} alt={h.titulo} className="h-36 w-full object-cover" />
                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-bold">{h.titulo}</h3>
                    <p className="text-sm text-gray-500">Donador: {h.donador}</p>
                    <p className="text-sm text-gray-500">Fecha: {h.fecha}</p>
                    <p className="text-sm text-gray-500">Cantidad: {h.cantidad} porciones</p>
                    <p className="text-sm text-yellow-600">
                      Evaluación: {'★'.repeat(h.evaluacion)}{'☆'.repeat(5 - h.evaluacion)}
                    </p>

                    {!h.comprobante ? (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Subir comprobante:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const archivo = e.target.files[0];
                            if (archivo) {
                              const url = URL.createObjectURL(archivo);
                              h.comprobante = url;
                              setMostrarHistorial(false);
                              setTimeout(() => setMostrarHistorial(true), 50);
                              alert('Comprobante subido correctamente');
                            }
                          }}
                          className="mt-1 w-full text-sm"
                        />
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 font-semibold">Comprobante de entrega:</p>
                        <img
                          src={h.comprobante}
                          alt="Comprobante"
                          className="mt-1 h-32 w-full object-cover rounded-md border"
                        />
                      </div>
                    )}


                    {!h.evaluado && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              h.evaluacion = star;
                              h.evaluado = true;
                              setMostrarHistorial(false); // refresca el componente
                              setTimeout(() => setMostrarHistorial(true), 50);
                              alert(`Has evaluado al donador con ${star} estrella(s)`);
                            }}
                            className="text-yellow-500 text-xl hover:scale-110"
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setModalHistorial(h)}
                    className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {donacionesFiltradas.map((d) => {
                const distancia = calcularDistancia(ubicacionOrganizacion, d.ubicacion);
                return (
                  <div key={d.id} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
                    <img src={d.imagen} alt={d.titulo} className="w-full h-36 object-cover" />
                    <div className="p-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{d.titulo}</h3>
                        {d.categoria === 'animal' ? <FaDog className="text-orange-600" /> : <FaUser className="text-blue-700" />}
                      </div>
                      <p className="text-sm text-gray-600">{d.tipo}</p>
                      <p className="text-sm text-gray-600">Donador: <strong>{d.donador}</strong></p>
                      <p className="text-sm text-gray-500">Cantidad: {d.cantidad} porciones</p>
                      <p className="text-sm text-green-600">{distancia <= 5 ? '¡Cerca de ti!' : `A ${distancia} km de distancia`}</p>
                      <button
                        onClick={() => {
                          setModalAbierto(d); // Abre modal con datos completos
                          setChatActivo(false); // Chat desactivado por ahora
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      >
                        Ver Detalles y Aceptar
                      </button>


                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel lateral derecho */}
        <div className="space-y-6">
          {/* Estadísticas */}
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-700 space-y-2">
            <h3 className="text-gray-800 font-bold mb-1">📈 Estadísticas</h3>
            <p>🧾 Donaciones disponibles: <strong>{totalDisponibles}</strong></p>
            <p>🎯 Coinciden con filtros: <strong>{totalFiltradas}</strong></p>
            <p>✅ Recolecciones realizadas: <strong>{totalHistorial}</strong></p>
            <p>🍽️ Porciones recolectadas: <strong>{totalPorcionesRecolectadas}</strong></p>
            <p>⭐ Evaluación promedio: <strong>{promedioEvaluacion}</strong> / 5</p>
          </div>


          {/* Filtros */}
          {!mostrarHistorial && (
            <div className="bg-white p-4 rounded-xl shadow space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Filtros avanzados</h3>
              <input
                type="text"
                placeholder="Filtrar por tipo de comida..."
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full border px-3 py-1 rounded text-sm"
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full border px-3 py-1 rounded text-sm"
              >
                <option value="">Todas las categorías</option>
                <option value="humano">Consumo humano</option>
                <option value="animal">Consumo animal</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soloCercanas}
                  onChange={(e) => setSoloCercanas(e.target.checked)}
                />
                Mostrar solo cercanas (≤ 5 km)
              </label>
            </div>
          )}

          {/* Contactar */}
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-600">
            <h3 className="text-gray-800 font-semibold mb-2">¿Tienes un problema?</h3>
            <button onClick={() => alert('Redirigiendo a soporte...')} className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm font-semibold">Contactar Administrador</button>
          </div>
        </div>
      </div>

      {/* Modal con mapa y chat */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-xl w-full rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh] p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => { setModalAbierto(null); setChatActivo(false); }} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <FiX size={20} />
              </button>
              <h2 className="text-xl font-bold mb-2">{modalAbierto.titulo}</h2>
              <p className="text-sm text-gray-600">Donador: <strong>{modalAbierto.donador}</strong></p>
              <p className="text-sm text-gray-600 mb-1">Tipo: {modalAbierto.tipo}</p>
              <p className="text-sm text-gray-600 mb-1">Categoría: {modalAbierto.categoria}</p>
              <p className="text-sm text-gray-600 mb-1">Cantidad: {modalAbierto.cantidad} porciones</p>
              <p className="text-sm text-gray-600 mb-1">Fecha límite: {modalAbierto.fechaLimite}</p>
              <p className="text-sm text-gray-700 mb-3">📝 <strong>Descripción:</strong> {modalAbierto.descripcion}</p>

              <img
                src={modalAbierto.imagen}
                alt="Alimento"
                className="w-full h-40 object-cover rounded mb-3"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora estimada de recolección
              </label>
              <input
                type="time"
                onChange={(e) =>
                  setModalAbierto({ ...modalAbierto, horaRecoleccion: e.target.value })
                }
                className="w-full border px-3 py-1 rounded mb-4"
              />

              <p className="text-sm text-gray-700 mt-2">📄 <strong>Descripción:</strong> {modalAbierto.descripcion}</p>
              <p className="text-sm text-gray-700">📅 <strong>Recoger antes de:</strong> 12 horas desde aceptación</p>

              
              <MapContainer center={ubicacionOrganizacion} zoom={14} scrollWheelZoom={false} className="h-64 rounded-lg z-10">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={ubicacionOrganizacion}><Popup>Organización</Popup></Marker>
                <Marker position={modalAbierto.ubicacion}><Popup>{modalAbierto.titulo}</Popup></Marker>
                <Polyline positions={[ubicacionOrganizacion, modalAbierto.ubicacion]} color="blue" />
              </MapContainer>

              {/* Chat */}
              {chatActivo ? (
                (() => {
                  if (!modalAbierto) {
                    return null; // aún no hay modal activo
                  }

                  if (modalAbierto.estado === 'en_proceso') {
                    return chatActivo ? (
                      <div className="mt-4 border p-4 rounded bg-gray-50 space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Chat con Donador</h3>
                        <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
                          {mensajes.map((m, i) => (
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
                          <button onClick={enviarMensaje} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Enviar</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setChatActivo(true)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Chatear con Donador
                      </button>
                    );
                  }

                  return (
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm italic">
                      <span className="text-lg">🔒</span>
                      <span>El chat estará disponible después de aceptar esta donación.</span>
                    </div>
                  );
                })()

              ) : (
                <button onClick={() => setChatActivo(true)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Chatear con Donador
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal historial */}
      <AnimatePresence>
        {modalHistorial && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative"
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

              <h2 className="text-xl font-bold mb-2">{modalHistorial.titulo}</h2>
              <p className="text-sm text-gray-600">Fecha: {modalHistorial.fecha}</p>
              <p className="text-sm text-gray-600">Cantidad: {modalHistorial.cantidad} porciones</p>
              <p className="text-sm text-gray-600">Donador: {modalHistorial.donador}</p>
              <p className="text-sm text-yellow-600 mb-2">
                Evaluación: {'★'.repeat(modalHistorial.evaluacion)}{'☆'.repeat(5 - modalHistorial.evaluacion)}
              </p>

              <img src={modalHistorial.imagen} alt="Donación" className="w-full h-40 object-cover rounded mb-3" />

              {modalHistorial.comprobante ? (
                <>
                  <h3 className="text-sm font-bold text-gray-800 mt-2">Comprobante de Entrega:</h3>
                  <img src={modalHistorial.comprobante} alt="Comprobante" className="mt-1 h-32 w-full object-cover rounded border" />
                </>
              ) : (
                <p className="text-sm text-gray-400 italic mt-2">Aún no se ha subido comprobante.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default DashboardOrganizacion;
