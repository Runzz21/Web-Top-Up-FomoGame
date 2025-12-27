import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Crown, Calendar, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import Confetti from './Confetti';
import './PromoSlider.css';

const slides = [
  {
    id: 1,
    title: "BONUS +20% DIAMOND",
    subtitle: "Top Up Mobile Legends & Free Fire Sekarang!",
    badge: "HOT OFFER",
    badgeIcon: <Flame size={20} className="fire-text" />,
    cta: "TOP UP SEKARANG",
    icon: <Gem size={60} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 15px #22d3ee)' }} />,
    specialEffect: null,
    gradient: "from-cyan-500/20",
  },
  {
    id: 2,
    title: "DISKON 10% TOP UP PERTAMA",
    subtitle: "New User Exclusive • Berlaku Selamanya",
    badge: "NEW USER",
    badgeIcon: <Crown size={20} className="text-yellow-400" />,
    cta: "DAFTAR & DAPATKAN",
    icon: null,
    specialEffect: <Confetti />,
    gradient: "from-purple-500/20",
  },
  {
    id: 3,
    title: "WEEKLY PASS SUPER HEMAT",
    subtitle: "Diamond Tiap Hari • Hemat Hingga 30%",
    badge: "LIMITED TIME",
    badgeIcon: <Calendar size={20} className="text-red-400" />,
    cta: "BELI PASS SEKARANG",
    price: { old: "Rp50.000", new: "Rp35.000" },
    icon: <Calendar size={60} className="text-pink-500" style={{ filter: 'drop-shadow(0 0 15px #ec4899)' }} />,
    specialEffect: null,
    gradient: "from-pink-500/20",
  },
];

const sliderVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const PromoSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + slides.length) % slides.length, newDirection]);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [page]);

  const slide = slides[page];

  return (
    <div className="relative w-full h-[450px] md:h-[500px] lg:h-[600px] bg-black overflow-hidden rounded-3xl border-2 border-purple-900/50 shadow-2xl shadow-purple-500/20">
      
      {slide.specialEffect}

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={sliderVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className={`absolute w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-8 bg-gradient-to-b ${slide.gradient} to-transparent`}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative z-10 flex flex-col items-center">
             {slide.badge && (
                <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 backdrop-blur-md">
                  {slide.badgeIcon}
                  <span className={`font-bold text-xs sm:text-sm ${slide.id === 1 ? 'fire-text' : ''}`}>{slide.badge}</span>
                </div>
              )}
            
            {slide.icon && <div className="mb-4">{slide.icon}</div>}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white max-w-4xl" style={{ textShadow: '0 0 20px rgba(0,0,0,0.7)' }}>
                {slide.title}
            </h1>

            {slide.price && (
              <div className="flex items-center gap-2 sm:gap-4 my-4">
                <span className="text-2xl md:text-3xl text-gray-500 line-through">{slide.price.old}</span>
                <span className="text-4xl md:text-5xl font-bold text-yellow-400">{slide.price.new}</span>
              </div>
            )}
            
            <p className="text-base md:text-lg text-gray-300 mt-4 max-w-2xl">{slide.subtitle}</p>

            <button className="mt-6 sm:mt-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-[0_0_20px_#d946ef]">
                {slide.cta}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 sm:px-4 z-20">
        <button onClick={() => paginate(-1)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 active:bg-white/5 transition-colors"><ChevronLeft /></button>
        <button onClick={() => paginate(1)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 active:bg-white/5 transition-colors"><ChevronRight /></button>
      </div>

      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
        {slides.map((s, i) => (
          <div key={s.id} onClick={() => setPage([i, i > page ? 1 : -1])}
               className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${page === i ? 'bg-white w-6' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
