// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // <--- Importa useAuth

const Navbar = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, logout } = useAuth(); // <--- Obtén el objeto 'user' y la función 'logout' del contexto

  // Determina el nombre del usuario y la foto
  // Si 'user' existe, usa sus datos; de lo contrario, usa placeholders.
  const nombreUsuario = user ? user.nombre : 'Invitado';
  // Puedes tener una foto de perfil real si la guardas en el 'user' del contexto
  const fotoPerfil = logo; // Por ahora, sigue usando el logo como placeholder o una URL de avatar por defecto

  // Opciones de menú condicionales
  const getOpcionesMenu = () => {
    if (user) {
      let opcionesEspecificas = [];
      if (user.tipoUsuario.toLowerCase() === 'donador') {
        opcionesEspecificas = [
          { label: 'Mi Dashboard', path: '/donador/dashboard' },
          { label: 'Mi Perfil', path: '/donador/perfil' },
          { label: 'Publicar Donación', path: '/donador/publicar' },
        ];
      } else if (user.tipoUsuario.toLowerCase() === 'organizacion') {
        opcionesEspecificas = [
          { label: 'Mi Dashboard', path: '/organizacion/dashboard' },
          { label: 'Mi Perfil', path: '/organizacion/perfil' },
        ];
      } else if (user.tipoUsuario.toLowerCase() === 'admin') {
        opcionesEspecificas = [
          { label: 'Panel Admin', path: '/admin/dashboard' },
        ];
      }

      return [
        ...opcionesEspecificas,
        { label: 'Soporte', path: '/soporte/chat' },
        // { label: 'Configuración', path: '/donador/configuracion' }, // Si es una página global de configuración
        { label: 'Cerrar sesión', path: '/', action: logout }, // La acción de logout
      ];
    } else {
      // Opciones para usuarios no logueados
      return [
        { label: 'Iniciar Sesión', path: '/login' },
        { label: 'Registro', path: '/registro' },
        { label: 'Saber más...', path: '/saber-mas' },
      ];
    }
  };

  const opciones = getOpcionesMenu();

  return (
    <>
      <nav className="bg-yellow-400 text-black px-6 py-4 shadow-md flex justify-between items-center relative z-50">
        <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img src={logo} alt="BanQuets Logo" className="h-10 w-10 object-contain" />
            <span className="text-3xl font-bold tracking-wide">BanQuets</span>
          </Link>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-4xl focus:outline-none"
          >
            {menuAbierto ? <FiX /> : <FiMenu />}
          </button>

          <AnimatePresence>
            {menuAbierto && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute right-0 mt-3 w-64 bg-gray-200 rounded-lg shadow-lg p-4 z-50"
              >
                <h2 className="text-lg font-bold text-gray-700 mb-4">Menú</h2>
                {user && ( // Solo muestra la foto y nombre si el usuario está logueado
                  <div className="flex flex-col items-center mb-4">
                    <img src={fotoPerfil} alt="Perfil" className="w-16 h-16 rounded-full object-cover mb-2" />
                    <p className="text-gray-800 font-semibold text-center">{nombreUsuario}</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {opciones.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMenuAbierto(false);
                        if (opt.action) { // Si hay una acción definida (como logout)
                          opt.action();
                        }
                        navigate(opt.path); // Navega después de la acción
                      }}
                      className="text-left w-full px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-yellow-100 text-gray-800 font-medium transition"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navbar;