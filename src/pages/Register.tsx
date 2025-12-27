import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.png'
import ParticlesBackground from '../components/ParticlesBackground' // Import ParticlesBackground

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }  // simpan nama ke profile user
      }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Akun berhasil dibuat! Silakan login')
      navigate('/login')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground /> {/* Add ParticlesBackground component */}

      {/* CONTENT REGISTER — DI DEPAN BACKGROUND */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-rose-500/30 blur-3xl rounded-full animate-pulse" />
              <img
                src={logo}
                alt="FomoGame"
                className="w-32 h-32 mx-auto relative z-10 drop-shadow-2xl rounded-full border-4 border-rose-500/40"
              />
            </div>
            <h1 className="text-5xl font-black mt-6 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
              Daftar Sekarang
            </h1>
            <p className="text-gray-300 mt-3 text-lg">Gabung jadi bagian dari FomoGame!</p>
          </div>

          <div className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-gray-800 shadow-2xl p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition text-white placeholder-gray-500"
                  placeholder="Nama kamu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition text-white placeholder-gray-500"
                  placeholder="email@contoh.com"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition text-white pr-14"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-11 text-gray-400 hover:text-rose-400 transition"
                >
                  {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-500 hover:to-purple-600 py-5 rounded-2xl text-2xl font-black tracking-wider transition transform hover:scale-105 shadow-lg"
              >
                Buat Akun Gratis
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-rose-400 font-bold hover:text-rose-300 transition">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}