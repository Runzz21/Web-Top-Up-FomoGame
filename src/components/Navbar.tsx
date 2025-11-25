// src/components/Navbar.tsx → VERSI SUPABASE (PASTI JALAN!)
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'
import { LogOut, History } from 'lucide-react'
import { useUser } from '../hooks/useUser'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logout berhasil!')
    navigate('/')
  }

  // Biar gak flash pas loading
  if (loading) {
    return (
      <nav className="h-16 bg-black/90 border-b border-white/10" />
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="FomoGame" className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold gradient-text">FomoGame</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-rose-400 transition">
                  <History className="w-5 h-5" />
                  <span className="hidden sm:inline">Riwayat</span>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs text-gray-400">User</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-rose-400 transition">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient px-5 py-2 rounded-lg text-sm font-bold"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}