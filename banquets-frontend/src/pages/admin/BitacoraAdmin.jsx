import React, { useState } from 'react';
import { FiSearch, FiEye, FiAlertCircle, FiMail } from 'react-icons/fi';

const datosBitacora = [
  { id: 1, usuario: 'admin@banquets.org', accion: 'Aprobó solicitud de Hotel Paraíso', tipo: 'aprobacion', fecha: '2025-05-10 14:22' },
  { id: 2, usuario: 'vidanta@hotel.com', accion: 'Publicó nueva donación (Buffet Evento)', tipo: 'donacion', fecha: '2025-05-10 13:40' },
  { id: 3, usuario: 'casaangeles@org.org', accion: 'Aceptó donación de croquetas', tipo: 'donacion', fecha: '2025-05-09 17:55' },
  { id: 4, usuario: 'admin@banquets.org', accion: 'Rechazó solicitud de Comedor Esperanza', tipo: 'rechazo', fecha: '2025-05-09 16:30' },
  { id: 5, usuario: 'elgranrestaurante@donador.com', accion: 'Actualizó perfil de donador', tipo: 'perfil', fecha: '2025-05-08 11:15' }
];

const BitacoraAdmin = () => {
  const [filtro, setFiltro] = useState('');

  const registrosFiltrados = datosBitacora.filter((reg) =>
    reg.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
    reg.accion.toLowerCase().includes(filtro.toLowerCase())
  );

  const colorPorTipo = {
    aprobacion: 'text-green-700',
    donacion: 'text-blue-700',
    rechazo: 'text-red-600',
    perfil: 'text-yellow-600',
    otro: 'text-gray-700'
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Bitácora del Sistema</h2>

      <div className="flex items-center gap-2">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por usuario o acción..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Usuario</th>
              <th className="py-2 px-4">Acción</th>
              <th className="py-2 px-4">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 px-4 text-gray-500 whitespace-nowrap">{r.fecha}</td>
                <td className="py-2 px-4 font-medium text-blue-700">{r.usuario}</td>
                <td className={`py-2 px-4 ${colorPorTipo[r.tipo] || colorPorTipo.otro}`}>{r.accion}</td>
                <td className="py-2 px-4 space-x-2 text-center">
                  <button title="Ver perfil"
                    className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800">
                    <FiEye />
                  </button>
                  <button title="Reportar incidente"
                    className="inline-flex items-center p-1.5 text-red-600 hover:text-red-800">
                    <FiAlertCircle />
                  </button>
                  <button title="Contactar usuario"
                    className="inline-flex items-center p-1.5 text-gray-600 hover:text-black">
                    <FiMail />
                  </button>
                </td>
              </tr>
            ))}
            {registrosFiltrados.length === 0 && (
  <tr><td colSpan="4" className="text-center py-4 text-gray-500">Sin resultados</td></tr>
)}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BitacoraAdmin;
