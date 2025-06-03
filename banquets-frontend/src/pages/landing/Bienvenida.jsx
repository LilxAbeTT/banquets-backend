import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import carSound from '../../audio/car.mp3';

const todasLasNotas = [
  '💡 En BCS se desperdician\nmás de 4 toneladas de comida al día',
  '🥗 El 30% del alimento\ndonado termina en la basura',
  '♻️ Donar puede alimentar\na más de 150 personas',
  '📦 Hoteles desechan buffets completos todas las semanas',
  '🚚 BanQuets ha facilitado\ncientos de recolecciones',
  '🌍 México desperdicia 94 kg\nde comida por persona',
  '🤝 Un solo donador puede abastecer\na 3 refugios en un día',
  '🍛 Cada porción salvada\nes una historia rescatada',
  '📊 Solo el 3% de alimentos\nse rescatan en México',
  '📍 BanQuets opera en 3 municipios\nde Baja California Sur',
  '🛒 Restaurantes pierden hasta el 15% por excedentes',
  '🥫 1 de cada 3 latas\nno se consume en hoteles',
  '👨‍👩‍👧‍👦 1 tonelada puede alimentar\na 100 familias',
  '🧃 Jugos sellados\nson desechados sin abrir',
  '🔁 Un solo clic\npuede cambiar vidas',
  '📱 Usa BanQuets desde\ncualquier dispositivo',
  '🕓 Cada minuto sin donar\nes una porción perdida',
  '📣 Únete a más de 100\ndonadores activos'
];

const Bienvenida = () => {
  const [indiceGrupo, setIndiceGrupo] = useState(0);
  const audioRef = useRef(null);
  const notasPorGrupo = 6;
  const totalGrupos = Math.ceil(todasLasNotas.length / notasPorGrupo);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceGrupo(prev => (prev + 1) % totalGrupos);
    }, 5200);
    return () => clearInterval(intervalo);
  }, [totalGrupos]);

  const notasActuales = todasLasNotas.slice(
    indiceGrupo * notasPorGrupo,
    (indiceGrupo + 1) * notasPorGrupo
  );

  useEffect(() => {
    setTimeout(() => {
      audioRef.current?.play();
    }, 1500); // Delay sincronizado con animación del logo
  }, []);

  return (
    <div className="relative min-h-screen bg-yellow-300 flex flex-col justify-center items-center px-6 text-center overflow-hidden">
      <audio ref={audioRef} src={carSound} />

      {/* Notas flotantes */}
      <AnimatePresence>
  {notasActuales.map((nota, index) => {
    const esIzquierda = index < 3;
    const posicionesTop = ['10%', '40%', '70%', '13%', '43%', '73%'];
    const posicionesLeft = esIzquierda
      ? ['7%', '3%', '7%']
      : ['75%', '80%', '75%'];

    const coloresFondo = [
      'bg-yellow-100',
      'bg-yellow-100',
      'bg-yellow-100',
      'bg-yellow-100',
      'bg-yellow-100',
      'bg-yellow-100'
    ];

    const coloresCinta = [
      'bg-orange-500',
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500'
    ];

    const rotaciones = [-4, -2, 2, 4, -3, 3];

    return (
      <motion.div
        key={nota}
        className={`absolute px-4 py-3 text-base font-semibold shadow-xl rounded-md border border-gray-300 ${coloresFondo[index % coloresFondo.length]}`}
        initial={{ opacity: 0, scale: 0.8, rotate: 0, y: -10 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: rotaciones[index % rotaciones.length],
          y: [0, -3, 0]
        }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{
          delay: 2.7,
          duration: 0.5,
          y: {
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }
        }}
        style={{
          top: posicionesTop[index],
          left: esIzquierda
            ? posicionesLeft[index]
            : posicionesLeft[index - 3],
          whiteSpace: 'pre-line',
          zIndex: 10,
          backgroundImage: 'url(/src/assets/textura-nota.png)',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          boxShadow: '3px 3px 12px rgba(0,0,0,0.2)',
          transformOrigin: 'top center'
        }}
      >
        {/* 🎀 Cinta adhesiva decorativa */}
        <div
          className={`w-6 h-2 rounded-sm absolute -top-2 left-1/2 -translate-x-1/2 shadow-sm z-20 ${coloresCinta[index % coloresCinta.length]}`}
        />
        {nota}
      </motion.div>
    );
  })}
</AnimatePresence>

        {/* Logo animado tipo auto acercándose */}
      <motion.img
        src={logo}
        alt="BanQuets Logo"
        className="w-48 h-48 mt-14 z-10"
        initial={{ y: 200, scale: 0.5, opacity: 0 }}
        animate={{ y: -50, scale: 1.5, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.3, ease: 'easeOut' }}
      />

      {/* Título principal */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 z-20"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Bienvenido a BanQuets
      </motion.h1>

      {/* Descripción */}
      <motion.p
        className="text-lg text-black max-w-xl mb-10 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        Plataforma gratuita para donar alimentos sobrantes de restaurantes, hoteles y eventos, conectando con organizaciones que los necesitan. ¡Juntos reducimos el desperdicio!
      </motion.p>

      {/* Botones */}
      <motion.div
        className="flex gap-8 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link to="/login" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-gray-700 transition">
          Iniciar Sesión
        </Link>
        <Link to="/registro" className="bg-white border-2 border-green-600 text-green-700 px-6 py-2 rounded-full font-bold shadow hover:bg-green-100 transition">
          Registro
        </Link>

        <Link to="/saber-mas" className="bg-white border border-gray-800 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
          Saber más...
        </Link>

      </motion.div>


    </div>
  );
};

export default Bienvenida;
