// src/pages/admin/AdminLogin.tsx → FINAL + FLOATING LINES BACKGROUND CANTIK GILA!
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

// IMPORT FLOATING LINES — SESUAIKAN PATH LU!
import FloatingLines from '../../components/FloatingLines' // atau '../../components/FloatingLines-TS-TW' kalau nama filenya gitu

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
      const isAdmin = data.user?.email === 'admin@fomogame.com' || 
                      data.user?.user_metadata?.role === 'admin'

      if (isAdmin) {
        toast.success('Login Admin Berhasil!')
        navigate('/admin')
      } else {
        await supabase.auth.signOut()
        toast.error('Akses ditolak. Hanya Admin yang boleh masuk.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* FLOATING LINES BACKGROUND — CANTIK GILA! */}
      <div className="fixed inset-0 -z-50">
        <FloatingLines
          lineCount={[10, 8, 12]}
          lineDistance={[10, 8, 12]}
          animationSpeed={0.6}
          interactive={true}
          parallax={true}
          parallaxStrength={0.3}
          linesGradient={['#ff006e', '#a855f7', '#3b82f6']} // Pink → Purple → Blue neon
        />
      </div>

      {/* CONTENT ADMIN LOGIN — DI DEPAN BACKGROUND */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-900/90 backdrop-blur-2xl p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
          <h1 className="text-5xl font-black text-center mb-8 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800/70 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition text-white placeholder-gray-500"
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800/70 border border-gray-700 rounded-xl focus:border-rose-500 focus:outline-none transition text-white"
              required
              disabled={loading}
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-500 hover:to-purple-600 py-5 rounded-xl text-xl font-black tracking-wider transition transform hover:scale-105 disabled:opacity-70 shadow-lg"
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
    </div>
  )
}