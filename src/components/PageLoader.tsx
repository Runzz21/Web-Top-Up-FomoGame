// src/components/PageLoader.tsx → PERSIS BANGET KAYAK FOTO TERAKHIR LU — CANTIK GILA!
import { motion } from 'framer-motion'
import logo from '../assets/logo.png' // PASTIKAN LOGO LU DI src/assets/logo.png

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* CARD LOGO MIRING + GLOW PINK */}
      <motion.div
        initial={{ y: -100, rotate: -25, opacity: 0 }}
        animate={{ y: 0, rotate: -15, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mb-20"
      >
        {/* GLOW EFEK */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/40 to-purple-600/40 blur-3xl scale-150 animate-pulse" />
        
        {/* CARD LOGO */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl p-10 border-4 border-rose-500/60 shadow-2xl">
          <img 
            src={logo} 
            alt="FomoGame" 
            className="w-32 h-32 mx-auto"
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/128x128/1a1a1a/rose-500?text=F"}
          />
        </div>
      </motion.div>

      {/* TULISAN FOMOGAME — GEDE + GRADIENT */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-8xl md:text-9xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl"
        style={{ textShadow: '0 0 60px rgba(244, 63, 94, 0.8)' }}
      >
        FOMOGAME
      </motion.h1>

      {/* TULISAN LOADING AWESOMENESS */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="text-2xl text-gray-400 mt-8 font-medium tracking-wider"
      >
        Loading....
      </motion.p>

      {/* EFEK GLOW BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    </div>
  )
}