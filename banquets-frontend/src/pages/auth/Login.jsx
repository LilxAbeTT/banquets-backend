// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [correo, setCorreo] = useState(localStorage.getItem('correoGuardado') || '');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(!!localStorage.getItem('correoGuardado'));
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!correo || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    try {
      await login(correo, password);
      const userData = JSON.parse(localStorage.getItem('usuario'));
      const tipoUsuario = userData?.tipoUsuario || null;

      if (recordarme) {
        localStorage.setItem('correoGuardado', correo);
      } else {
        localStorage.removeItem('correoGuardado');
      }

      if (tipoUsuario?.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else if (tipoUsuario?.toLowerCase() === 'donador') {
        navigate('/donador/dashboard');
      } else if (tipoUsuario?.toLowerCase() === 'organizacion') {
        navigate('/organizacion/dashboard');
      } else {
        setError('Rol de usuario no reconocido o faltante.');
      }
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Enlace a recuperar contraseña */}
          <div className="text-sm text-right">
            <Link to="/recuperar-contrasena" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="recordarme"
              checked={recordarme}
              onChange={() => setRecordarme(!recordarme)}
            />
            <label htmlFor="recordarme">Recordarme en este dispositivo</label>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition flex items-center justify-center gap-2"
            disabled={cargando}
          >
            {cargando ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
