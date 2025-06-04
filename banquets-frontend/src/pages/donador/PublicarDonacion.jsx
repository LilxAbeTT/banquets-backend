import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/axios'; // Importa tu instancia de axios

const PublicarDonacion = () => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    // La fechaLimite en el backend es DATETIME, aquí la manejaremos como 'YYYY-MM-DD'
    fechaLimite: '',
    imagen: null, // Objeto File
    imagenPreview: '', // URL para la vista previa
    // Valores por defecto para la ubicación (puedes cambiarlos a algo más centrado en tu área)
    ubicacion: { lat: 23.047447, lng: -109.692861 },
    // Nuevos campos según tu entidad Donacion y ModalPublicarDonacion
    tipo: '', // 'comida preparada', 'comida seca', 'productos frescos'
    categoria: '', // 'humano', 'animal'
    cantidad: '', // Integer
    empacado: false, // Boolean
    estadoComida: '' // 'En buen estado', 'Refrigerado', 'Congelado'
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFormulario(prev => ({
        ...prev,
        imagen: archivo,
        imagenPreview: URL.createObjectURL(archivo)
      }));
    } else {
      setFormulario(prev => ({
        ...prev,
        imagen: null,
        imagenPreview: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas (puedes añadir más si es necesario)
    if (!formulario.titulo || !formulario.descripcion || !formulario.fechaLimite || !formulario.imagen ||
        !formulario.tipo || !formulario.categoria || !formulario.cantidad || !formulario.estadoComida) {
      setError("Por favor, completa todos los campos obligatorios y sube una imagen.");
      return;
    }

    setCargando(true);

    try {
      // Para enviar archivos (como la imagen), usaremos FormData
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formulario.titulo);
      formDataToSend.append('descripcion', formulario.descripcion);
      formDataToSend.append('fechaLimite', formulario.fechaLimite); // Se envía como string, el backend debe parsearlo
      formDataToSend.append('latitud', formulario.ubicacion.lat);
      formDataToSend.append('longitud', formulario.ubicacion.lng);
      formDataToSend.append('tipo', formulario.tipo);
      formDataToSend.append('categoria', formulario.categoria);
      formDataToSend.append('cantidad', formulario.cantidad);
      formDataToSend.append('empacado', formulario.empacado);
      formDataToSend.append('estadoComida', formulario.estadoComida);

      // Si tienes el campo de imagen en tu entidad Donacion como VARBINARY(MAX),
      // necesitas que el backend lo reciba como MultipartFile.
      // El frontend envía el archivo directamente.
      if (formulario.imagen) {
        formDataToSend.append('imagen', formulario.imagen);
      }

      // Realiza la petición POST a tu backend
      const response = await api.post('/donaciones', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data' // ¡Importante para enviar FormData!
        }
      });

      console.log('Donación publicada con éxito:', response.data);
      alert("Donación publicada exitosamente!");
      navigate('/donador/dashboard'); // Redirige al dashboard después de la publicación
    } catch (err) {
      console.error('Error al publicar la donación:', err.response ? err.response.data : err.message);
      setError('Error al publicar la donación. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setFormulario(prev => ({
          ...prev,
          ubicacion: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        }));
      }
    });
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Publicar Nueva Donación</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-4">

        <div>
          <label className="block text-gray-700 mb-1">Título de la publicación</label>
          <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange}
            className="w-full border rounded-lg p-2" placeholder="Ej. Desayuno Buffet Sobrante" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Descripción detallada</label>
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange}
            className="w-full border rounded-lg p-2" rows="4" placeholder="Detalle de los alimentos..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Tipo de alimento</label>
            <select name="tipo" value={formulario.tipo} onChange={handleChange}
              className="w-full border rounded-lg p-2">
              <option value="">Selecciona un tipo</option>
              <option value="Comida preparada">Comida preparada</option>
              <option value="Comida seca">Comida seca</option>
              <option value="Productos frescos">Productos frescos</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">¿Para quién?</label>
            <select name="categoria" value={formulario.categoria} onChange={handleChange}
              className="w-full border rounded-lg p-2">
              <option value="">Selecciona categoría</option>
              <option value="humano">Consumo humano</option>
              <option value="animal">Consumo animal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Cantidad de porciones</label>
            <input type="number" name="cantidad" value={formulario.cantidad} onChange={handleChange}
              className="w-full border rounded-lg p-2" placeholder="Ej. 50" min="1" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Estado del alimento</label>
            <select name="estadoComida" value={formulario.estadoComida} onChange={handleChange}
              className="w-full border rounded-lg p-2">
              <option value="">Selecciona el estado</option>
              <option value="En buen estado">En buen estado</option>
              <option value="Refrigerado">Refrigerado</option>
              <option value="Congelado">Congelado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" name="empacado" checked={formulario.empacado} onChange={handleChange} />
            ¿Está empacado individualmente?
          </label>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Fecha límite para recoger</label>
          <input type="date" name="fechaLimite" value={formulario.fechaLimite} onChange={handleChange}
            className="w-full border rounded-lg p-2" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Foto del alimento</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border rounded-lg p-2" />
          {formulario.imagenPreview && (
            <img src={formulario.imagenPreview} alt="Vista previa" className="mt-3 rounded-xl h-40 object-cover" />
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Ubicación de entrega (clic en el mapa para seleccionar)</label>
          <div className="rounded-lg overflow-hidden h-64 border border-gray-300">
            <MapContainer center={formulario.ubicacion} zoom={14} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={formulario.ubicacion} />
              <LocationSelector />
            </MapContainer>
          </div>
          <p className="text-xs mt-1 text-gray-500">Da clic en el mapa para cambiar la ubicación.</p>
        </div>

        {error && <p className="text-sm text-red-500 font-medium mt-2 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl mt-4 flex items-center justify-center gap-2"
          disabled={cargando}
        >
          {cargando ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Publicar Donación'
          )}
        </button>
      </form>
    </div>
  );
};

export default PublicarDonacion;