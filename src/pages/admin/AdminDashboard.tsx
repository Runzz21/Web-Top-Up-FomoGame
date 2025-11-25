// src/pages/admin/AdminDashboard.tsx → VERSI FINAL + LOGO + LIVE ORDER + KEREN GILA!
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.png' // LOGO LU DI SINI!

interface Transaction {
  id: string
  user_id: string
  game_name: string
  user_game_id: string
  zone?: string
  product_name: string
  amount: number
  payment_method: string
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

export default function AdminDashboard() {
  const { user, loading } = useUser()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // Proteksi admin
  useEffect(() => {
    if (!loading && (!user || user.email !== 'admin@fomogame.com')) {
      toast.error('Akses ditolak! Admin only.')
      navigate('/')
    }
  }, [user, loading, navigate])

  // Fetch semua order (LIVE)
  const fetchOrders = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal ambil order!')
      console.error(error)
    } else {
      setTransactions(data || [])
    }
    setRefreshing(false)
  }

  useEffect(() => {
    if (user?.email === 'admin@fomogame.com') {
      fetchOrders()
      // Auto refresh tiap 10 detik
      const interval = setInterval(fetchOrders, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Tombol SUCCESS
  const handleSuccess = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'success' })
      .eq('id', id)

    if (error) {
      toast.error('Gagal update status!')
    } else {
      toast.success('Order berhasil diproses!')
      fetchOrders() // refresh langsung
    }
  }

  if (loading || !user || user.email !== 'admin@fomogame.com') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-5xl text-rose-500 animate-pulse">Loading Admin Panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-purple-900/50">
      {/* HEADER DENGAN LOGO */}
      <div className="border-b border-gray-800 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="FomoGame" className="w-16 h-16 rounded-xl shadow-2xl" />
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                ADMIN PANEL
              </h1>
              <p className="text-gray-400">Logged in as: <span className="text-rose-400 font-bold">{user.email}</span></p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="bg-gradient-to-r from-rose-600 to-purple-600 px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl flex items-center gap-3"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Orders'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* JUDUL ORDER LIVE */}
        <div className="text-center mb-10">
          <h2 className="text-8xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent inline-block">
            SEMUA ORDER (LIVE)
          </h2>
          <p className="text-2xl text-gray-400 mt-4">Auto refresh tiap 10 detik • Total: {transactions.length} order</p>
        </div>

        {/* TABEL ORDER */}
        {transactions.length === 0 ? (
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-20 text-center border border-dashed border-gray-700">
            <p className="text-5xl text-gray-500 mb-6">Belum ada order masuk</p>
            <p className="text-2xl text-gray-400">Tunggu user top-up bro!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-gray-800 hover:border-rose-500/70 transition-all hover:shadow-2xl hover:shadow-rose-500/30">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="bg-gray-800 p-4 rounded-2xl">
                        <p className="text-3xl font-black text-rose-400">{tx.game_name}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">ID: {tx.user_game_id} {tx.zone && <span className="text-gray-400">({tx.zone})</span>}</p>
                        <p className="text-xl text-rose-300">{tx.product_name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-lg">
                      <p><span className="text-gray-500">Harga:</span> <strong className="text-rose-400 text-3xl font-black">Rp {tx.amount.toLocaleString('id-ID')}</strong></p>
                      <p><span className="text-gray-500">Metode:</span> <strong className="text-white">{tx.payment_method}</strong></p>
                      <p><span className="text-gray-500">Status:</span> <span className={`font-bold ${tx.status === 'pending' ? 'text-yellow-400' : tx.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{tx.status.toUpperCase()}</span></p>
                      <p><span className="text-gray-500">Waktu:</span> <span className="text-gray-300">{new Date(tx.created_at).toLocaleString('id-ID')}</span></p>
                    </div>
                  </div>

                  {/* TOMBOL SUCCESS */}
                  <div className="flex gap-4">
                    {tx.status === 'pending' && (
                      <button
                        onClick={() => handleSuccess(tx.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-10 py-6 rounded-2xl font-black text-xl text-white transition-all hover:scale-110 shadow-xl"
                      >
                        MARK AS SUCCESS
                      </button>
                    )}
                    {tx.status === 'success' && (
                      <div className="bg-green-500/20 border-2 border-green-500 px-10 py-6 rounded-2xl font-black text-green-400 text-xl">
                        SUDAH DIPROSES
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}