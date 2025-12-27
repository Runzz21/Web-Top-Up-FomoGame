// src/pages/PopularGames.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gamesData from '../data/games.json';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';


// Use the full games data
const allGames = gamesData;

export default function PopularGames() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState(allGames);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const filtered = allGames.filter(game =>
        game.name.toLowerCase().includes(query)
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames(allGames);
    }
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Jelajahi Semua Game
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Temukan dan top up game favoritmu dengan harga terbaik, proses cepat dan aman hanya di FomoGame.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400" size={24} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game..."
                className="w-full pl-16 pr-6 py-4 bg-gray-950/80 backdrop-blur-sm border-2 border-purple-500/50 rounded-full text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>
          </motion.div>

          {/* Games Grid */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <button
                    onClick={() => navigate(`/game/${game.slug}`)}
                    className="group relative w-full"
                    title={game.name}
                  >
                    <div className="bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800 transition-all duration-300 group-hover:border-rose-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-rose-500/40 group-active:scale-100 group-active:border-rose-600 aspect-square flex items-center justify-center">
                      <img
                        src={game.icon}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/150/1a1a1a/FFFFFF?text=Error';
                        }}
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 flex flex-col justify-end text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-bold text-sm leading-tight">
                          {game.name}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            ) : (
                <div className="col-span-full text-center py-20">
                    <h3 className="text-2xl font-bold text-rose-500">Game tidak ditemukan</h3>
                    <p className="text-gray-400 mt-2">Coba cari dengan kata kunci yang lain.</p>
                </div>
            )}
          </motion.div>
        </main>
      </div>
      <Footer />
    </>
  );
}
