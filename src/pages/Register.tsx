import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'          // YANG BARU!
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.png'

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img 
            src={logo} 
            alt="FomoGame" 
            className="w-32 h-32 mx-auto mb-4 drop-shadow-2xl rounded-full border-4 border-rose-500/30"
          />
          <h1 className="text-4xl font-bold gradient-text">Daftar Sekarang</h1>
          <p className="text-gray-400 mt-2">Gabung jadi bagian dari FomoGame!</p>
        </div>

        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition" 
                placeholder="Nama kamu" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition" 
                placeholder="email@contoh.com" 
                required 
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition pr-14"
                placeholder="Minimal 6 karakter"
                minLength={6}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-11 text-gray-400 hover:text-white"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full btn-gradient py-5 rounded-xl text-xl font-bold hover:scale-105 transition transform"
            >
              Buat Akun Gratis
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-rose-400 font-bold hover:text-rose-300">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}