// src/pages/admin/UsuariosAdmin.jsx
import React, { useState } from 'react';

const dataEjemplo = [
  { id: 1, nombre: 'Vidanta Resort', tipo: 'Donador', correo: 'resort@vidanta.com', estado: 'activo' },
  { id: 2, nombre: 'Casa Ángeles', tipo: 'Organización', correo: 'contacto@casaangeles.org', estado: 'suspendido' },
  { id: 3, nombre: 'Hotel Oasis', tipo: 'Donador', correo: 'donador@oasis.com', estado: 'activo' }
];

const UsuariosAdmin = () => {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState(dataEjemplo);

  const cambiarEstado = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'activo' ? 'suspendido' : 'activo' } : u
      )
    );
  };

  const filtrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Usuarios Registrados</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full border rounded px-4 py-2 mb-4"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Tipo</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 px-4">{u.nombre}</td>
                <td className="py-2 px-4">{u.tipo}</td>
                <td className="py-2 px-4">{u.correo}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.estado}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => cambiarEstado(u.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    {u.estado === 'activo' ? 'Suspender' : 'Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4 text-gray-500">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosAdmin;
