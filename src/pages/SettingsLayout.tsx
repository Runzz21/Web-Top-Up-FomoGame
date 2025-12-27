// src/pages/SettingsLayout.tsx
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Shield } from 'lucide-react';

const settingsNav = [
  { name: 'Profil', href: '/settings/profile', icon: User },
  { name: 'Keamanan', href: '/settings/security', icon: Shield },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-[#050010] to-[#0a001a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Pengaturan Akun
            </h1>
            <p className="text-xl text-gray-400">Kelola informasi akun dan keamanan Anda.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <nav className="space-y-2">
                {settingsNav.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition-all duration-300
                      ${isActive
                        ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    {children}
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
