import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ModalPublicarDonacion = ({ onClose, onPublicar }) => {
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    diasMax: '',
    imagen: null,
    imagenPreview: '',
    tipo: '',
    categoria: '',
    empacado: false,
    estadoComida: '',
    cantidad: '',
    fechaLimite: '',
    ubicacion: { lat: 23.047447, lng: -109.692861 } // fija por donador
  });

  const calcularFechaLimite = (dias) => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + parseInt(dias));
    return hoy.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "diasMax") {
      const fechaCalculada = value === "0" ? new Date().toISOString().split("T")[0] : calcularFechaLimite(value);
      setFormulario(prev => ({
        ...prev,
        diasMax: value,
        fechaLimite: fechaCalculada
      }));
    } else {
      setFormulario(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
    const camposObligatorios = ["titulo", "descripcion", "fechaLimite", "tipo", "categoria", "estadoComida", "cantidad"];
    const incompletos = camposObligatorios.some(c => !formulario[c]);
    if (incompletos || !formulario.imagen) {
      alert("Completa todos los campos antes de publicar.");
      return;
    }
    onPublicar(formulario);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-xl relative overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          <FiX size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Publicar Nueva Donación</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange}
            className="w-full border rounded-lg p-2" placeholder="Título de la publicación" />

          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange}
            className="w-full border rounded-lg p-2" rows="3" placeholder="Descripción detallada" />

          <div className="grid grid-cols-2 gap-4">
            <select name="tipo" value={formulario.tipo} onChange={handleChange}
              className="border rounded-lg p-2 w-full">
              <option value="">Tipo de alimento</option>
              <option value="comida preparada">Comida preparada</option>
              <option value="comida seca">Comida seca</option>
              <option value="productos frescos">Productos frescos</option>
            </select>

            <select name="categoria" value={formulario.categoria} onChange={handleChange}
              className="border rounded-lg p-2 w-full">
              <option value="">¿Para quién?</option>
              <option value="humano">Consumo humano</option>
              <option value="animal">Consumo animal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select name="estadoComida" value={formulario.estadoComida} onChange={handleChange}
              className="border rounded-lg p-2 w-full">
              <option value="">Estado del alimento</option>
              <option value="En buen estado">En buen estado</option>
              <option value="Refrigerado">Refrigerado</option>
              <option value="Congelado">Congelado</option>
            </select>

            <input type="number" name="cantidad" value={formulario.cantidad} onChange={handleChange}
              className="w-full border rounded-lg p-2" placeholder="Cantidad de porciones" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="empacado" checked={formulario.empacado} onChange={handleChange} />
            ¿Está empacado?
          </label>

          <select name="diasMax" value={formulario.diasMax} onChange={handleChange}
            className="border rounded-lg p-2 w-full">
            <option value="">¿Hasta cuándo se puede recoger?</option>
            <option value="0">Solo hoy</option>
            <option value="1">En 1 día</option>
            <option value="2">En 2 días</option>
            <option value="3">En 3 días</option>
          </select>

          <input type="file" accept="image/*" onChange={handleImageChange}
            capture="environment" className="w-full border rounded-lg p-2" />
          {formulario.imagenPreview && (
            <img src={formulario.imagenPreview} alt="Vista previa" className="mt-2 rounded-xl h-40 object-cover" />
          )}

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700">
            Publicar Donación
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModalPublicarDonacion;
