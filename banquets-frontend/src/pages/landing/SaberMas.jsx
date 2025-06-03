import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const estadisticas = [
  {
    titulo: 'Desperdicio en México',
    dato: '94 kg por persona al año',
    descripcion: 'México está entre los países que más desperdician alimentos en Latinoamérica.',
    fuente: 'UNEP Food Waste Index Report 2021'
  },
  {
    titulo: 'Impacto Ambiental',
    dato: '8-10% de emisiones globales',
    descripcion: 'El desperdicio de alimentos representa una gran fuente de emisiones de gases de efecto invernadero.',
    fuente: 'FAO, 2019'
  },
  {
    titulo: 'Potencial de Rescate',
    dato: '1 comida por kg',
    descripcion: 'Cada kilogramo rescatado puede representar una comida servida a quien la necesita.',
    fuente: 'Feeding America'
  },
  {
    titulo: 'BanQuets en BCS',
    dato: 'Más de 150 recolecciones',
    descripcion: 'Nuestra plataforma ya ayuda en La Paz, Los Cabos y Comondú.',
    fuente: 'Datos internos de BanQuets'
  },
  {
    titulo: 'Hoteles y Restaurantes',
    dato: '15% de excedente promedio',
    descripcion: 'Muchos negocios desechan alimento perfectamente consumible por falta de logística.',
    fuente: 'Estudio de la industria hotelera, 2022'
  },
  {
    titulo: 'Desperdicio Global',
    dato: '1.05 mil millones de toneladas en 2022',
    descripcion: 'En 2022 se generaron 1.05 mil millones de toneladas de desperdicio de alimentos a nivel mundial.',
    fuente: 'UNEP, 2023'
  },
  {
    titulo: 'Hambre Mundial',
    dato: '783 millones de personas',
    descripcion: 'A pesar del desperdicio, 783 millones de personas sufren de hambre crónica.',
    fuente: 'AP News, 2023'
  },
  {
    titulo: 'Emisiones de Metano',
    dato: '58% de emisiones fugitivas',
    descripcion: 'El desperdicio de alimentos en vertederos contribuye al 58% de las emisiones fugitivas de metano.',
    fuente: 'EPA, 2023'
  },
  {
    titulo: 'Costo Económico',
    dato: '$1 billón anuales',
    descripcion: 'El desperdicio de alimentos cuesta a la economía global aproximadamente $1 billón cada año.',
    fuente: 'UNEP, 2023'
  },
  {
    titulo: 'Superficie Agrícola',
    dato: '28% del suelo agrícola',
    descripcion: 'El 28% de la superficie agrícola mundial se utiliza para producir alimentos que nunca se consumen.',
    fuente: 'FAO, 2019'
  },
  {
    titulo: 'Consumo de Agua',
    dato: '250 km³ anuales',
    descripcion: 'El desperdicio de alimentos representa un desperdicio de 250 km³ de agua cada año.',
    fuente: 'FAO, 2019'
  },
  {
    titulo: 'Pérdidas en la Cadena de Suministro',
    dato: '14% después de la cosecha',
    descripcion: 'El 14% de los alimentos se pierde después de la cosecha y antes de llegar al consumidor.',
    fuente: 'FAO, 2019'
  },
  {
    titulo: 'Desperdicio en Hogares',
    dato: '60% del total',
    descripcion: 'Los hogares son responsables del 60% del desperdicio de alimentos a nivel mundial.',
    fuente: 'UNEP, 2023'
  },
  {
    titulo: 'Desperdicio en Restaurantes',
    dato: '15% de la comida servida',
    descripcion: 'En promedio, el 15% de la comida servida en restaurantes se desperdicia.',
    fuente: 'NPR, 2022'
  },
  {
    titulo: 'Recuperación de Alimentos',
    dato: '4 mil millones de libras',
    descripcion: 'Feeding America recupera 4 mil millones de libras de alimentos cada año.',
    fuente: 'Feeding America'
  }
];

const SaberMas = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-16 text-center">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        ¿Sabías esto sobre los desperdicios de alimentos en México?
      </motion.h1>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {estadisticas.map((e, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-700 mb-2">{e.titulo}</h2>
            <p className="text-3xl font-extrabold text-green-600 mb-2">{e.dato}</p>
            <p className="text-sm text-gray-600 mb-2">{e.descripcion}</p>
            <p className="text-xs text-gray-400">Fuente: {e.fuente}</p>
          </motion.div>
        ))}
      </div>

      <Link to="/" className="mt-12 inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow hover:bg-yellow-500 transition">
        Volver al inicio
      </Link>
    </div>
  );
};

export default SaberMas;
