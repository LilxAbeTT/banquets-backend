import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleRecuperar = () => {
    if (!email) {
      setError('Por favor ingresa tu correo.');
      return;
    }
    setError('');
    setEnviado(true);
    console.log('Se ha enviado enlace de recuperación a:', email);
    // Aquí va tu lógica real para enviar correo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperar Contraseña</h1>

        {enviado ? (
          <div className="text-center text-green-600 font-medium">
            Hemos enviado un enlace a tu correo para restablecer tu contraseña.
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-center mb-4">
              Ingresa tu correo registrado y recibirás instrucciones para restablecer tu contraseña.
            </p>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}

            <button
              onClick={handleRecuperar}
              className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-full transition"
            >
              Enviar instrucciones
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RecuperarPassword;
