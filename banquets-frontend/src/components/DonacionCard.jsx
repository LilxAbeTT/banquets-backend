function DonacionCard({ donacion, onAceptar }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
      {donacion.imagen && (
        <img src={donacion.imagen} alt="donación" className="rounded-xl mb-3 max-h-52 object-cover w-full" />
      )}
      <h3 className="text-lg font-bold text-blue-700">{donacion.categoria}</h3>
      <p className="text-sm text-gray-600">Tipo: {donacion.tipoConsumo}</p>
      <p className="text-sm">Cantidad: {donacion.cantidad}</p>
      <p className="text-sm">Empacado: {donacion.empacado ? 'Sí' : 'No'}</p>
      <p className="text-sm">Estado: {donacion.estadoComida}</p>
      <p className="text-sm italic mt-2">{donacion.descripcion}</p>
      <p className="text-sm text-gray-500 mt-1">Ubicación: {donacion.ubicacion}</p>
      <p className="text-sm text-gray-400">Limite: {new Date(donacion.fechaLimite).toLocaleString()}</p>

      <button
        onClick={() => onAceptar(donacion.id)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
      >
        Aceptar donación
      </button>
    </div>
  );
}

export default DonacionCard;
