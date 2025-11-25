// src/pages/admin/AdminLogin.tsx → VERSI SUPABASE (PASTI JALAN!)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      // Cek apakah user ini admin
      const isAdmin = data.user?.email === 'admin@fomogame.com' || 
                      data.user?.user_metadata?.role === 'admin'

      if (isAdmin) {
        toast.success('Login Admin Berhasil!')
        navigate('/admin')
      } else {
        // Logout otomatis kalau bukan admin
        await supabase.auth.signOut()
        toast.error('Akses ditolak. Hanya Admin yang boleh masuk.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 flex items-center justify-center p-4">
      <div className="bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
        <h1 className="text-5xl font-black text-center mb-8 gradient-text">
          Admin Login
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email Admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-gray-800/70 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 bg-gray-800/70 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition"
            required
            disabled={loading}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-gradient py-5 rounded-xl text-xl font-bold hover:scale-105 transition transform disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login Admin'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            <span className="font-bold text-rose-400">Admin Account:</span><br />
            Email: admin@fomogame.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  )
}