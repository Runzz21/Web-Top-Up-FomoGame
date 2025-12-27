// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, History, Settings, Search, X, Frown, Menu, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';
import gamesData from '../data/games.json';
import MobileSidebar from './MobileSidebar';

const allGames = gamesData.map(game => ({
    ...game,
    icon: game.icon || 'https://via.placeholder.com/100x100/1a1a1a/FFFFFF?text=?'
}));

export default function Navbar() {
  const { user, loading } = useUser();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allGames>([]);
  const [notFound, setNotFound] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout: ' + error.message);
    } else {
      toast.success('Logout berhasil!');
      setIsMobileMenuOpen(false);
      window.location.href = '/login'; // Redirect to the general login page with a full reload
    }
  };

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setNotFound(false);
      return;
    }

    const handler = setTimeout(() => {
        const query = searchQuery.trim().toLowerCase();
        if (query === '') {
            setSearchResults([]);
            setNotFound(false);
        } else {
            const found = allGames.filter(game => 
                game.name.toLowerCase().includes(query) || 
                game.slug.toLowerCase().includes(query)
            );
            setSearchResults(found);
            setNotFound(found.length === 0);
        }
    }, 100);

    return () => {
        clearTimeout(handler);
    };
  }, [searchQuery, isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/game/${searchResults[0].slug}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
      { text: "Beranda", href: "/"},
      { text: "Game Populer", href: "/popular-games"},
      { text: "Promo", href: "/promo"},
  ];

  if (loading) {
    return <header className="h-20 bg-black/90 border-b border-white/10" />;
  }

  return (
    <header className="sticky top-0 z-40">
        <nav className="bg-black/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger Menu */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-300 hover:text-white active:text-rose-400">
                                <Menu size={28} />
                            </button>
                        </div>
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
                            <img src={logo} alt="FomoGame" className="h-12 w-12 rounded-lg" />
                            <span className="hidden sm:inline text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">FomoGame</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <a key={link.text} href={link.href} className="text-gray-300 hover:text-rose-400 active:text-white transition-colors font-semibold">
                                {link.text}
                            </a>
                        ))}
                    </div>

                    {/* Right side: Search, Auth */}
                    <div className="flex items-center space-x-2 gap-2 sm:space-x-4">
                        <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-300 hover:text-white active:text-rose-400 transition-colors">
                            <Search size={22} />
                        </button>
                        
                        {!user && (
                            <Link to="/login" className="md:hidden text-gray-300 hover:text-rose-400 active:text-white transition-colors font-semibold px-3 py-1.5 rounded-lg">
                                Masuk
                            </Link>
                        )}

                        {user ? (
                        <div className="relative hidden md:block group">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <img 
                                    src={user.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.email}`} 
                                    alt="Avatar" 
                                    className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 object-cover"
                                />
                                <span className="hidden sm:inline font-semibold text-white">
                                    {user.user_metadata?.name?.split(' ')[0] || user.email}
                                </span>
                                <ChevronDown 
                                    size={20} 
                                    className="text-gray-400 transition-transform duration-300 group-hover:rotate-180" 
                                />
                            </div>
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-lg py-2
                                            opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 origin-top-right pointer-events-none group-hover:pointer-events-auto">
                                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 active:bg-white/10">
                                    <History size={16} /> Riwayat
                                </Link>
                                <Link to="/settings/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 active:bg-white/10">
                                    <Settings size={16} /> Pengaturan
                                </Link>
                                <div className="border-t border-white/10 my-1" />
                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-white/5 active:bg-white/10">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                        ) : (
                        <div className="hidden sm:flex items-center space-x-4">
                            <Link to="/login" className="text-gray-300 hover:text-rose-400 active:text-white transition-colors font-semibold">Masuk</Link>
                            <Link to="/register" className="bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold px-5 py-2 rounded-lg text-sm shadow-lg hover:scale-105 active:scale-100 transition-transform">
                                Daftar
                            </Link>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        
        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} handleLogout={handleLogout} />

        {/* Search Modal */}
        <AnimatePresence>
            {isSearchOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center pt-20"
                onClick={() => setSearchOpen(false)}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="relative w-full max-w-2xl h-fit bg-gray-950 border-2 border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <form onSubmit={handleSearchSubmit}>
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400" size={24} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari game favoritmu..."
                                className="w-full pl-16 pr-16 py-5 bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none"
                                autoFocus
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="absolute top-1/2 right-5 -translate-y-1/2 text-gray-500 hover:text-white active:text-rose-400 transition-colors">
                                <X size={28}/>
                            </button>
                        </div>
                    </form>

                    <AnimatePresence mode="wait">
                        {searchQuery.length > 0 && (
                            <motion.div
                                key={notFound ? 'not-found' : 'results'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-purple-500/30"
                            >
                                {notFound ? (
                                    <div className="flex flex-col items-center justify-center text-center p-8 h-48">
                                        <Frown size={48} className="text-rose-500/50 mb-4" />
                                        <p className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                                            Game Tidak Ditemukan
                                        </p>
                                        <p className="text-gray-400 mt-1">
                                            Coba gunakan kata kunci lain.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="py-2 max-h-[60vh] overflow-y-auto">
                                        {searchResults.map((game) => (
                                            <li key={game.id}>
                                                <Link
                                                    to={`/game/${game.slug}`}
                                                    onClick={() => setSearchOpen(false)}
                                                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-gradient-to-r from-purple-600/10 to-rose-500/10 active:bg-gradient-to-l transition-all duration-300"
                                                >
                                                    <img src={game.icon} alt={game.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/10" />
                                                    <span className="text-white font-semibold text-lg">{game.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    </header>
  );
}
