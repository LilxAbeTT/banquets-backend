import React, { useState } from 'react';

const ConfiguracionAdmin = () => {
  const [config, setConfig] = useState({
    diasMaximosRecojo: 2,
    mensajeGlobal: '',
    activarMantenimiento: false,
    notificacionEmergente: ''
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarCambios = () => {
    alert('Configuración guardada exitosamente.');
    console.log('Valores actuales:', config);
    // Aquí iría lógica real con axios/fetch
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-800">Configuración del Sistema</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Días máximos para recolección de donaciones
          </label>
          <select
            name="diasMaximosRecojo"
            value={config.diasMaximosRecojo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value={0}>Solo hoy</option>
            <option value={1}>1 día</option>
            <option value={2}>2 días</option>
            <option value={3}>3 días</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Mensaje Global en la plataforma
          </label>
          <textarea
            name="mensajeGlobal"
            value={config.mensajeGlobal}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Ej. ¡Recuerda publicar antes de las 5pm para mayor visibilidad!"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="activarMantenimiento"
            checked={config.activarMantenimiento}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">Activar modo mantenimiento (bloquear acceso general)</label>
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Notificación Emergente
          </label>
          <input
            type="text"
            name="notificacionEmergente"
            value={config.notificacionEmergente}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Ej. Se actualizará el sistema esta noche."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={guardarCambios}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionAdmin;
