import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi'; // Icono para cerrar, se usará en el botón Cancelar también
import api from '../services/axios'; // Importa tu instancia de axios
import { useAuth } from '../context/AuthContext'; // Para obtener el ID del usuario

const ModalPublicarDonacion = ({ onClose, onPublicarExito }) => {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    tipo: '', // 'Comida preparada', 'Comida seca', 'Productos frescos'
    categoria: '', // 'humano', 'animal'
    cantidad: '', // Integer
    empacado: false, // Boolean
    estadoComida: '', // 'En buen estado', 'Refrigerado', 'Congelado'
    diasMax: '', // Número de días desde hoy
    fechaLimite: '', // Calculada basada en diasMax
    imagen: null, // Objeto File
    imagenPreview: '', // URL para la vista previa
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Si cambia 'diasMax', también actualiza 'fechaLimite'
    if (name === "diasMax") {
      const dias = parseInt(value);
      let fechaCalculada = '';
      if (!isNaN(dias) && dias >= 0) {
        const hoy = new Date();
        hoy.setDate(hoy.getDate() + dias);
        fechaCalculada = hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      }
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
    } else {
      // Si el usuario cancela la selección de archivo o elimina uno
      setFormulario(prev => ({
        ...prev,
        imagen: null,
        imagenPreview: ''
      }));
    }
    // Asegurar que el input de archivo se resetea visualmente
    e.target.value = null;
  };

  const handleRemoveImage = () => {
    setFormulario(prev => ({
      ...prev,
      imagen: null,
      imagenPreview: ''
    }));
    const fileInput = document.getElementById('imagen-upload');
    if (fileInput) fileInput.value = ''; // Limpiar el input file visualmente
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    const camposObligatorios = ["titulo", "descripcion", "diasMax", "tipo", "categoria", "cantidad", "estadoComida"];
    const incompletos = camposObligatorios.some(campo => !formulario[campo]);

    if (incompletos) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    // La imagen ya no es obligatoria, así que la quitamos de la validación crítica.

    setCargando(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formulario.titulo);
      formDataToSend.append('descripcion', formulario.descripcion);
      formDataToSend.append('fechaLimite', formulario.fechaLimite);
      // Para la latitud y longitud, usa los datos del perfil del usuario (si existen)
      // Asegúrate de que el objeto 'user' en tu AuthContext tenga estas propiedades
      formDataToSend.append('latitud', user.latitud || 23.047447); // Valor por defecto si no está en user
      formDataToSend.append('longitud', user.longitud || -109.692861); // Valor por defecto si no está en user
      formDataToSend.append('tipo', formulario.tipo);
      formDataToSend.append('categoria', formulario.categoria);
      formDataToSend.append('cantidad', formulario.cantidad);
      formDataToSend.append('empacado', formulario.empacado);
      formDataToSend.append('estadoComida', formulario.estadoComida);

      if (formulario.imagen) { // Adjunta la imagen solo si existe
        formDataToSend.append('imagen', formulario.imagen);
      }

      const response = await api.post('/donaciones', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Donación publicada con éxito:', response.data);
      onPublicarExito("✅ Donación publicada exitosamente!"); // Llama al callback de éxito en el padre
      onClose(); // Cierra el modal
    } catch (err) {
      console.error('Error al publicar la donación:', err.response ? err.response.data : err.message);
      setError('Error al publicar la donación. ' + (err.response?.data?.message || 'Intenta de nuevo.'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-xl relative overflow-y-auto max-h-[95vh]"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Publicar Nueva Donación</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          <div>
            <label className="block text-gray-700 mb-1">Título de la publicación <span className="text-red-500">*</span></label>
            <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange}
              className="w-full border rounded-lg p-2" placeholder="Ej. Desayuno Buffet Sobrante" />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Descripción detallada <span className="text-red-500">*</span></label>
            <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange}
              className="w-full border rounded-lg p-2" rows="3" placeholder="Detalle de los alimentos..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tipo de alimento <span className="text-red-500">*</span></label>
              <select name="tipo" value={formulario.tipo} onChange={handleChange}
                className="w-full border rounded-lg p-2">
                <option value="">Selecciona un tipo</option>
                <option value="Comida preparada">Comida preparada</option>
                <option value="Comida seca">Comida seca</option>
                <option value="Productos frescos">Productos frescos</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Consumo: <span className="text-red-500">*</span></label>
              <select name="categoria" value={formulario.categoria} onChange={handleChange}
                className="w-full border rounded-lg p-2">
                <option value="">Selecciona categoría</option>
                <option value="humano">Humano</option>
                <option value="animal">Animal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Cantidad de porciones <span className="text-red-500">*</span></label>
              <input type="number" name="cantidad" value={formulario.cantidad} onChange={handleChange}
                className="w-full border rounded-lg p-2" placeholder="Ej. 50" min="1" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Estado del alimento <span className="text-red-500">*</span></label>
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
            <label className="block text-gray-700 mb-1">¿Hasta cuándo se puede recoger? <span className="text-red-500">*</span></label>
            <select name="diasMax" value={formulario.diasMax} onChange={handleChange}
              className="w-full border rounded-lg p-2">
              <option value="">Selecciona un plazo</option>
              <option value="0">Solo hoy</option>
              <option value="1">1 día más</option>
              <option value="2">2 días más</option>
              <option value="3">3 días más</option>
            </select>
            {formulario.fechaLimite && (
              <p className="text-xs text-gray-500 mt-1">Fecha límite calculada: {formulario.fechaLimite}</p>
            )}
          </div>

          <div>
            <label htmlFor="imagen-upload" className="block text-gray-700 mb-1">Foto del alimento (opcional)</label>
            <input type="file" id="imagen-upload" accept="image/*" onChange={handleImageChange} className="w-full border rounded-lg p-2" />
            {formulario.imagenPreview && (
              <div className="relative mt-3">
                <img src={formulario.imagenPreview} alt="Vista previa" className="rounded-xl h-40 object-cover w-full" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition"
                  aria-label="Eliminar imagen"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 font-medium mt-2 text-center">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              disabled={cargando}
            >
              {cargando ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Publicar Donación'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModalPublicarDonacion;