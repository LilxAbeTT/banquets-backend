import React from 'react';

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-6xl font-bold text-purple-600">404</h1>
      <p className="text-2xl text-gray-800 mt-4">Página no encontrada</p>
      <a href="/" className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl">
        Regresar al Inicio
      </a>
    </div>
  );
};

export default Error404;
