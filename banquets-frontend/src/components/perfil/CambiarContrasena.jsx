import React, { useState } from 'react';
import axios from 'axios';

const CambiarContrasena = () => {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (nuevaContrasena !== confirmacion) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/usuarios/cambiar-contrasena',
        {
          contrasenaActual,
          nuevaContrasena,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje('¡Contraseña cambiada correctamente!');
      setContrasenaActual('');
      setNuevaContrasena('');
      setConfirmacion('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Ocurrió un error al cambiar la contraseña.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Cambiar contraseña
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Contraseña actual"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          value={contrasenaActual}
          onChange={(e) => setContrasenaActual(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          required
        />
        {mensaje && (
          <p className="text-green-600 text-sm text-center">{mensaje}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default CambiarContrasena;
