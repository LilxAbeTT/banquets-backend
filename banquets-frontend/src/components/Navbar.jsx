
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const usuario = {
    nombre: 'Donador/Organización',
    foto: logo
  };

  const opciones = [
    { label: 'Ver Perfil', path: '/donador/perfil' },
    { label: 'Soporte', path: '/soporte/chat' },
    { label: 'Configuración', path: '/donador/configuracion' },
    { label: 'Cerrar sesión', path: '/' },
  ];

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
                <div className="flex flex-col items-center mb-4">
                  <img src={usuario.foto} alt="Perfil" className="w-16 h-16 rounded-full object-cover mb-2" />
                  <p className="text-gray-800 font-semibold text-center">{usuario.nombre}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {opciones.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMenuAbierto(false);
                        navigate(opt.path);
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
