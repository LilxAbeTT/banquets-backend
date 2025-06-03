import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PublicarDonacion = () => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    imagen: null,
    imagenPreview: '',
    ubicacion: { lat: 23.047447, lng: -109.692861 }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFormulario(prev => ({
        ...prev,
        imagen: archivo,
        imagenPreview: URL.createObjectURL(archivo)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.descripcion || !formulario.fechaLimite || !formulario.imagen) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    alert("Donación preparada para enviar (aún sin conexión real).");
    navigate('/donador/dashboard');
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
          <label className="block text-gray-700 mb-1">Nombre del alimento</label>
          <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange}
            className="w-full border rounded-lg p-2" placeholder="Ej. Desayuno Buffet" />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Descripción</label>
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange}
            className="w-full border rounded-lg p-2" rows="4" placeholder="Detalle de los alimentos..." />
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
          <label className="block text-gray-700 mb-2">Ubicación de entrega</label>
          <div className="rounded-lg overflow-hidden h-64 border border-gray-300">
            <MapContainer center={formulario.ubicacion} zoom={14} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={formulario.ubicacion} />
              <LocationSelector />
            </MapContainer>
          </div>
          <p className="text-xs mt-1 text-gray-500">Da clic en el mapa para cambiar la ubicación.</p>
        </div>

        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl mt-4">
          Publicar Donación
        </button>
      </form>
    </div>
  );
};

export default PublicarDonacion;
