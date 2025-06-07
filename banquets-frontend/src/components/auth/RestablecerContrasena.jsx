import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const RestablecerContrasena = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nueva || !confirmar || nueva !== confirmar) {
      setError('Las contraseñas no coinciden o están vacías.');
      return;
    }

    setEnviando(true);
    try {
      const res = await axios.post('/api/usuarios/restablecer-contrasena', {
        token,
        nuevaContrasena: nueva
      });
      setMensaje(res.data.mensaje || 'Contraseña actualizada correctamente.');
    } catch (err) {
      console.error(err);
      setError('No se pudo restablecer la contraseña. El enlace podría haber expirado.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Restablecer contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full border border-gray-300 rounded-full p-3"
          />
          {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
          >
            {enviando ? 'Enviando...' : 'Cambiar contraseña'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Volver al login</Link>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
