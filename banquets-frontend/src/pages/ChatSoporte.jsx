import React, { useState } from 'react';

const ChatSoporte = () => {
  const [mensajes, setMensajes] = useState([
    { id: 1, emisor: 'usuario', texto: 'Hola, necesito ayuda con mi publicación.' },
    { id: 2, emisor: 'admin', texto: '¡Hola! Claro, ¿en qué puedo ayudarte?' }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    setMensajes([...mensajes, { id: Date.now(), emisor: 'usuario', texto: nuevoMensaje }]);
    setNuevoMensaje('');
    // Aquí deberías enviar al backend con fetch/axios
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Soporte en Línea</h1>
      <div className="w-full max-w-xl bg-white shadow rounded-xl p-4 flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg max-w-[70%] text-sm ${
                msg.emisor === 'usuario'
                  ? 'bg-green-100 self-end text-right'
                  : 'bg-gray-200 self-start text-left'
              }`}
            >
              {msg.texto}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            type="text"
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={enviarMensaje}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSoporte;