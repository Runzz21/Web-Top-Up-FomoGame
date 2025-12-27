// src/components/MobileSidebar.tsx
import {
  Home,
  Flame,
  Gift,
  History,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './MobileSidebar.css';
// FloatingParticles import removed

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const MobileSidebar = ({ isOpen, setIsOpen, handleLogout }: MobileSidebarProps) => {
  const { user } = useUser();
  const location = useLocation();

  const navLinks = [
    { text: 'Beranda', href: '/', icon: Home },
    { text: 'Game Populer', href: '/popular-games', icon: Flame },
    { text: 'Promo & Bonus', href: '/promo', icon: Gift, hot: true },
    { text: 'Riwayat Top Up', href: '/dashboard', icon: History },
    { text: 'Pengaturan', href: '/settings/profile', icon: Settings },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24, staggerChildren: 0.05 },
    },
    closed: { opacity: 0, y: 20 },
  };

  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.email}`;

  return (
    <motion.div
      className="mobile-sidebar"
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: { display: 'block' },
        closed: { display: 'none', transition: { delay: 0.5 } }
      }}
    >
      <motion.div
        className="sidebar-backdrop"
        onClick={() => setIsOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div className="sidebar-content" variants={sidebarVariants}>
        {/* FloatingParticles component removed */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 text-center border-b border-purple-500/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white active:text-rose-400">
              <X />
            </button>
            {user && (
              <div className="mt-6">
                <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full mx-auto border-2 border-purple-500 avatar-glow object-cover" />
                <p className="font-bold text-white mt-3 truncate">{user.user_metadata?.name || user.email}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <motion.nav className="flex-grow p-4" variants={itemVariants}>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <li key={link.text}>
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                      <link.icon className="w-6 h-6 icon" />
                      <span className="flex-grow">{link.text}</span>
                      {link.hot && <span className="hot-badge">HOT</span>}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button onClick={handleLogout} className="nav-link logout-link w-full">
                  <LogOut className="w-6 h-6 icon" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </motion.nav>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/20">
            <button className="w-full text-center font-bold py-3 rounded-lg support-button hover:scale-105 active:scale-100">
              Chat Admin 24/7
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              © 2025 FomoGame – Top Up Termurah & Tercepat
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileSidebar;
