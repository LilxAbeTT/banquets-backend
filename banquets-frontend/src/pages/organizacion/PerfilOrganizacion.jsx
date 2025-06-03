import React, { useState } from 'react';

const PerfilOrganizacion = () => {
  const [formData, setFormData] = useState({
    nombre: 'Casa Los Angeles',
    correo: 'cla@organizacion.org',
    telefono: '6249876543',
    direccion: 'Av. Solidaridad 45, Los Cabos, BCS',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-green-700 mb-6">Mi Perfil - Organización</h1>

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl">
        {/* Imagen */}
        <div className="flex flex-col items-center mb-6">
          <img src="https://i.pravatar.cc/120?img=10" alt="Foto de perfil"
            className="w-32 h-32 rounded-full shadow-md mb-2 object-cover" />
          <button className="text-sm text-blue-500 hover:underline">Cambiar Logo</button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la organización</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
              Actualizar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilOrganizacion;
