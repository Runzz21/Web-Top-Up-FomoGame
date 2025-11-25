// src/layouts/AdminLayout.tsx → VERSI SUPER RAPIH + GANTENG ABIS 2025
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../hooks/useUser'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.png'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-6xl text-rose-500 font-black animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!user || user.email !== 'admin@fomogame.com') {
    navigate('/', { replace: true })
    return null
  }

  const menu = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Games', path: '/admin/games' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Users', path: '/admin/users' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    toast.success('Logout sukses, Boss!')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* SIDEBAR — RAPET BANGET */}
      <div className="w-80 bg-gradient-to-b from-black via-gray-950 to-black border-r border-rose-900/30 flex flex-col">
        
        {/* LOGO DI TENGAH ATAS */}
        <div className="flex-1 flex flex-col items-center justify-start pt-16 pb-12">
          <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl rounded-3xl border-4 border-rose-500/40 shadow-2xl shadow-rose-500/30">
            <img 
              src={logo} 
              alt="FomoGame" 
              className="w-56 h-56 object-contain"
            />
          </div>
        </div>

        {/* MENU — RAPET, SIMETRIS, GANTENG */}
        <nav className="flex-1 px-8 space-y-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block w-full text-center py-5 px-8 text-2xl font-black rounded-2xl transition-all duration-300
                ${location.pathname === item.path
                  ? 'bg-gradient-to-r from-rose-600 to-purple-700 text-white shadow-2xl shadow-rose-600/50 scale-105'
                  : 'text-gray-500 hover:text-white hover:bg-gray-900/70 hover:scale-105'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* LOGOUT — RAPIH DI BAWAH BANGET */}
        <div className="p-8 pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-2xl py-6 rounded-2xl shadow-2xl hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            LOGOUT
          </button>
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-12 bg-gradient-to-br from-black via-[#0a0a0a] to-purple-950/30">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}