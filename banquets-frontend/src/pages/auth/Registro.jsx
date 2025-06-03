import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

const iconoPersonalizado = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Unirse = () => {
  const navigate = useNavigate();
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [formulario, setFormulario] = useState({
    nombre: '', correo: '', telefono: '', tipoUsuario: 'donador',
    nombreEmpresa: '', descripcion: '', direccion: '', rfc: '', url: '',
    aceptarTerminos: false,
    comprobantePDF: null,
  });
  const [posicion, setPosicion] = useState({ lat: 23.0505, lng: -109.7005 });

  const obtenerDireccion = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data?.display_name) {
        setFormulario((prev) => ({ ...prev, direccion: data.display_name }));
      }
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
    }
  };

  useEffect(() => {
    obtenerDireccion(posicion.lat, posicion.lng);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormulario({ ...formulario, [name]: checked });
    } else if (type === 'file') {
      setFormulario({ ...formulario, comprobantePDF: files[0] });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formulario.aceptarTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    if (captchaInput.trim().toLowerCase() !== 'banquets') {
      alert('Captcha incorrecto');
      return;
    }

    // Crear objeto para enviar, omitiendo comprobantePDF por ahora
    const dataToSend = {
      nombre: formulario.nombre,
      correo: formulario.correo,
      telefono: formulario.telefono,
      tipoUsuario: formulario.tipoUsuario,
      nombreEmpresa: formulario.nombreEmpresa,
      descripcion: formulario.descripcion,
      rfc: formulario.rfc,
      url: formulario.url,
      direccion: formulario.direccion,
      latitud: formulario.latitud,
      longitud: formulario.longitud
    };

    try {
      const response = await fetch('http://localhost:8080/api/solicitudes/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      const result = await response.json();
      alert('Solicitud enviada correctamente');
      // Opcional: limpiar formulario o redirigir
    } catch (error) {
      alert('Error enviando solicitud: ' + error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Solicitud de Ingreso a BanQuets</h1>
        <p className="text-gray-600 mb-6">
          Puedes registrarte como <strong>Donador</strong> o <strong>Organización</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Nombre completo</label><input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} required className="w-full border px-3 py-2 rounded" /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label>Correo electrónico</label><input type="email" name="correo" value={formulario.correo} onChange={handleChange} required className="w-full border px-3 py-2 rounded" /></div>
            <div><label>Teléfono</label><input type="text" name="telefono" value={formulario.telefono} onChange={handleChange} required className="w-full border px-3 py-2 rounded" /></div>
          </div>
          <div><label>Tipo de Usuario</label><select name="tipoUsuario" value={formulario.tipoUsuario} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="donador">Donador</option>
            <option value="organizacion">Organización</option>
          </select></div>
          <div><label>Nombre Empresa/Organización</label><input type="text" name="nombreEmpresa" value={formulario.nombreEmpresa} onChange={handleChange} required className="w-full border px-3 py-2 rounded" /></div>
          <div><label>Descripción (tipo de ayuda o alimentos)</label><textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} required className="w-full border px-3 py-2 rounded" /></div>
          <div><label>RFC (opcional)</label><input type="text" name="rfc" value={formulario.rfc} onChange={handleChange} className="w-full border px-3 py-2 rounded" /></div>
          <div><label>Sitio web / Red social (opcional)</label><input type="url" name="url" value={formulario.url} onChange={handleChange} className="w-full border px-3 py-2 rounded" /></div>
          <div><label>Subir comprobante PDF (opcional)</label><input type="file" accept=".pdf" onChange={handleChange} name="comprobantePDF" className="w-full" /></div>

          <div><label>Dirección (se autocompleta desde el mapa)</label><input type="text" name="direccion" value={formulario.direccion} readOnly className="w-full border bg-gray-100 px-3 py-2 rounded cursor-not-allowed" /></div>

          <div>
            <label>Ubicación en el mapa</label>
            <MapContainer center={posicion} zoom={15} scrollWheelZoom={false} style={{ height: '300px', zIndex: 0 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={posicion}
                icon={iconoPersonalizado}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const nuevaPos = e.target.getLatLng();
                    setPosicion(nuevaPos);
                    obtenerDireccion(nuevaPos.lat, nuevaPos.lng);
                  },
                }}
              />
            </MapContainer>
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="aceptarTerminos" checked={formulario.aceptarTerminos} onChange={handleChange} />
              Acepto los <button type="button" onClick={() => setMostrarTerminos(true)} className="text-blue-600 underline">términos y condiciones</button>
            </label>
          </div>

          <div>
            <label>Captcha: escribe <strong>banquets</strong></label>
            <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => navigate('/')} className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Regresar</button>
            <button type="submit" className="px-6 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-700">Enviar solicitud</button>
          </div>
        </form>

        {/* Modal términos */}
        <AnimatePresence>
  {mostrarTerminos && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl relative"
      >
        <button
          onClick={() => setMostrarTerminos(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Términos y Condiciones</h2>
        <p className="text-sm text-gray-700 mb-4">
          Al enviar esta solicitud, autorizas a BanQuets a verificar los datos proporcionados con fines exclusivos de validación de identidad institucional y sin uso comercial. La información será tratada con confidencialidad conforme a la Ley de Protección de Datos Personales en Posesión de Particulares.
        </p>
        <p className="text-sm text-gray-700">
          Podrás solicitar la eliminación de tus datos en cualquier momento enviando un correo a <strong>soporte@banquets.org</strong>.
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
};

export default Unirse;