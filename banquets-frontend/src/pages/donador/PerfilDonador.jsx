import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import api from '../../services/axios'; // Importa tu instancia de axios

const iconoPersonalizado = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const PerfilDonador = () => {
  const { user, updateUserContext } = useAuth(); // Obtén el user del contexto y la función para actualizarlo
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: 'Cargando dirección...', // Placeholder mientras carga
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false); // Renombrado para claridad
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');


  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.token) { // Asegúrate de que el token exista para la petición
        try {
          const response = await api.get('/usuarios/me'); // Endpoint para obtener datos del usuario logueado
          const userData = response.data;

          setFormData({
            nombre: userData.nombre || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            // Aquí, la dirección debería venir de la relación de Usuario con Direccion
            // Por ahora, si no tienes un endpoint específico para la dirección, puede ser un placeholder
            // O podrías hacer otra llamada a api.get(`/direcciones/usuario/${userData.idUsuario}`) si existe ese endpoint.
            direccion: 'Dirección no disponible directamente en /usuarios/me' // Ajustar según tu API
          });
          setLoading(false);
        } catch (err) {
          console.error('Error al cargar el perfil del donador:', err);
          setError('No se pudo cargar la información del perfil.');
          setLoading(false);
        }
      } else {
        setLoading(false); // No hay usuario, no hay que cargar
      }
    };

    fetchUserProfile();
  }, [user]); // Vuelve a cargar si el objeto user cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prevL, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Envía solo los campos actualizables al backend
      const response = await api.put('/usuarios/me', {
        nombre: formData.nombre,
        telefono: formData.telefono
      });
      // Actualiza el contexto de usuario si el nombre cambió
      if (user.nombre !== response.data.nombre) {
        updateUserContext({ nombre: response.data.nombre });
      }
      setMensajeExito('Perfil actualizado con éxito');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError('No se pudo actualizar el perfil.');
    }
  };

  const handleCambiarPassword = async () => {
    setError('');
    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!nuevaPassword.trim()) {
      setError('La nueva contraseña no puede estar vacía.');
      return;
    }

    try {
      await api.put('/usuarios/me/password', nuevaPassword, { // Enviar la contraseña como String en el body
        headers: {
          'Content-Type': 'text/plain' // Importante: para enviar un String plano
        }
      });
      setMensajeExito('Contraseña actualizada con éxito');
      setMostrarModalPassword(false);
      setNuevaPassword('');
      setConfirmarPassword('');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError('No se pudo actualizar la contraseña. Intenta de nuevo.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">Cargando perfil...</div>;
  }

  // La ubicación del mapa será estática por ahora, ya que la entidad Direccion no se carga aquí.
  // Podrías añadir un estado para la latitud/longitud si tu API de /usuarios/me las devuelve o si obtienes la dirección de otra forma.
  const mapCenter = [23.0505, -109.7005]; // Coordenadas fijas de ejemplo

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center relative">
      <button className="absolute top-4 right-6 text-gray-600 hover:text-black text-2xl" onClick={() => window.history.back()}>
        ↩️ Inicio
      </button>
      <h1 className="text-3xl font-extrabold text-green-700 mb-6">Mi Perfil</h1>

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl z-10">
        <div className="flex flex-col items-center mb-6">
          <img src="https://i.pravatar.cc/120" alt="Foto de perfil"
            className="w-32 h-32 rounded-full shadow-md mb-2 object-cover" />
          <button className="text-sm text-blue-500 hover:underline">Cambiar Foto</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Donador</label>
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
              readOnly
              className="mt-1 block w-full rounded-lg bg-gray-100 border-gray-300 shadow-sm cursor-not-allowed"
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
            {/* Si necesitas mostrar la dirección real aquí, tendrías que cargarla del backend */}
            <p className="text-sm text-gray-600 mt-1">{formData.direccion}</p>
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '200px' }} className="z-10">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapCenter} icon={iconoPersonalizado} />
            </MapContainer>
          </div>
          {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
              Actualizar Perfil
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMostrarModalPassword(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mostrarModalPassword && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setMostrarModalPassword(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h2>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full mb-3 border px-3 py-2 rounded"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full mb-4 border px-3 py-2 rounded"
              />
              {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
              <div className="flex justify-between">
                <button
                  onClick={handleCambiarPassword}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrarModalPassword(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de éxito flotante */}
      <AnimatePresence>
        {mensajeExito && (
          <motion.div
            key="exito"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {mensajeExito}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerfilDonador;