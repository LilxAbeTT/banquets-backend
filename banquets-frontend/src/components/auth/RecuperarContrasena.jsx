import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setEnviando(true);

    try {
      const res = await axios.post('/api/usuarios/recuperar-contrasena', { correo });
      setMensaje(res.data.mensaje || 'Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar el correo. Verifica que el correo esté registrado.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Recuperar contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
          >
            {enviando ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Volver al login</Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
