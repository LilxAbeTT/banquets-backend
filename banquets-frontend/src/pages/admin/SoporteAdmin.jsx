import React, { useState } from 'react';
import { FiSend, FiArchive } from 'react-icons/fi';

const mensajesSimulados = [
  { id: 1, usuario: 'vidanta@hotel.com', mensaje: '¿Puedo editar una donación ya publicada?', tipo: 'pregunta', respondido: true },
  { id: 2, usuario: 'admin@banquets.org', mensaje: 'Sí, mientras no haya sido aceptada.', tipo: 'respuesta', respondido: true },
  { id: 3, usuario: 'casaangeles@org.org', mensaje: 'No puedo contactar al donador.', tipo: 'pregunta', respondido: false }
];

const SoporteAdmin = () => {
  const [mensajes, setMensajes] = useState(mensajesSimulados);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [usuarioActivo, setUsuarioActivo] = useState('');
  const [filtro, setFiltro] = useState('');
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const usuarios = [...new Set(mensajes
    .filter((m) =>
      m.usuario.toLowerCase().includes(filtro.toLowerCase()) &&
      (mostrarArchivados || m.tipo === 'pregunta')
    )
    .map((m) => m.usuario))];

  const enviarRespuesta = () => {
    if (!usuarioActivo || !nuevoMensaje.trim()) return;
    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), usuario: usuarioActivo, mensaje: nuevoMensaje, tipo: 'respuesta', respondido: true }
    ]);
    setMensajes((prev) =>
      prev.map((m) =>
        m.usuario === usuarioActivo && m.tipo === 'pregunta' ? { ...m, respondido: true } : m
      )
    );
    setNuevoMensaje('');
  };

  const mensajesUsuario = mensajes.filter((m) => m.usuario === usuarioActivo);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 bg-white rounded-xl shadow p-4 h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Usuarios</h3>

        <input
          type="text"
          placeholder="Buscar correo o nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full mb-3 border px-3 py-2 rounded"
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={mostrarArchivados}
            onChange={() => setMostrarArchivados(!mostrarArchivados)}
          />
          Mostrar archivados
        </label>

        <ul className="space-y-2">
          {usuarios.map((u) => {
            const sinResponder = mensajes.some((m) => m.usuario === u && m.tipo === 'pregunta' && !m.respondido);
            return (
              <li key={u}>
                <button
                  onClick={() => setUsuarioActivo(u)}
                  className={`w-full text-left px-3 py-2 rounded transition font-medium text-sm ${
                    usuarioActivo === u ? 'bg-yellow-200' : 'hover:bg-gray-100'
                  }`}
                >
                  {u} {sinResponder && !mostrarArchivados && (
                    <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Sin responder</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="md:col-span-3 bg-white rounded-xl shadow p-4 flex flex-col h-[70vh]">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Conversación</h3>
        {usuarioActivo ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {mensajesUsuario.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-lg max-w-[80%] text-sm ${
                    m.tipo === 'pregunta'
                      ? 'bg-yellow-100 self-start'
                      : 'bg-green-100 self-end ml-auto'
                  }`}
                >
                  {m.mensaje}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                type="text"
                placeholder="Escribir respuesta..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={enviarRespuesta}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Selecciona un usuario para ver su conversación.</p>
        )}
      </div>
    </div>
  );
};

export default SoporteAdmin;