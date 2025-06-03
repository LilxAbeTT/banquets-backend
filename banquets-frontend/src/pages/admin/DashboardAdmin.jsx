import React, { useState, useEffect } from 'react';
import { FiUsers, FiSettings, FiFileText, FiBarChart2, FiMessageSquare, FiCheckSquare } from 'react-icons/fi';
import UsuariosAdmin from './UsuariosAdmin';
import SolicitudesAdmin from './SolicitudesAdmin';
import BitacoraAdmin from './BitacoraAdmin';
import ConfiguracionAdmin from './ConfiguracionAdmin';
import SoporteAdmin from './SoporteAdmin';
import api from '../../services/axios';

const tabs = [
  { id: 'estadisticas', label: 'Estadísticas', icon: <FiBarChart2 />, countKey: null },
  { id: 'usuarios', label: 'Gestión de Usuarios', icon: <FiUsers />, countKey: null },
  { id: 'solicitudes', label: 'Solicitudes', icon: <FiCheckSquare />, countKey: 'solicitudes' },
  { id: 'bitacora', label: 'Bitácora', icon: <FiFileText />, countKey: null },
  { id: 'configuracion', label: 'Configuración', icon: <FiSettings />, countKey: null },
  { id: 'soporte', label: 'Soporte', icon: <FiMessageSquare />, countKey: 'soporte' }
];

const DashboardAdmin = () => {
  const [activo, setActivo] = useState('estadisticas');
  const [conteos, setConteos] = useState({
    solicitudes: 0,
    soporte: 0
  });

  useEffect(() => {
    const cargarConteos = async () => {
      try {
        const [solRes, sopRes] = await Promise.all([
          api.get('/solicitudes/pendientes/count'),
          api.get('/mensajes/soporte/count')
        ]);
        setConteos({
          solicitudes: solRes.data,
          soporte: sopRes.data
        });
      } catch (err) {
        console.error('Error al cargar conteos:', err);
      }
    };

    cargarConteos();
    const intervalo = setInterval(cargarConteos, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const renderContenido = () => {
    switch (activo) {
      case 'estadisticas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Usuarios Registrados', value: 123 },
              { title: 'Donaciones Totales', value: 238 },
              { title: 'Recolecciones Completadas', value: 189 },
              { title: 'Solicitudes Pendientes', value: conteos.solicitudes },
              { title: 'Reportes Recibidos', value: 4 },
              { title: 'Promedio de Evaluaciones', value: '4.7 / 5' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-sm text-gray-500 mb-1">{item.title}</h3>
                <p className="text-3xl font-bold text-green-700">{item.value}</p>
              </div>
            ))}
          </div>
        );
      case 'usuarios': return <UsuariosAdmin />;
      case 'solicitudes': return <SolicitudesAdmin />;
      case 'bitacora': return <BitacoraAdmin />;
      case 'configuracion': return <ConfiguracionAdmin />;
      case 'soporte': return <SoporteAdmin />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Panel del Administrador</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => {
          const count = tab.countKey ? conteos[tab.countKey] : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActivo(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full border transition font-semibold ${activo === tab.id
                ? 'bg-green-600 text-white border-green-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              {tab.icon}
              {tab.label}
              {typeof count === 'number' && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shadow">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-xl shadow p-6">{renderContenido()}</div>
    </div>
  );
};

export default DashboardAdmin;
