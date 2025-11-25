// src/pages/Login.tsx → FINAL FIX: GAK ADA ERROR LAGI + LOGIN JALAN GILA!
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'  // PASTIKAN INI BENAR!
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email dan password harus diisi!')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Error umum dari Supabase
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email atau password salah bro!')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email belum diverifikasi! Cek inbox/spam lu.')
        } else {
          toast.error(error.message)
        }
        console.error('Login error:', error)
      } else if (data.user) {
        toast.success('Login berhasil! Selamat datang kembali!')

        // Redirect logic
        const from = (location.state as any)?.from?.pathname
        if (from && (from.includes('/checkout') || from.includes('/game'))) {
          navigate(from, { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan jaringan!')
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/30 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* LOGO & TITLE */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse"></div>
            <img
              src={logo}
              alt="FomoGame"
              className="w-32 h-32 mx-auto relative z-10 drop-shadow-2xl rounded-full border-4 border-rose-500/40"
            />
          </div>
          <h1 className="text-5xl font-black mt-6 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-300 mt-3 text-lg">Masuk dan top up diamond termurah sekarang!</p>
        </div>

        {/* FORM */}
        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-gray-800 shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition text-white placeholder-gray-500"
                placeholder="contoh@gmail.com"
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition text-white pr-14"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-11 text-gray-400 hover:text-rose-400 transition"
                disabled={loading}
              >
                {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-500 hover:to-purple-600 py-5 rounded-2xl text-2xl font-black tracking-wider transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Sedang masuk...' : 'MASUK SEKARANG'}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-400">
              Belum punya akun?{' '}
              <Link to="/register" className="text-rose-400 font-bold hover:text-rose-300 transition">
                Daftar Gratis
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Admin? Login di{' '}
              <Link to="/admin/login" className="text-rose-400 underline hover:text-rose-300">
                sini
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-10">
          © 2025 FomoGame • Top Up Diamond Termurah & Tercepat 24 Jam
        </p>
      </div>
    </div>
  )
}