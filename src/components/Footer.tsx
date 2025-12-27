// src/components/Footer.tsx
import { Instagram, Youtube, Bot, Zap, Lock, BadgePercent, Wallet, Mail, Star } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

// Payment Logos
import gopay from '../assets/payment-logos/gopay.webp';
import dana from '../assets/payment-logos/dana.webp';
import ovo from '../assets/payment-logos/ovo.webp';
import shoopepay from '../assets/payment-logos/shoopepay.webp';
import qris from '../assets/payment-logos/qris.webp';
import alfamart from '../assets/payment-logos/alfamart.webp';
import indomaret from '../assets/payment-logos/indomaret.webp';
import banktransfer from '../assets/payment-logos/bank-transfer.webp';

const paymentMethods = [
  { name: 'GoPay', logo: gopay },
  { name: 'DANA', logo: dana },
  { name: 'OVO', logo: ovo },
  { name: 'ShopeePay', logo: shoopepay },
  { name: 'QRIS', logo: qris },
  { name: 'Alfamart', logo: alfamart },
  { name: 'Indomaret', logo: indomaret },
  { name: 'Bank Transfer', logo: banktransfer },
];

const socialLinks = [
  { icon: <Instagram size={24} />, href: '#', name: 'Instagram' },
  { icon: <Youtube size={24} />, href: '#', name: 'YouTube' },
  { icon: <Bot size={24} />, href: '#', name: 'Discord' },
];

const quickLinks = [
  { href: '/', text: 'Beranda' },
  { href: '/#game-populer', text: 'Game Populer' },
  { href: '/#promo', text: 'Promo & Bonus' },
  { href: '/how-to-top-up', text: 'Cara Top Up' },
];

const trustBadges = [
  { icon: <Star size={20} className="text-yellow-400" />, text: 'Terpercaya 1 Juta+ Gamer' },
  { icon: <BadgePercent size={20} className="text-green-400" />, text: 'Partner Resmi' },
  { icon: <Lock size={20} className="text-blue-400" />, text: 'SSL Secured' },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-black via-[#050010] to-[#0a001a] text-gray-300 pt-24 pb-8 overflow-hidden">
      <FloatingParticles />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0 0 10px rgba(217, 70, 239, 0.6))' }}>
              FomoGame
            </h2>
            <p className="max-w-xs mb-6 text-gray-400">Top Up Diamond Termurah, Tercepat & Teraman se-Indonesia</p>
            <p className="text-xs text-gray-500">&copy; 2025 FomoGame. All rights reserved.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Navigasi Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.text}>
                  <a href={link.href} className="hover:text-rose-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-2 h-2 bg-rose-500 rounded-full transition-all duration-300 group-hover:w-4"></span>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Payment Methods */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Metode Pembayaran</h3>
            <div className="grid grid-cols-4 gap-4">
              {paymentMethods.slice(0, 12).map((p) => (
                <div key={p.name} className="bg-white/5 p-2 rounded-lg flex justify-center items-center backdrop-blur-sm border border-white/10 hover:border-rose-500/50 transition-all duration-300">
                  <img src={p.logo} alt={p.name} className="h-6 object-contain" title={p.name} />
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4 font-semibold text-gray-400">100% Aman • Proses Instan</p>
          </div>

          {/* Column 4: Support & Social */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Butuh Bantuan?</h3>
            <a href="#" className="flex items-center justify-center gap-3 w-full bg-green-500/10 border-2 border-green-500 text-white font-bold py-3 px-4 rounded-xl mb-6 transition-all duration-300 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              <Zap size={20} />
              Chat Admin (24/7)
            </a>
            <div className="space-y-3 text-gray-400">
              <a href="mailto:support@fomogame.com" className="flex items-center gap-3 hover:text-rose-400 transition-colors">
                <Mail size={20} /> support@fomogame.com
              </a>
              <div className="flex items-center gap-4 pt-4">
                {socialLinks.map(social => (
                  <a key={social.name} href={social.href} className="text-gray-500 hover:text-white hover:scale-110 transition-all duration-300 hover:[&_svg]:drop-shadow-[0_0_8px_rgba(217,70,239,0.7)]">
                    {social.icon}
                  </a>
                ))}
              </div>
              <div className="pt-4 space-y-3">
                {trustBadges.map(badge => (
                   <div key={badge.text} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                     {badge.icon}
                     <span>{badge.text}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            FomoGame – Website Top Up Game Aman, Cepat & Termurah se-Indonesia
          </p>
          <div className="flex items-center gap-6 text-gray-500">
             <Lock size={18} />
             <Zap size={18} />
             <Wallet size={18} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
